import { useState, useEffect } from "react";

const API_URL = process.env.REACT_APP_API_URL;

const useStudyplans = () => {
    const [studyplans, setStudyplans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStudyplans = async () => {
            try {
                const response = await fetch(`${API_URL}/studyplans`);
                if (!response.ok) throw new Error("Ошибка загрузки данных");
                const data = await response.json();
                setStudyplans(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchStudyplans();
    }, []);

    return { studyplans, loading, error };
};

export default useStudyplans;
