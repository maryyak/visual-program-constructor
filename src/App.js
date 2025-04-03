import React from "react";
import {BrowserRouter} from "react-router-dom";
import AppRouter from "./components/AppRouter";
import AppWrapper from "./components/AppWrapper/AppWrapper";
import Sidebar from "./components/Sidebar/Sidebar";
import styles from "./App.module.scss";
import clsx from "clsx"

function App() {

    return (
        <BrowserRouter>
            <AppWrapper>
                <div className={clsx(styles.colContainer, styles.aside)}>
                    <Sidebar/>
                    <div className={clsx(styles.colContainer, styles.main)}>
                        <AppRouter/>
                    </div>
                </div>
            </AppWrapper>
        </BrowserRouter>
    );
}


export default App;