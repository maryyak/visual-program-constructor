import React, {useState} from 'react';
import useSearch from "../../hooks/useSearch";
import usePagination from "../../hooks/usePagination";
import styles from "./MyDisciplines.module.scss";
import BaseTitle from "../../components/BaseTitle/BaseTitle";
import Pagination from "../../components/Pagination/Pagination";
import DisciplineCard from "./components/DisciplineCard/DisciplineCard";
import useUserDisciplines from "../../hooks/api/disciplines/useUserDIsciplines";
import BackButton from "../../components/BackButton/BackButton";

const API_URL = process.env.REACT_APP_API_URL;

const MyDisciplines = () => {
    const {userDisciplines, loading, error, mutate} = useUserDisciplines();

    const [query, setQuery] = useState("");
    const handleSearch = (e) => {
        setQuery(e.target.value);
    };

    const addDiscipline = async () => {
        try {
            const response = await fetch(`${API_URL}/disciplines`, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({title: "Новая дисциплина", description: "Описание дисциплины"}),
            });

            if (!response.ok) throw new Error("Ошибка добавления дисциплины");

            const discipline = await response.json(); // Получаем данные о новой дисциплине

            // 2. Привязываем дисциплину к текущему пользователю
            const bindResponse = await fetch(`${API_URL}/user-disciplines/${discipline.id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: 'include', // важно для куков
            });

            if (!bindResponse.ok) {
                throw new Error("Ошибка привязки дисциплины к пользователю");
            }

            if (bindResponse.ok) mutate();


        } catch (error) {
            console.error("Ошибка:", error);
        }

    }


    const filteredModules = useSearch(userDisciplines, query);
    const {currentElements, ...paginationProps} = usePagination(filteredModules);

    if (loading) return <p>Загрузка...</p>;
    if (error) return <p style={{color: "red"}}>Ошибка: {error}</p>;

    return (
        <>
            <BackButton link={'/'}/>
            <div className={styles.container}>
                <BaseTitle title="Мои дисциплины"
                           button={<button className={styles.button} onClick={() => addDiscipline()}>Создать новую
                               дисциплины</button>}
                />
                <div className={styles.searchWrapper}>
                    <svg className={styles.searchIcon} xmlns="http://www.w3.org/2000/svg" width="21" height="20"
                         viewBox="0 0 21 20" fill="none">
                        <path fillRule="evenodd" clipRule="evenodd"
                              d="M2.92289 15.6371C-0.65431 12.0599 -0.65431 6.2601 2.92289 2.6829C6.50009 -0.894301 12.2999 -0.894301 15.8771 2.6829C19.1467 5.95254 19.4278 11.079 16.7205 14.6679L20.3343 18.2818L20.3342 18.282L20.3343 18.2822C21.2772 19.225 19.8629 20.6392 18.9201 19.6964L15.3493 16.1256C11.7505 19.2061 6.32909 19.0433 2.92289 15.6371ZM14.4629 4.09712C11.6667 1.30096 7.13326 1.30096 4.33711 4.09712C1.54095 6.89327 1.54095 11.4267 4.33711 14.2229C7.13326 17.019 11.6667 17.019 14.4629 14.2229C17.259 11.4267 17.259 6.89327 14.4629 4.09712Z"
                              fill="#908269"/>
                    </svg>
                    <input
                        className={styles.search}
                        type="text"
                        placeholder="Поиск по дисциплинам"
                        value={query}
                        onChange={handleSearch}
                    />
                </div>
                <div className={styles.gridLayout}>
                    {currentElements.map((discipline) => (
                        <DisciplineCard key={discipline.id} discipline={discipline}/>
                    ))}
                </div>
                <Pagination {...paginationProps}/>
            </div>
        </>
    );
};

export default MyDisciplines;