import styles from "./Sidebar.module.scss";
import StudyplanDisciplines from "./components/StudyplanDisciplines";
import useUserStudyplans from "../../hooks/api/studyplans/useUserStudyplans";
import {useLocation} from "react-router-dom";


const Sidebar = () => {

    const location = useLocation();
    const {userStudyplans} = useUserStudyplans();

    if (location.pathname === "/login") {
        return null;
    }

    return (
        <div className>
            <div className={styles.sidebar}>
                <span className={styles.sidebarHeading}>Учебные планы</span>

                <div>
                    <ul className={styles.ulStuduplans}>
                        {userStudyplans.map((studyplan) => (
                            <p key={studyplan.id} className={styles.studyplanItem}>
                                <StudyplanDisciplines studyplan={studyplan}/>
                            </p>
                        ))}
                    </ul>

                </div>
            </div>
        </div>
    );
};

export default Sidebar;
