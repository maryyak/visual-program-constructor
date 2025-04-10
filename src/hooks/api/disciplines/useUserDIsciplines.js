import { useEffect, useState } from "react";
import {getItemStorage} from "../../../utils/localStorageAccess";
import {isTokenValid} from "../../../utils/isTokenValid";

const API_URL = process.env.REACT_APP_API_URL;

const useUserDisciplines = () => {
    const [userDisciplines, setUserDisciplines] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const token = getItemStorage("token");
    isTokenValid();

    // Получение дисциплин, принадлежащих пользователю
    const fetchUserDisciplines = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/user-disciplines`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!response.ok) throw new Error("Ошибка загрузки дисциплин пользователя");
            const data = await response.json();
            setUserDisciplines(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        if (token) fetchUserDisciplines();
    }, [token]);

    return {userDisciplines, loading, error, mutate: fetchUserDisciplines};
};

export default useUserDisciplines;
