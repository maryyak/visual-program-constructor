import { useEffect, useState } from "react";

const API_URL = process.env.REACT_APP_API_URL;

const useDisciplineUsers = (disciplineId) => {
    const [disciplineUsers, setDisciplineUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Получение дисциплин, принадлежащих пользователю
    const fetchDisciplineUsers = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/user-disciplines/${disciplineId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",  // Это важно: куки будут автоматически отправляться с запросом
            });

            const data = await response.json();
            if (!response.ok) throw new Error("Ошибка загрузки пользователей дисциплины");
            setDisciplineUsers(data);

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDisciplineUsers();  // Вызываем fetch, когда компонент монтируется
    }, []); // Не зависим от token, т.к. куки будут автоматически передаваться

    return { disciplineUsers, loading, error, mutate: fetchDisciplineUsers };
};

export default useDisciplineUsers;
