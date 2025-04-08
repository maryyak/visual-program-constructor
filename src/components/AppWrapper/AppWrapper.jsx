import styles from './AppWrapper.module.scss'
import BackButton from "../BackButton/BackButton";
import Sidebar from "../Sidebar/Sidebar";
import React, {useState} from "react";
import clsx from "clsx";

const AppWrapper = ({children}) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className={clsx(styles.app, isSidebarOpen ? styles.sidebarOpen : "")}>
            <BackButton/>
            <div className={styles.sidebarContainer}>
                <Sidebar isOpen={isSidebarOpen} setIsOpen={(arg) => setIsSidebarOpen(arg)}/>
            </div>
            <div className={styles.mainContent}>
                {children}
            </div>
        </div>
    );
};

export default AppWrapper;