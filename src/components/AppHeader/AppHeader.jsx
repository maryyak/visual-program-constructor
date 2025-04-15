import React, {useEffect, useState} from 'react';
import  styles from "./AppHeader.module.scss"
import useAuth from "../../hooks/api/users/authUser";
import {useLocation, useNavigate} from "react-router-dom";

const AppHeader = () => {
    const [authenticated, setAuthenticated] = useState(false); // состояние для проверки авторизации
    const navigate = useNavigate(); // хук для перенаправления
    const [user, setUser] = useState(null);
    const { logout, checkAuth } = useAuth();
    const location = useLocation();

    useEffect(() => {
        const verifyUser = async () => {
            const userData = await checkAuth();
            if (userData) {
                setUser(userData);
                setAuthenticated(true);

            } else {
                setAuthenticated(false);
                navigate("/login");
            }
        };

        verifyUser();
    }, []);

    // Если пользователь не авторизован, выводим сообщение о редиректе
    if (!authenticated || location.pathname === "/login" || location.pathname === "/register") {
        return null;
    }

    return (
        <div className={styles.header}>
            <div className={styles.row}>
                <span className={styles.avatar}></span>
                <div className={styles.info}>
                    <span className={styles.name}>{user?.username || "Гость"}</span>
                </div>
            </div>
            <button className={styles.button} onClick={logout}>Выйти</button>
        </div>
    );
};

export default AppHeader;