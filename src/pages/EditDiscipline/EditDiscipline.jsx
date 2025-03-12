import React, { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import styles from "./EditDiscipline.module.scss";
import clsx from "clsx";
import CustomInput from "../../components/UI/CustomInput/CustomInput";
import TopicViewer from "./components/TopicViewer/TopicViewer";
import useDisciplines from "../../hooks/api/disciplines/useDisciplines";
import useDisciplinesModules from "../../hooks/api/disciplines/useDisciplinesModules";
import useModules from "../../hooks/api/modules/useModules";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import Notification from "../../components/Notification/Notification";


const API_URL = process.env.REACT_APP_API_URL;

const EditDiscipline = () => {
    const { id } = useParams();
    const { disciplines, loading, error } = useDisciplines();
    const discipline = disciplines.find((disc) => disc.id === Number(id));
    // Модули, которые уже входят в дисциплину (редактируются в разделе)
    const { modules: disciplineModulesFromAPI } = useDisciplinesModules(id);
    // Все доступные модули из блока с темами
    const { modules: availableModules, loading: loadingAvailable } = useModules();

    // Локальное состояние для модулей, включённых в дисциплину
    const [disciplineModules, setDisciplineModules] = useState([]);
    // Сохраняем исходное состояние для сравнения при сохранении
    const [initialModules, setInitialModules] = useState([]);

    const [showNotification, setNotification] = useState(false);

    // Инициализируем состояние, когда приходят данные с API
    useEffect(() => {
        if (disciplineModulesFromAPI) {
            setDisciplineModules(disciplineModulesFromAPI);
            setInitialModules(disciplineModulesFromAPI);
        }
    }, [disciplineModulesFromAPI]);

    // Обработчик завершения перетаскивания
    const onDragEnd = (result) => {
        const { source, destination, draggableId } = result;
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

            // Сохраняем новые модули
            for (let mod of addedModules) {
                const order = disciplineModules.findIndex(item => item.id === mod.id);
                await fetch(`${API_URL}/disciplines/${id}/modules`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ moduleId: mod.id, order })
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
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ order: i })
                });
            }
            // Обновляем исходное состояние
            setInitialModules([...disciplineModules]);
            setNotification(true);
        } catch (error) {
            console.error('Ошибка сохранения:', error);
        }
    };

    if (loading || loadingAvailable) return <p>Загрузка...</p>;
    if (error) return <p style={{ color: "red" }}>Ошибка: {error}</p>;

    return (
        <>
        <DragDropContext onDragEnd={onDragEnd}>
            <div className={styles.page}>
                <div className={clsx(styles.colContainer, styles.aside)}>
                    <TopicViewer disciplineModules={disciplineModules}/>
                </div>
                <div className={clsx(styles.colContainer, styles.main)}>
                    <div className={styles.titleContainer}>
                        <span className={styles.heading}>Название модуля</span>
                        <CustomInput
                            type="text"
                            value={discipline.title}
                        />
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
                            <div className={styles.elementsItem}>
                                <svg width="20" height="18" viewBox="0 0 20 18" fill="none"
                                     xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M6.20003 16.875C6.0409 16.875 5.88829 16.8115 5.77577 16.6985C5.66324 16.5855 5.60003 16.4322 5.60003 16.2723V13.2589H3.80003C3.32282 13.2583 2.86533 13.0676 2.5279 12.7287C2.19046 12.3898 2.00063 11.9302 2.00003 11.4509V1.80804C2.00063 1.3287 2.19046 0.869165 2.5279 0.530222C2.86533 0.191279 3.32282 0.000598051 3.80003 0H18.2C18.6773 0.000498563 19.1348 0.191148 19.4723 0.530112C19.8097 0.869077 19.9995 1.32867 20 1.80804V11.4509C19.9994 11.9302 19.8096 12.3898 19.4722 12.7287C19.1347 13.0676 18.6772 13.2583 18.2 13.2589H10.9108L6.57503 16.7428C6.46861 16.8284 6.33635 16.875 6.20003 16.875ZM3.80003 1.20536C3.6409 1.20536 3.48829 1.26885 3.37577 1.38188C3.26324 1.4949 3.20003 1.6482 3.20003 1.80804V11.4509C3.20003 11.6107 3.26324 11.764 3.37577 11.8771C3.48829 11.9901 3.6409 12.0536 3.80003 12.0536H6.20003C6.35916 12.0536 6.51177 12.1171 6.6243 12.2301C6.73682 12.3431 6.80003 12.4964 6.80003 12.6563V15.0188L10.325 12.1854C10.4315 12.1 10.5638 12.0535 10.7 12.0536H18.2C18.3592 12.0536 18.5118 11.9901 18.6243 11.8771C18.7368 11.764 18.8 11.6107 18.8 11.4509V1.80804C18.8 1.6482 18.7368 1.4949 18.6243 1.38188C18.5118 1.26885 18.3592 1.20536 18.2 1.20536H3.80003Z"
                                        fill="#908269"/>
                                    <path
                                        d="M15.7996 6.02567H6.19964C6.04051 6.02567 5.8879 5.96217 5.77538 5.84915C5.66285 5.73612 5.59964 5.58283 5.59964 5.42299C5.59964 5.26315 5.66285 5.10986 5.77538 4.99683C5.8879 4.88381 6.04051 4.82031 6.19964 4.82031H15.7996C15.9588 4.82031 16.1114 4.88381 16.2239 4.99683C16.3364 5.10986 16.3996 5.26315 16.3996 5.42299C16.3996 5.58283 16.3364 5.73612 16.2239 5.84915C16.1114 5.96217 15.9588 6.02567 15.7996 6.02567Z"
                                        fill="#908269"/>
                                    <path
                                        d="M10.9996 8.43583H6.19964C6.04051 8.43583 5.8879 8.37233 5.77538 8.2593C5.66285 8.14628 5.59964 7.99299 5.59964 7.83315C5.59964 7.67331 5.66285 7.52001 5.77538 7.40699C5.8879 7.29396 6.04051 7.23047 6.19964 7.23047H10.9996C11.1588 7.23047 11.3114 7.29396 11.4239 7.40699C11.5364 7.52001 11.5996 7.67331 11.5996 7.83315C11.5996 7.99299 11.5364 8.14628 11.4239 8.2593C11.3114 8.37233 11.1588 8.43583 10.9996 8.43583Z"
                                        fill="#908269"/>
                                </svg>
                                <span>Группа</span>
                            </div>
                        </div>
                        <div className={styles.actions}>
                            <div className={styles.actionsItem}>
                                <svg width="19" height="19" viewBox="0 0 19 19" fill="none"
                                     xmlns="http://www.w3.org/2000/svg">
                                    <g clipPath="url(#clip0_731_2036)">
                                        <path
                                            d="M9.07807 14.7161C9.13431 14.7727 9.20147 14.8173 9.27547 14.8472C9.34683 14.8762 9.42316 14.8911 9.50021 14.891C9.57725 14.891 9.65358 14.8762 9.72495 14.8472C9.79884 14.8173 9.86588 14.7727 9.92198 14.7161L13.7961 10.8419C13.8526 10.7857 13.8972 10.7187 13.9272 10.6449C13.9563 10.5735 13.9712 10.4972 13.9711 10.4201C13.9712 10.3431 13.9563 10.2668 13.9272 10.1954C13.8972 10.1216 13.8526 10.0546 13.7961 9.99836C13.74 9.94175 13.673 9.89714 13.5991 9.86726C13.5278 9.83823 13.4514 9.82335 13.3744 9.82344C13.2973 9.82335 13.221 9.83823 13.1496 9.86726C13.0757 9.89714 13.0087 9.94175 12.9526 9.99836L10.0965 12.8541V0.596689C10.097 0.47788 10.0616 0.361688 9.99502 0.263323C9.93027 0.167428 9.83923 0.0922534 9.73282 0.0468218C9.65941 0.0159665 9.58059 4.95195e-05 9.50096 7.19208e-07C9.38214 -0.000184239 9.26601 0.0353089 9.16759 0.101883C9.07163 0.166548 8.99643 0.257613 8.95109 0.364082C8.92004 0.437561 8.90412 0.516544 8.90427 0.596314V12.8541L6.04781 9.99836C5.99158 9.94174 5.92442 9.89713 5.85041 9.86726C5.77906 9.83819 5.70272 9.82331 5.62567 9.82344C5.54863 9.82338 5.47231 9.83827 5.40093 9.86726C5.32709 9.89723 5.26007 9.94183 5.20391 9.99836C5.14755 10.0547 5.10298 10.1217 5.07281 10.1954C5.04406 10.2668 5.02931 10.3431 5.02936 10.4201C5.02931 10.4971 5.04406 10.5734 5.07281 10.6449C5.10298 10.7186 5.14755 10.7856 5.20391 10.8419L9.07807 14.7161Z"
                                            fill="#908269"/>
                                        <path
                                            d="M1.09104 9.16762C1.0263 9.07172 0.935255 8.99655 0.828843 8.95112C0.755495 8.92007 0.676634 8.90414 0.596984 8.9043C0.478168 8.90411 0.362033 8.93961 0.26362 9.00618C0.167652 9.07084 0.0924574 9.16191 0.0471178 9.26838C0.0152467 9.34181 -0.00144398 9.42093 -0.00195065 9.50099V17.7194C-0.0024534 17.9747 0.073759 18.2242 0.216799 18.4356C0.355923 18.6418 0.55187 18.8033 0.780899 18.9004C0.938665 18.967 1.1082 19.0013 1.27945 19.0012H17.7167C17.9719 19.0017 18.2214 18.9255 18.4328 18.7824C18.639 18.6432 18.8004 18.4473 18.8977 18.2183C18.9644 18.0605 18.9985 17.8908 18.9981 17.7194V9.50099C18.9986 9.38218 18.9632 9.26599 18.8965 9.16762C18.8318 9.07172 18.7408 8.99655 18.6343 8.95112C18.561 8.92007 18.4821 8.90414 18.4025 8.9043C18.2837 8.90411 18.1675 8.93961 18.0691 9.00618C17.9732 9.07084 17.898 9.16191 17.8526 9.26838C17.8214 9.3418 17.8055 9.42082 17.8058 9.50061V17.8078H1.19255V9.50099C1.19305 9.38218 1.15767 9.26599 1.09104 9.16762Z"
                                            fill="#908269"/>
                                    </g>
                                    <defs>
                                        <clipPath id="clip0_731_2036">
                                            <rect width="19" height="19" fill="white"/>
                                        </clipPath>
                                    </defs>
                                </svg>
                            </div>
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
                    message="Дисциплина успешно обновлена!"
                    onClose={() => setNotification(false)}
                />
            )}
        </>
    );
};

export default EditDiscipline;
