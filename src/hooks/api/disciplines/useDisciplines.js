import {useEffect, useState} from "react";

const API_URL = process.env.REACT_APP_API_URL;

const useDisciplines = () => {
    const [disciplines, setDisciplines] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchDisciplines = async () => {
        try {
            const response = await fetch(`${API_URL}/disciplines`);
            if (!response.ok) throw new Error("Ошибка загрузки данных");
            const data = await response.json();
            setDisciplines(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDisciplines();
    }, []);

    return {disciplines, loading, error, mutate: fetchDisciplines};
};

export default useDisciplines;
