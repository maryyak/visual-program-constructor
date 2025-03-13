import useDisciplinesModules from "../../../../hooks/api/disciplines/useDisciplinesModules";
import styles from "./StudyplanDiscipline.module.scss"
import {useState} from "react";

const StudyplanDiscipline = ({discipline, withDescription}) => {
    const [isOpen, setIsOpen] = useState(true);

    const {modules} = useDisciplinesModules(discipline.id)

    return (
        <div className={styles.discipline}>
            <div onClick={() => setIsOpen(!isOpen)} style={{cursor: "pointer"}} className={withDescription && styles.heading}>
                {discipline.title || discipline.name}
            </div>
            {withDescription &&
                <span className={styles.description}>{discipline.description}</span>
            }
            {isOpen ?
                modules && modules.length > 0 ? (
                modules.map((module) => (
                    <ul className={styles.module}>
                        <li>{module.title || module.name}</li>
                    </ul>
                ))
            ) : (
                <div className={styles.module}>
                    Нет модулей
                </div>
            ) : null}
        </div>
    );
};

export default StudyplanDiscipline;