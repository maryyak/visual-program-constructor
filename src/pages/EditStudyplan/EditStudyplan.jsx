import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from "react-router-dom";
import clsx from "clsx";
import {DragDropContext, Draggable, Droppable} from "@hello-pangea/dnd";
import useStudyplansDisciplines from "../../hooks/api/studyplans/useStudyplansDisciplines";
import styles from "./EditStudyplan.module.scss"
import DisciplineViewer from "./components/DisciplineViewer/DisciplineViewer";
import StudyplanDiscipline from "./components/StudyplanDiscipline/StudyplanDiscipline";
import Notification from "../../components/Notification/Notification";
import useUserStudyplans from "../../hooks/api/studyplans/useUserStudyplans";
import useUserDisciplines from "../../hooks/api/disciplines/useUserDIsciplines";
import authUser from "../../hooks/api/users/authUser";

const API_URL = process.env.REACT_APP_API_URL;

const EditDiscipline = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { userStudyplans, loading, error } = useUserStudyplans();
    const { disciplines: studyplanDisciplinesFromAPI } = useStudyplansDisciplines(id);
    const { userDisciplines: availableDisciplinesAll, loading: loadingAvailable } = useUserDisciplines();

    const studyplan = Array.isArray(userStudyplans)
        ? userStudyplans.find((plan) => plan.id === Number(id))
        : null;

    const { users } = authUser();

    const [searchQuery, setSearchQuery] = useState("");
    const userArray = users?.users || [];

    const [filteredUsers, setFilteredUsers] = useState(userArray);
    const [selectedUser, setSelectedUser] = useState(null);


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

    const handleSearchChange = (e) => {
        const query = e.target.value;
        setSearchQuery(query);

        if (Array.isArray(userArray)) {
            const filteredUsers = userArray.filter(user =>
                user.username.toLowerCase().includes(query.toLowerCase())
            );
            setFilteredUsers(filteredUsers);
            console.log('Отфильтрованные пользователи:', filteredUsers);
        } else {
            console.error('Ошибка: users не является массивом', userArray);
        }
    };

    const handleUserClick = (user) => {
        setSelectedUser(user);
    };

    const handleGiveAccess = async (user, studyplanId) => {
        try {
            const response = await fetch(`${API_URL}/user-studyplans/${studyplanId}`, {
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
        } catch (err) {
            console.error('Ошибка:', err);
        }
    };

    const onDragEnd = (result) => {
        const { source, destination, draggableId } = result;
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
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, description, courseNumber: course })
            });

            for (let disc of addedDisciplines) {
                const order = studyplanDisciplines.findIndex(item => item.id === disc.id);
                await fetch(`${API_URL}/studyplans/${id}/disciplines`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ disciplineId: disc.id, order })
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
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ order: i })
                });
            }

            setInitialDisciplines([...studyplanDisciplines]);
            setNotificationMessage(`Учебный план успешно обновлён!`);
            setNotification(true);

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
                headers: { "Content-Type": "application/json" },
            });

            if (!response.ok) throw new Error("Ошибка удаления учебного плана");
            navigate('/my-studyplans');
        } catch (error) {
            console.error("Ошибка:", error);
        }
    };

    if (loading || loadingAvailable) return <p>Загрузка...</p>;
    if (error) return <p style={{ color: "red" }}>Ошибка: {error}</p>;

    return (
        <>
            <DragDropContext onDragEnd={onDragEnd}>
                <div className={styles.page}>
                    <div className={clsx(styles.colContainer, styles.aside)}>
                        <div className={styles.sideContainer}>
                            <DisciplineViewer availableDisciplines={availableDisciplines}/>
                            <div className={styles.searchСontainer}>
                                <input
                                    type="text"
                                    placeholder="Поиск пользователя..."
                                    value={searchQuery}
                                    onChange={handleSearchChange}
                                />
                                {searchQuery && (
                                    <ul>
                                        {filteredUsers?.map(user => (
                                            <li
                                                key={user.id}
                                                onClick={() => handleUserClick(user)} // Устанавливаем выбранного пользователя
                                                style={{cursor: "pointer"}} // Сделаем курсор как "указатель"
                                            >
                                                {user.username}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                                <button
                                    onClick={() => selectedUser && handleGiveAccess(selectedUser, studyplan.id)} // Отправляем выбранного пользователя
                                    disabled={!selectedUser} // Если пользователь не выбран, кнопка будет отключена
                                >
                                    Открыть доступ к учебному плану
                                </button>
                            </div>
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
                    message={notificationMessage}
                    onClose={() => setNotification(false)}
                />
            )}
        </>
    );
};

export default EditDiscipline;
