import {useEffect, useState} from "react";
import useStudyplansDisciplines from "../../../hooks/api/studyplans/useStudyplansDisciplines";
import styles from "../Sidebar.module.scss";
import { useNavigate } from "react-router-dom";
import DisciplineModules from "./DisciplineModules";

const StudyplanDisciplines = ({ studyplan, mutate }) => {
    const [isStudyplanOpen, setIsStudyplanOpen] = useState(false);
    const navigate = useNavigate();

    // Получаем дисциплины для учебного плана
    const { id } = studyplan;
    const { disciplines, loading, error, mutate: disciplinesMutate } = useStudyplansDisciplines(id);

    useEffect(() => {
        disciplinesMutate()
    }, [mutate]);

    const toggleStudyplanDropdown = () => {
        setIsStudyplanOpen(!isStudyplanOpen);
    };

    if (loading) return <div>Загрузка...</div>;
    if (error) return <div style={{ color: "red" }}>Ошибка: {error}</div>;

    return (
        <div>
            <h4 className={styles.studyplanTitle} onClick={toggleStudyplanDropdown} onDoubleClick={() => navigate(`/studyplan/${id}`)}>
                {studyplan.title}
                <svg
                    style={{rotate: isStudyplanOpen ? "180deg" : "0deg"}}
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
                        <DisciplineModules discipline={discipline}/>
                    ))}
                </div>
            )}
        </div>
    );
};

export default StudyplanDisciplines;