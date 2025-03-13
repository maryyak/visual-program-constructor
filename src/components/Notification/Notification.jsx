import styles from "./Notification.module.scss";
import { useEffect } from "react";

const Notification = ({ message, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            if (onClose) onClose();
        }, 3000);

        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className={styles.notification}>
            <span>{message}</span>
        </div>
    );
};

export default Notification;
