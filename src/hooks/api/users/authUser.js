import {useEffect, useState} from 'react';
import {useLocation, useNavigate} from "react-router-dom";
const API_URL = process.env.REACT_APP_API_URL;

const useAuth = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const [users, setUsers] = useState(null);
    const location = useLocation();

    const checkAuth = async () => {
        try {
            const response = await fetch(`${API_URL}/users/profile`, {
                credentials: 'include',
            });
            if (!response.ok) throw new Error("Не авторизован");
            const data = await response.json();
            return data.user;
        } catch (err) {
            return null;
        }
    };


    const register = async (username, password, login) => {
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/users/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include', // важно для куков
                body: JSON.stringify({ username, password, login }),
            });

            const data = await response.json();

            if (!response.ok) {
                console.error("Ошибка регистрации:", data.message || 'Ошибка регистрации');
                throw new Error(data.message || 'Ошибка регистрации');
            }

            console.log("Пользователь зарегистрирован:", data);
            return data;
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const login = async (username, password) => {
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/users/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include', // важно для куков
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Ошибка авторизации');
            }

            console.log("Пользователь авторизован:", data);
            return data.user;
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        try {
            await fetch(`${API_URL}/users/logout`, {
                method: 'POST',
                credentials: 'include' // отправляем куки
            });
        } catch (err) {
            console.error("Ошибка при выходе:", err);
        } finally {
            navigate("/login");
        }
    };

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/users`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
            });

            const data = await response.json();
            if (!response.ok) throw new Error("Ошибка загрузки данных пользователей");
            setUsers(data);

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Проверяем, находимся ли мы на странице логина или регистрации
        if (location.pathname === "/login" || location.pathname === "/register") {
            return;  // Если да, пропускаем вызов fetchUsers
        }

        // Если мы не на странице логина или регистрации, выполняем fetch
        fetchUsers();
    }, [location]);

    return { users, register, login, logout, checkAuth, loading, error };
};

export default useAuth;
