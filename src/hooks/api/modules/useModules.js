import { useState, useEffect } from "react";

const API_URL = process.env.REACT_APP_API_URL;

const useModules = () => {
    const [modules, setModules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchModules = async () => {
            try {
                const response = await fetch(`${API_URL}/modules`);
                if (!response.ok) throw new Error("Ошибка загрузки данных");
                const data = await response.json();
                setModules(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchModules();
    }, []);

    return { modules, loading, error };
};

export default useModules;
