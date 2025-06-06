import { useEffect, useState } from "react";

const API_URL = process.env.REACT_APP_API_URL;

const useUserModules = () => {
    const [userModules, setUserModules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Получение модулей
    const fetchUserModules = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/user-modules`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",  // Это важно: куки будут автоматически отправляться с запросом
            });

            if (!response.ok) throw new Error("Ошибка загрузки модулей пользователя");
            const data = await response.json();
            setUserModules(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserModules();  // Вызываем fetch, когда компонент монтируется
    }, []);

    return { userModules, loading, error, mutate: fetchUserModules };
};

export default useUserModules;
