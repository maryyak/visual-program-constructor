import { useEffect, useState } from "react";

const API_URL = process.env.REACT_APP_API_URL;

const useModuleUsers = (moduleId) => {
    const [moduleUsers, setModuleUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Получение модулей
    const fetchModuleUsers = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/user-modules/${moduleId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",  // Это важно: куки будут автоматически отправляться с запросом
            });

            if (!response.ok) throw new Error("Ошибка загрузки пользователей модуля");
            const data = await response.json();
            setModuleUsers(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchModuleUsers();  // Вызываем fetch, когда компонент монтируется
    }, []);

    return { moduleUsers, loading, error, mutate: fetchModuleUsers };
};

export default useModuleUsers;
