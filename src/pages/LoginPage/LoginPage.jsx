import React, {useEffect, useState} from "react";
import useAuth from "../../hooks/api/users/authUser";
import {Link, useNavigate} from "react-router-dom";
import styles from "./LoginPage.module.scss";

const LoginPage = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const {login, loading, error} = useAuth();
    const navigate = useNavigate();
    const [user, setUser] = useState()

    useEffect(() => {
        if (user) {
            navigate("/");
            window.location.reload();
        }
    }, [user, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setUser(await login(username, password))
        } catch (err) {
            console.error("Ошибка при логине:", err);
        }
    };


    return (
        <div className={styles.form}>
            <h1>Вход</h1>
            <div>
                <form onSubmit={handleSubmit}>
                    <div className={styles.login}>
                        <div>
                            <label>Имя пользователя</label>
                            <input className={styles.input}
                                   type="text"
                                   name="username"
                                   autoComplete="username"
                                   value={username}
                                   onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>
                        <div>
                            <label>Пароль</label>
                            <input className={styles.input}
                                   type="password"
                                   name="password"
                                   autoComplete="current-password"
                                   value={password}
                                   onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <button className={styles.button} type="submit" disabled={loading}>
                            {loading ? "Загрузка..." : "Войти"}
                        </button>
                        {error && <p style={{color: "red"}}>{error}</p>}
                    </div>
                </form>
            </div>
            <div>
                <p>Нет аккаунта? <Link to={`/register`}>Зарегистрируйся!</Link></p>
            </div>
        </div>
    );
};

export default LoginPage;
