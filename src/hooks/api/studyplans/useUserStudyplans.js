import { useEffect, useState } from "react";
import { getItemStorage } from "../../../utils/localStorageAccess";

const API_URL = process.env.REACT_APP_API_URL;

const useUserStudyplans = () => {
    const [userStudyplans, setUserStudyplans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const token = getItemStorage("token");

    // Получение учебных планов, принадлежащих пользователю
    const fetchUserStudyplans = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/user-studyplans`, {
                headers: { Authorization: `Bearer ${token}` },
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
        if (token) fetchUserStudyplans();
    }, [token]);

    return { userStudyplans, loading, error, mutate: fetchUserStudyplans };
};

export default useUserStudyplans;
