import { useState } from "react";
import useStudyplansDisciplines from "../../../hooks/api/studyplans/useStudyplansDisciplines";
import Modules from "./DisciplineModules";
import styles from "../Sidebar.module.scss";
import { useNavigate } from "react-router-dom";

const StudyplanDisciplines = ({ studyplan }) => {
    const [isStudyplanOpen, setIsStudyplanOpen] = useState(false);
    const [openDiscipline, setOpenDiscipline] = useState(null); // управление раскрытием дисциплин
    const navigate = useNavigate();

    // Получаем дисциплины для учебного плана
    const { id } = studyplan;
    const { disciplines, loading, error } = useStudyplansDisciplines(id);

    const toggleStudyplanDropdown = () => {
        setIsStudyplanOpen(!isStudyplanOpen);
    };

    const toggleDisciplineDropdown = (disciplineId) => {
        setOpenDiscipline(openDiscipline === disciplineId ? null : disciplineId);
    };

    if (loading) return <div>Загрузка...</div>;
    if (error) return <div style={{ color: "red" }}>Ошибка: {error}</div>;

    return (
        <div>
            <h4 className={styles.studyplanTitle} onClick={toggleStudyplanDropdown} onDoubleClick={() => navigate(`/studyplan/${id}`)}>
                {studyplan.title}
                <svg
                    style={{rotate: isStudyplanOpen ? "0deg" : "180deg"}}
                    width="10"
                    height="5"
                    viewBox="0 0 10 5"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path d="M0 0L5 5L10 0H0Z" fill="#151515"/>
                </svg>
            </h4>

            {isStudyplanOpen && (
                <div>
                    {disciplines.map((discipline) => (
                        <div>
                            <div key={discipline.id} className={styles.disciplineTitle} onDoubleClick={() => navigate(`/discipline/${discipline.id}`)}>
                                <svg onClick={() => toggleDisciplineDropdown(discipline.id)}
                                     style={{rotate: discipline.id ? "" : "90deg"}}
                                     width="5"
                                     height="10"
                                     viewBox="0 0 5 10"
                                     fill="none"
                                     xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path d="M0 10L5 5L0 0L0 10Z" fill="#151515"/>
                                </svg>
                                <p>{discipline.title}</p>
                            </div>
                            <div>{openDiscipline === discipline.id && <Modules disciplineId={discipline.id}/>}</div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default StudyplanDisciplines;