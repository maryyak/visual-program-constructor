import { useEffect, useState } from "react";

const API_URL = process.env.REACT_APP_API_URL;

const useStudyplanUsers = (studyplanId) => {
    const [studyplanUsers, setStudyplanUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Получение учебных планов, принадлежащих пользователю
    const fetchStudyplanUsers = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/user-studyplans/${studyplanId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",  // Это важно: куки будут автоматически отправляться с запросом
            });

            if (!response.ok) throw new Error("Ошибка загрузки учебных планов пользователя");

            const data = await response.json();
            setStudyplanUsers(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStudyplanUsers();  // Вызываем fetch, когда компонент монтируется
    }, []);

    return { studyplanUsers, loading, error, mutate: fetchStudyplanUsers };
};

export default useStudyplanUsers;
