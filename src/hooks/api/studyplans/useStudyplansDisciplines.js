import {useState, useEffect} from "react";

const API_URL = process.env.REACT_APP_API_URL;

const useStudyplansDisciplines = (studyplanId) => {
    const [disciplines, setDisciplines] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


    const fetchStudyplansDisciplines = async () => {
        try {
            const response = await fetch(`${API_URL}/studyplans/${studyplanId}/disciplines`);
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
        fetchStudyplansDisciplines();
    }, []);

    return {disciplines, loading, error, mutate: fetchStudyplansDisciplines};
};

export default useStudyplansDisciplines;
