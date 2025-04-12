import { useEffect, useState } from "react";
import { isTokenValid } from "../../../utils/isTokenValid";

const API_URL = process.env.REACT_APP_API_URL;

const useUserDisciplines = () => {
    const [userDisciplines, setUserDisciplines] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    // Проверка на валидность токена (если необходимо)
    isTokenValid();

    // Получение дисциплин, принадлежащих пользователю
    const fetchUserDisciplines = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/user-disciplines`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",  // Это важно: куки будут автоматически отправляться с запросом
            });

            const data = await response.json();
            if (!response.ok) throw new Error("Ошибка загрузки дисциплин пользователя");
            setUserDisciplines(data);

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserDisciplines();  // Вызываем fetch, когда компонент монтируется
    }, []); // Не зависим от token, т.к. куки будут автоматически передаваться

    return { userDisciplines, loading, error, mutate: fetchUserDisciplines };
};

export default useUserDisciplines;
