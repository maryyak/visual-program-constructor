import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from "react-router-dom";
import clsx from "clsx";
import {DragDropContext, Draggable, Droppable} from "@hello-pangea/dnd";
import useStudyplansDisciplines from "../../hooks/api/studyplans/useStudyplansDisciplines";
import styles from "./EditStudyplan.module.scss"
import DisciplineViewer from "./components/DisciplineViewer/DisciplineViewer";
import StudyplanDiscipline from "./components/StudyplanDiscipline/StudyplanDiscipline";
import Notification from "../../components/Notification/Notification";
import useUserDisciplines from "../../hooks/api/disciplines/useUserDIsciplines";
import BackButton from "../../components/BackButton/BackButton";
import EditorsBlock from "../../components/EditorsBlock/EditorsBlock";
import useStudyplanUsers from "../../hooks/api/studyplans/useStudyplanUsers";
import {useUserStudyplans} from "../../components/UserStudyplansContext";

const API_URL = process.env.REACT_APP_API_URL;

const EditStudyplan = () => {
    const {id} = useParams();
    const navigate = useNavigate();
    const {userStudyplans, loading, error, mutate} = useUserStudyplans();
    const {disciplines: studyplanDisciplinesFromAPI} = useStudyplansDisciplines(id);
    const {userDisciplines: availableDisciplinesAll, loading: loadingAvailable} = useUserDisciplines();

    const studyplan = Array.isArray(userStudyplans)
        ? userStudyplans.find((plan) => plan.id === Number(id))
        : null;

    const {
        studyplanUsers,
        error: studyplanUsersError,
        loading: studyplanUsersLoading,
        mutate: studyplanUsersMutate
    } = useStudyplanUsers(id);

    const [availableDisciplines, setAvailableDisciplines] = useState([]);
    const [studyplanDisciplines, setStudyplanDisciplines] = useState([]);
    const [initialDisciplines, setInitialDisciplines] = useState([]);

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [course, setCourse] = useState("");

    const [showNotification, setNotification] = useState(false);
    const [notificationMessage, setNotificationMessage] = useState("");

    useEffect(() => {
        if (studyplan) {
            setTitle(studyplan.title || "");
            setDescription(studyplan.description || "");
            setCourse(studyplan.courseNumber || "");
        }
    }, [studyplan]);

    useEffect(() => {
        if (Array.isArray(studyplanDisciplinesFromAPI)) {
            setStudyplanDisciplines(studyplanDisciplinesFromAPI);
            setInitialDisciplines(studyplanDisciplinesFromAPI);
        }
    }, [studyplanDisciplinesFromAPI]);

    useEffect(() => {
        if (Array.isArray(availableDisciplinesAll)) {
            const filtered = availableDisciplinesAll.filter(mod =>
                !studyplanDisciplines.some(dm => dm.id === mod.id)
            );
            setAvailableDisciplines(filtered);
        }
    }, [availableDisciplinesAll, studyplanDisciplines]);

    const handleGiveAccess = async (user, studyplanId) => {
        try {
            const response = await fetch(`${API_URL}/user-studyplans/${studyplanId}/user/${user.id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    userId: user.id,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                const message = data.error || 'Ошибка при выдаче доступа';
                setNotificationMessage(message);
                setNotification(true);
                throw new Error(message);
            }

            console.log('Права доступа успешно выданы:', data);
            setNotificationMessage(`Пользователь ${user.username} получил доступ к учебному плану`);
            setNotification(true);
            studyplanUsersMutate()
        } catch (err) {
            console.error('Ошибка:', err);
        }
    };

    const onDragEnd = (result) => {
        const {source, destination, draggableId} = result;
        if (!destination) return;

        if (source.droppableId === "studyplanDisciplines" && destination.droppableId === "studyplanDisciplines") {
            const updatedModules = Array.from(studyplanDisciplines);
            const [removed] = updatedModules.splice(source.index, 1);
            updatedModules.splice(destination.index, 0, removed);
            setStudyplanDisciplines(updatedModules);
        } else if (
            source.droppableId === "availableDisciplines" &&
            destination.droppableId === "studyplanDisciplines"
        ) {
            const moduleToAdd = availableDisciplines.find(
                (mod) => String(mod.id) === draggableId.replace("discipline-", "")
            );
            if (!moduleToAdd) return;
            setStudyplanDisciplines(prev => {
                if (!prev.find(mod => mod.id === moduleToAdd.id)) {
                    const newModules = Array.from(prev);
                    newModules.splice(destination.index, 0, moduleToAdd);
                    return newModules;
                }
                return prev;
            });
        } else if (
            source.droppableId === "studyplanDisciplines" &&
            destination.droppableId === "availableDisciplines"
        ) {
            setStudyplanDisciplines(prev =>
                prev.filter(mod => String(mod.id) !== draggableId.replace("discipline-", ""))
            );
        }
    };

    const handleDisciplineRemove = (discipline) => {
        setStudyplanDisciplines(prev =>
            prev.filter(disc => disc.id !== discipline.id)
        );
    };

    const handleSaveChanges = async () => {
        try {
            const addedDisciplines = studyplanDisciplines.filter(
                disc => !initialDisciplines.find(init => init.id === disc.id)
            );
            const removedDisciplines = initialDisciplines.filter(
                init => !studyplanDisciplines.find(disc => disc.id === init.id)
            );

            await fetch(`${API_URL}/studyplans/${id}`, {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({title, description, courseNumber: course})
            });

            for (let disc of addedDisciplines) {
                const order = studyplanDisciplines.findIndex(item => item.id === disc.id);
                await fetch(`${API_URL}/studyplans/${id}/disciplines`, {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({disciplineId: disc.id, order})
                });
            }

            for (let disc of removedDisciplines) {
                await fetch(`${API_URL}/studyplans/${id}/disciplines/${disc.id}`, {
                    method: 'DELETE'
                });
            }

            for (let i = 0; i < studyplanDisciplines.length; i++) {
                const disc = studyplanDisciplines[i];
                await fetch(`${API_URL}/studyplans/${id}/disciplines/${disc.id}`, {
                    method: 'PUT',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({order: i})
                });
            }

            setInitialDisciplines([...studyplanDisciplines]);
            setNotificationMessage(`Учебный план успешно обновлён!`);
            setNotification(true);
            mutate()
        } catch (error) {
            console.error('Ошибка сохранения:', error);
            setNotificationMessage(`Ошибка сохранения: ${error}`);
            setNotification(true);
        }
    };

    const deleteModule = async () => {
        try {
            const response = await fetch(`${API_URL}/studyplans/${studyplan?.id}`, {
                method: "DELETE",
                headers: {"Content-Type": "application/json"},
            });

            if (!response.ok) throw new Error("Ошибка удаления учебного плана");
            navigate('/my-studyplans');
        } catch (error) {
            console.error("Ошибка:", error);
        }
    };

    if (loading || loadingAvailable) return <p>Загрузка...</p>;
    if (error) return <p style={{color: "red"}}>Ошибка: {error}</p>;

    return (
        <>
            <BackButton link={'/my-studyplans'}/>
            <DragDropContext onDragEnd={onDragEnd}>
                <div className={styles.page}>
                    <div className={clsx(styles.colContainer, styles.aside)}>
                        <div className={styles.sideContainer}>
                            <DisciplineViewer availableDisciplines={availableDisciplines}/>
                            <EditorsBlock handleGiveAccess={handleGiveAccess} data={studyplanUsers}
                                          loading={studyplanUsersLoading} error={studyplanUsersError}
                                          elementId={studyplan.id}/>
                            <div onClick={() => deleteModule()} className={styles.deleteBtn}>Удалить учебный план</div>
                        </div>
                    </div>
                    <div className={clsx(styles.colContainer, styles.main)}>
                        <div className={styles.titleContainer}>
                            <span className={styles.heading}>Название учебного плана</span>
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
                            <span className={styles.heading}>Номер курса</span>
                            <span
                                contentEditable
                                suppressContentEditableWarning
                                onBlur={(e) => setCourse(e.target.innerText)}
                                className={clsx(styles.editable, styles.title)}
                            >
                            {course}
                        </span>
                        </div>
                        <div className={styles.titleContainer}>
                            <span className={styles.heading}>Содержание</span>
                            <Droppable droppableId="studyplanDisciplines">
                                {(provided) => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.droppableProps}
                                        className={styles.disciplineContainer}
                                    >
                                        {studyplanDisciplines.map((disc, index) => (
                                            <Draggable
                                                key={disc.id}
                                                draggableId={String(disc.id)}
                                                index={index}
                                            >
                                                {(provided) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        className={styles.disciplineBlock}
                                                    >
                                                        <div>
                                                            <StudyplanDiscipline discipline={disc}/>
                                                        </div>
                                                        <button className={styles.deleteButton}
                                                                onClick={() => handleDisciplineRemove(disc)}>✖
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

export default EditStudyplan;
