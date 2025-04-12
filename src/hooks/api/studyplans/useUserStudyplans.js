import { useEffect, useState } from "react";

const API_URL = process.env.REACT_APP_API_URL;

const useUserStudyplans = () => {
    const [userStudyplans, setUserStudyplans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


    // Получение учебных планов, принадлежащих пользователю
    const fetchUserStudyplans = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/user-studyplans`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",  // Это важно: куки будут автоматически отправляться с запросом
            });

            if (!response.ok) throw new Error("Ошибка загрузки учебных планов пользователя");

            const data = await response.json();
            setUserStudyplans(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserStudyplans();  // Вызываем fetch, когда компонент монтируется
    }, []);

    return { userStudyplans, loading, error, mutate: fetchUserStudyplans };
};

export default useUserStudyplans;
