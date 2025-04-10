import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import {removeItemStorage, setItemStorage} from "../../../utils/localStorageAccess";
const API_URL = process.env.REACT_APP_API_URL;

const useAuth = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const register = async (username, password, login) => {
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/users/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password, login }),
            });

            const data = await response.json();

            if (!response.ok) {
                console.error("Ошибка регистрации:", data.message || 'Ошибка регистрации');
                throw new Error(data.message || 'Ошибка регистрации');
            }

            console.log("Пользователь зарегистрирован:", data);  // Логируем данные ответа
            return data;
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Функция для логина пользователя
    const login = async (username, password) => {
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/users/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Ошибка авторизации');
            }

            console.log("Пользователь авторизирован:", data);
            const tokenPayload = JSON.parse(atob(data.token.split('.')[1]));
            const tokenExp = tokenPayload.exp * 1000; // переводим в миллисекунды

            setItemStorage('token', data.token);
            setItemStorage('token_exp', tokenExp);
            setItemStorage('username', data.user.username)

            return data.user;
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        removeItemStorage("token"); // Удаляем токен
        removeItemStorage("username"); // Удаляем имя пользователя
        navigate("/login"); // Перенаправляем на страницу логина
    };

    return { register, login, logout, loading, error };
};

export default useAuth;
