import { useState, useEffect } from "react";

const API_URL = process.env.REACT_APP_API_URL;

const useTopicsModules = (topicId) => {
    const [modules, setModules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTopicsModules = async () => {
            try {
                const response = await fetch(`${API_URL}/topics/${topicId}/modules`);
                if (!response.ok) throw new Error("Ошибка загрузки данных");
                const data = await response.json();
                setModules(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchTopicsModules();
    }, [topicId]);

    return { modules, loading, error };
};

export default useTopicsModules;
