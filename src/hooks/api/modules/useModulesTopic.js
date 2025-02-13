import { useState, useEffect } from "react";

const API_URL = process.env.REACT_APP_API_URL;

const useModulesTopic = (module_id) => {
    const [topic, setTopic] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchModulesTopic = async () => {
        try {
            const response = await fetch(`${API_URL}/modules/${module_id}/topic`);
            if (!response.ok) throw new Error("Ошибка загрузки данных");
            const data = await response.json();
            setTopic(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!module_id) return;
        fetchModulesTopic();
    }, [module_id]);

    return { topic, loading, error, mutate: fetchModulesTopic };
};

export default useModulesTopic;
