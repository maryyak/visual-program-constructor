import { useState, useEffect } from "react";

const API_URL = process.env.REACT_APP_API_URL;

const useDisciplinesModules = (disciplineId) => {
    const [modules, setModules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDisciplinesModules = async () => {
            try {
                const response = await fetch(`${API_URL}/disciplines/${disciplineId}/modules`);
                if (!response.ok) throw new Error("Ошибка загрузки данных");
                const data = await response.json();
                setModules(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchDisciplinesModules();
    }, []);

    return { modules, loading, error };
};

export default useDisciplinesModules;
