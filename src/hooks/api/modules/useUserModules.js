import { useEffect, useState } from "react";
import { getItemStorage } from "../../../utils/localStorageAccess";
import {isTokenValid} from "../../../utils/isTokenValid";

const API_URL = process.env.REACT_APP_API_URL;

const useUserModules = () => {
    const [userModules, setUserModules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const token = getItemStorage("token");
    isTokenValid();

    // Получение модулей, принадлежащих пользователю
    const fetchUserModules = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/user-modules`, {
                headers: { Authorization: `Bearer ${token}` },
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
        if (token) fetchUserModules();
    }, [token]);

    return { userModules, loading, error, mutate: fetchUserModules };
};

export default useUserModules;
