import React, { useEffect } from "react";
import styles from "./Sidebar.module.scss";
import StudyplanDisciplines from "./components/StudyplanDisciplines";
import { useLocation } from "react-router-dom";
import {useUserStudyplans} from "../UserStudyplansContext";

const Sidebar = ({isOpen, setIsOpen}) => {
    const location = useLocation();
    const { userStudyplans } = useUserStudyplans();

    useEffect(() => {
        // Открыть панель на домашней странице, закрыть на других
        if (location.pathname === "/login" || location.pathname === "/register") {
            setIsOpen(false);
        } else {
            setIsOpen(true);
        }
    }, [location]);

    return (
        <div className={styles.sidebarContainer}>
            <div className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
                <span className={styles.sidebarHeading}>Учебные планы</span>

                <div>
                    <ul className={styles.ulStuduplans}>
                        {userStudyplans.map((studyplan) => (
                            <div key={studyplan.id} className={styles.studyplanItem}>
                                <StudyplanDisciplines studyplan={studyplan} mutate={userStudyplans}/>
                            </div>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
