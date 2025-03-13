import styles from "../../../MyModules/components/ModuleCard/ModuleCard.module.scss";
import {Link} from "react-router-dom";

const DisciplineCard = ({studyplan}) => {
    return (
        <div className={styles.card}>
            <div className={styles.title}>{studyplan.title}</div>
            <div className={styles.description}>
                <span>{studyplan.description}</span>
                <span>{studyplan.courseNumber} курс</span>
            </div>
            <div className={styles.buttons}>
                <Link className={styles.buttonWrapper} to={`/studyplan/${studyplan.id}`}>
                    <button className={styles.button}>Просмотреть</button>
                </Link>
                <Link className={styles.buttonWrapper} to={`/edit-studyplan/${studyplan.id}`}>
                    <button className={styles.button}>Редактировать</button>
                </Link>
            </div>
        </div>
    );
};

export default DisciplineCard;