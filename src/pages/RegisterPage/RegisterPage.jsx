import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/api/users/authUser";
import styles from "../LoginPage/LoginPage.module.scss";

const RegisterPage = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const { register, loading } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Проверяем, совпадают ли пароли
        if (password !== confirmPassword) {
            setError("Пароли не совпадают");
            return;
        }

        try {
            // Выполняем регистрацию через хук useAuth
            const data = await register(username, password);
            if (data) {
                navigate("/login"); // Перенаправляем на страницу логина после успешной регистрации
            }
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className={styles.form}>
            <h1>Регистрация</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <div>
                        <label>Имя пользователя</label>
                        <input className={styles.input}
                               type="text"
                               value={username}
                               onChange={(e) => setUsername(e.target.value)}
                               required
                        />
                    </div>
                    <div>
                        <label>Пароль</label>
                        <input className={styles.input}
                               type="password"
                               value={password}
                               onChange={(e) => setPassword(e.target.value)}
                               required
                        />
                    </div>
                </div>

                <div>
                    <label>Подтвердите пароль</label>
                    <input className={styles.input}
                           type="password"
                           value={confirmPassword}
                           onChange={(e) => setConfirmPassword(e.target.value)}
                           required
                    />
                </div>
                {error && <p style={{color: "red"}}>{error}</p>}
                <button className={styles.button} type="submit" disabled={loading}>
                    {loading ? "Загрузка..." : "Зарегистрироваться"}
                </button>
            </form>
        </div>
    );
};

export default RegisterPage;
