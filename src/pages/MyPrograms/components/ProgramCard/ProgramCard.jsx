import styles from "../../../MyModules/components/ModuleCard/ModuleCard.module.scss";
import {Link} from "react-router-dom";

const ProgramCard = ({program}) => {
    return (
        <div className={styles.card}>
            <div className={styles.title}>{program.title}</div>
            <div className={styles.description}>{program.description}</div>
            <div className={styles.buttons}>
                <Link className={styles.buttonWrapper} to={`/program/${program.id}`}>
                    <button className={styles.button}>Просмотреть</button>
                </Link>
                <Link className={styles.buttonWrapper} to={`/edit-program/${program.id}`}>
                    <button className={styles.button}>Редактировать</button>
                </Link>
            </div>
        </div>
    );
};

export default ProgramCard;