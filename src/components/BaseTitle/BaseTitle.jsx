import React from 'react';
import styles from "./BaseTitle.module.scss";

const BaseTitle = ({title, button}) => {
    return (
        <div className={styles.container}>
            <span className={styles.title}>{title}</span>
            {button}
        </div>
    );
};

export default BaseTitle;