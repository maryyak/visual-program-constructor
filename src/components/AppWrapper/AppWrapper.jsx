import styles from './AppWrapper.module.scss'
import Sidebar from "../Sidebar/Sidebar";
import React, {useState} from "react";
import clsx from "clsx";
import AppHeader from "../AppHeader/AppHeader";

const AppWrapper = ({children}) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className={clsx(styles.app, isSidebarOpen ? styles.sidebarOpen : "")}>
            <div className={styles.sidebarContainer}>
                <Sidebar isOpen={isSidebarOpen} setIsOpen={(arg) => setIsSidebarOpen(arg)}/>
            </div>
            <div className={styles.mainContent}>
                <AppHeader/>
                {children}
            </div>
        </div>
    );
};

export default AppWrapper;