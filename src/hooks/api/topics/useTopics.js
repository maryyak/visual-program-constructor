import { useState, useEffect } from "react";

const API_URL = process.env.REACT_APP_API_URL;

const useTopics = () => {
    const [topics, setTopics] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTopics = async () => {
            try {
                const response = await fetch(`${API_URL}/topics`);
                if (!response.ok) throw new Error("Ошибка загрузки данных");
                const data = await response.json();
                setTopics(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchTopics();
    }, []);

    return { topics, loading, error };
};

export default useTopics;
