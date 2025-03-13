import React from 'react';
import styles from './ModuleCard.module.scss'
import {Link} from "react-router-dom";

const ModuleCard = ({module}) => {
    return (
        <div className={styles.card}>
            <div className={styles.title}>{module.title}</div>
            <div className={styles.buttons}>
                <Link className={styles.buttonWrapper} to={`/module/${module.id}`}>
                    <button className={styles.button}>Просмотреть</button>
                </Link>
                <Link className={styles.buttonWrapper} to={`/edit-module/${module.id}`}>
                    <button className={styles.button}>Редактировать</button>
                </Link>
            </div>
        </div>
    );
};

export default ModuleCard;