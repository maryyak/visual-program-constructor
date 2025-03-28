import {useEffect, useState} from "react";

const API_URL = process.env.REACT_APP_API_URL;

const useModules = () => {
    const [modules, setModules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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

    useEffect(() => {
        fetchModules();
    }, []);

    return {modules, loading, error, mutate: fetchModules};
};

export default useModules;
