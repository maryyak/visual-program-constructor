import styles from "../../../MyModules/components/ModuleCard/ModuleCard.module.scss";
import {Link} from "react-router-dom";

const DisciplineCard = ({discipline}) => {
    return (
        <div className={styles.card}>
            <div className={styles.title}>{discipline.title}</div>
            <div className={styles.description}>{discipline.description}</div>
            <div className={styles.buttons}>
                <Link className={styles.buttonWrapper} to={`/discipline/${discipline.id}`}>
                    <button className={styles.button}>Просмотреть</button>
                </Link>
                <Link className={styles.buttonWrapper} to={`/edit-discipline/${discipline.id}`}>
                    <button className={styles.button}>Редактировать</button>
                </Link>
            </div>
        </div>
    );
};

export default DisciplineCard;