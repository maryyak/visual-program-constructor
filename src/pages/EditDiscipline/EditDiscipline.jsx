import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from "react-router-dom";
import styles from "./EditDiscipline.module.scss";
import clsx from "clsx";
import TopicViewer from "./components/TopicViewer/TopicViewer";
import useDisciplinesModules from "../../hooks/api/disciplines/useDisciplinesModules";
import {DragDropContext, Draggable, Droppable} from "@hello-pangea/dnd";
import Notification from "../../components/Notification/Notification"
import useUserDisciplines from "../../hooks/api/disciplines/useUserDIsciplines";
import useUserModules from "../../hooks/api/modules/useUserModules";
import BackButton from "../../components/BackButton/BackButton";
import EditorsBlock from "../../components/EditorsBlock/EditorsBlock";
import useDisciplineUsers from "../../hooks/api/disciplines/useDisciplineUsers";

const API_URL = process.env.REACT_APP_API_URL;

const EditDiscipline = () => {
    const {id} = useParams();
    const {userDisciplines, loading, error} = useUserDisciplines();
    const discipline = userDisciplines.find((disc) => disc.id === Number(id));

    const {modules: disciplineModulesFromAPI} = useDisciplinesModules(id);
    const {userModules: availableModules, loading: loadingAvailable} = useUserModules();

    const [title, setTitle] = useState(discipline?.title || "");
    const [description, setDescription] = useState(discipline?.description || "");

    const [disciplineModules, setDisciplineModules] = useState([]);
    const [initialModules, setInitialModules] = useState([]);

    const [showNotification, setNotification] = useState(false);
    const [notificationMessage, setNotificationMessage] = useState("");

    const {
        disciplineUsers,
        loading: disciplineUsersLoading,
        error: disciplineUsersError,
        mutate: disciplineUsersMutate
    } = useDisciplineUsers(id)

    const navigate = useNavigate();

    useEffect(() => {
        if (disciplineModulesFromAPI) {
            setDisciplineModules(disciplineModulesFromAPI);
            setInitialModules(disciplineModulesFromAPI);
        }
    }, [disciplineModulesFromAPI]);

    useEffect(() => {
        setTitle(discipline?.title || "");
        setDescription(discipline?.description || "");
    }, [discipline]);

    const onDragEnd = (result) => {
        const {source, destination, draggableId} = result;
        if (!destination) return;

        // Перестановка внутри дисциплины
        if (source.droppableId === "disciplineModules" && destination.droppableId === "disciplineModules") {
            const updatedModules = Array.from(disciplineModules);
            const [removed] = updatedModules.splice(source.index, 1);
            updatedModules.splice(destination.index, 0, removed);
            setDisciplineModules(updatedModules);
        }
        // Перетаскивание из темы в дисциплину
        else if (source.droppableId === "topicModules" && destination.droppableId === "disciplineModules") {
            const moduleToAdd = availableModules.find(
                (mod) => String(mod.id) === draggableId.replace("module-", "")
            );
            if (!moduleToAdd) return;
            setDisciplineModules(prevModules => {
                if (!prevModules.find(mod => mod.id === moduleToAdd.id)) {
                    const newModules = Array.from(prevModules);
                    newModules.splice(destination.index, 0, moduleToAdd);
                    return newModules;
                }
                return prevModules;
            });
        }
        // Перетаскивание из дисциплины обратно в тему (удаление)
        else if (source.droppableId === "disciplineModules" && destination.droppableId === "topicModules") {
            setDisciplineModules(prevModules =>
                prevModules.filter(mod => String(mod.id) !== draggableId.replace("module-", ""))
            );
        }
    };

    const handleModuleRemove = (module) => {
        setDisciplineModules(prevModules =>
            prevModules.filter(mod => mod.id !== module.id)
        );
    };

    // Функция выдачи прав доступа
    const handleGiveAccess = async (user, disciplineId) => {
        try {
            const response = await fetch(`${API_URL}/user-disciplines/${disciplineId}/user/${user.id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
            });

            const data = await response.json();

            if (!response.ok) {
                const message = data.error || 'Ошибка при выдаче доступа';
                setNotificationMessage(message);
                setNotification(true);
                throw new Error(message);
            }

            console.log('Права доступа успешно выданы:', data);
            setNotificationMessage(`Пользователь ${user.username} получил доступ к дисциплине`);
            setNotification(true);
            disciplineUsersMutate()
        } catch (err) {
            console.error('Ошибка:', err);
        }
    };

    const handleSaveChanges = async () => {
        try {
            // Определяем добавленные модули
            const addedModules = disciplineModules.filter(
                mod => !initialModules.find(init => init.id === mod.id)
            );
            // Определяем удалённые модули
            const removedModules = initialModules.filter(
                init => !disciplineModules.find(mod => mod.id === init.id)
            );

            await fetch(`${API_URL}/disciplines/${id}`, {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({title, description})
            });

            // Сохраняем новые модули
            for (let mod of addedModules) {
                const order = disciplineModules.findIndex(item => item.id === mod.id);
                await fetch(`${API_URL}/disciplines/${id}/modules`, {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({moduleId: mod.id, order})
                });
            }

            // Удаляем модули, которых больше нет
            for (let mod of removedModules) {
                await fetch(`${API_URL}/disciplines/${id}/modules/${mod.id}`, {
                    method: 'DELETE'
                });
            }

            // Обновляем порядок для всех модулей (как добавленных, так и уже существующих)
            for (let i = 0; i < disciplineModules.length; i++) {
                const mod = disciplineModules[i];
                await fetch(`${API_URL}/disciplines/${id}/modules/${mod.id}`, {
                    method: 'PUT',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({order: i})
                });
            }

            setInitialModules([...disciplineModules]);
            setNotificationMessage("Изменения успешно сохранены!");
            setNotification(true);

        } catch (error) {
            console.error('Ошибка сохранения:', error);
            setNotificationMessage(`Ошибка сохранения: ${error}`);
            setNotification(true);
        }
    };

    const deleteModule = async () => {
        try {
            const response = await fetch(`${API_URL}/disciplines/${discipline.id}`, {
                method: "DELETE",
                headers: {"Content-Type": "application/json"},
            });

            if (!response.ok) throw new Error("Ошибка удаления дисциплины");
            if (response.ok) navigate('/my-disciplines');
        } catch (error) {
            console.error("Ошибка:", error);
        }
    }

    if (loading || loadingAvailable) return <p>Загрузка...</p>;
    if (error) return <p style={{color: "red"}}>Ошибка: {error}</p>;

    return (
        <>
            <BackButton link={'/my-disciplines'}/>
            <DragDropContext onDragEnd={onDragEnd}>
                <div className={styles.page}>
                    <div className={clsx(styles.colContainer, styles.aside)}>
                        <div className={styles.sideContainer}>
                            <TopicViewer availableModules={availableModules} disciplineModules={disciplineModules}/>
                            <EditorsBlock handleGiveAccess={handleGiveAccess} data={disciplineUsers}
                                          loading={disciplineUsersLoading} error={disciplineUsersError}
                                          elementId={discipline.id}/>
                            <div onClick={() => deleteModule()} className={styles.deleteBtn}>Удалить дисциплину</div>
                        </div>
                    </div>
                    <div className={clsx(styles.colContainer, styles.main)}>
                        <div className={styles.titleContainer}>
                            <span className={styles.heading}>Название дисциплины</span>
                            <span
                                contentEditable
                                suppressContentEditableWarning
                                onBlur={(e) => setTitle(e.target.innerText)}
                                className={clsx(styles.editable, styles.title)}
                            >
                            {title}
                        </span>
                        </div>
                        <div className={styles.titleContainer}>
                            <span className={styles.heading}>Описание</span>
                            <span
                                contentEditable
                                suppressContentEditableWarning
                                onBlur={(e) => setDescription(e.target.innerText)}
                                className={clsx(styles.editable, styles.title)}
                            >
                            {description}
                        </span>
                        </div>
                        <div className={styles.titleContainer}>
                            <span className={styles.heading}>Содержание</span>
                            <Droppable droppableId="disciplineModules">
                                {(provided) => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.droppableProps}
                                        className={styles.disciplineContainer}
                                    >
                                        {disciplineModules.map((mod, index) => (
                                            <Draggable
                                                key={mod.id}
                                                draggableId={String(mod.id)}
                                                index={index}
                                            >
                                                {(provided) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        className={styles.disciplineBlock}
                                                    >
                                                        {mod.title || mod.name}
                                                        <button className={styles.deleteButton}
                                                                onClick={() => handleModuleRemove(mod)}>✖
                                                        </button>
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </div>
                        <div className={styles.editGroup}>
                            <div className={styles.elements}>
                            </div>
                            <div className={styles.actions}>
                                <div className={styles.actionsItem} onClick={handleSaveChanges}>
                                    Сохранить изменения
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </DragDropContext>
            {showNotification && (
                <Notification
                    message={notificationMessage}
                    onClose={() => setNotification(false)}
                />
            )}
        </>
    );
};

export default EditDiscipline;
