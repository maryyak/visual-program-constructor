import useDisciplinesModules from "../../../hooks/api/disciplines/useDisciplinesModules";
import {useNavigate} from "react-router-dom";
import {useState} from "react";
import styles from "../Sidebar.module.scss";


const DisciplineModules = ({discipline}) => {
    const {modules, loading, error} = useDisciplinesModules(discipline.id);
    const navigate = useNavigate();
    const [openDiscipline, setOpenDiscipline] = useState(null); // управление раскрытием дисциплин

    const toggleDisciplineDropdown = (disciplineId) => {
        setOpenDiscipline(openDiscipline === disciplineId ? null : disciplineId);
    };

    if (loading) return <div>Загрузка модулей...</div>;
    if (error) return <div style={{color: "red"}}>Ошибка при загрузке модулей: {error}</div>;

    return (
        <div>
            <div key={discipline.id} className={styles.disciplineTitle}
                 onClick={() => toggleDisciplineDropdown(discipline.id)}
                 onDoubleClick={() => navigate(`/discipline/${discipline.id}`)}>
                <svg
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
            <div>
                {openDiscipline === discipline.id &&
                    <ul>
                        {modules.map((module) => (
                            <li key={module.id} style={{cursor: "pointer", marginBottom: 10}}
                                onDoubleClick={() => navigate(`/module/${module.id}`)}>
                                {module.title}
                            </li>
                        ))}
                    </ul>
                }
            </div>
        </div>
    );
};

export default DisciplineModules;