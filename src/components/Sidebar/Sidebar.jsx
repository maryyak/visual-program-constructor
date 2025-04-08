import React, { useEffect } from "react";
import styles from "./Sidebar.module.scss";
import StudyplanDisciplines from "./components/StudyplanDisciplines";
import useUserStudyplans from "../../hooks/api/studyplans/useUserStudyplans";
import { useLocation } from "react-router-dom";

const Sidebar = ({isOpen, setIsOpen}) => {
    const location = useLocation();
    const { userStudyplans } = useUserStudyplans();

    useEffect(() => {
        // Открыть панель на домашней странице, закрыть на других
        if (location.pathname === "/") {
            setIsOpen(true);
        } else {
            setIsOpen(false);
        }
    }, [location]);

    // Скрывать боковую панель на страницах "login" и "register"
    if (location.pathname === "/login" || location.pathname === "/register") {
        return null;
    }

    return (
        <div className={styles.sidebarContainer}>
            <div className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
                <span className={styles.sidebarHeading}>Учебные планы</span>

                <div>
                    <ul className={styles.ulStuduplans}>
                        {userStudyplans.map((studyplan) => (
                            <p key={studyplan.id} className={styles.studyplanItem}>
                                <StudyplanDisciplines studyplan={studyplan} />
                            </p>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
