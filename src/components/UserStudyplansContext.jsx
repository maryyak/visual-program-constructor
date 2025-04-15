import React, { createContext, useContext, useEffect, useState } from "react";

const API_URL = process.env.REACT_APP_API_URL;
const UserStudyplansContext = createContext();

export const UserStudyplansProvider = ({ children }) => {
    const [userStudyplans, setUserStudyplans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchUserStudyplans = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/user-studyplans`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
            });
            if (!response.ok) throw new Error("Ошибка загрузки учебных планов");
            const data = await response.json();
            setUserStudyplans(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserStudyplans();
    }, []);

    return (
        <UserStudyplansContext.Provider
            value={{ userStudyplans, loading, error, mutate: fetchUserStudyplans }}
        >
            {children}
        </UserStudyplansContext.Provider>
    );
};

export const useUserStudyplans = () => useContext(UserStudyplansContext);
