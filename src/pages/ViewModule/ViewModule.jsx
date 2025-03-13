import React, {useEffect, useRef} from 'react';
import {useParams} from "react-router-dom";
import styles from "../EditModule/EditModule.module.scss";
import clsx from "clsx";
import useModules from "../../hooks/api/modules/useModules";

const API_URL = process.env.REACT_APP_API_URL;

const ViewModule = () => {
    const {id} = useParams();
    const { modules, loading, error } = useModules();
    const module = modules.find((mod) => mod.id === Number(id));

    const headersRef = useRef([]); // Хранение ссылок на заголовки

    const handleScrollTo = (index) => {
        headersRef.current[index]?.scrollIntoView({behavior: "smooth"});
    };

    useEffect(() => {
        headersRef.current = headersRef.current.slice(0, module?.content.length);
    }, [module?.content]);

    if (loading) return <p>Загрузка...</p>;
    if (error) return <p style={{color: "red"}}>Ошибка: {error}</p>;

    return (
        <div className={styles.page}>
            <div className={clsx(styles.colContainer, styles.aside)}>
                <div className={styles.contents}>
                    <span className={styles.contentsHeading}>Оглавление</span>
                    {module?.content
                        .map((item, index) => item.type === "header" && ({...item, index}))
                        .filter(Boolean)
                        .map(({value, index}) => (
                            <button className={styles.contentsItem} key={index}
                                    onClick={() => handleScrollTo(index)}>{value}</button>
                        ))}
                </div>
            </div>
            <div className={clsx(styles.colContainer, styles.main)}>
                <div className={styles.titleContainer}>
                    <span className={styles.heading}>Название модуля</span>
                    <h2>{module?.title}</h2>
                </div>
                <div className={styles.titleContainer}>
                    <span className={styles.heading}>Содержание</span>
                    <div className={styles.contentContainer}>
                        {module?.content.map((item, index) => {
                            switch (item.type) {
                                case "header":
                                    return <h2
                                        className={styles.editable}
                                        ref={(el) => (headersRef.current[index] = el)}
                                        key={index}>{item.value}</h2>;

                                case "text":
                                    return <p
                                        className={styles.editable}
                                        key={index}>{item.value}</p>;

                                case "image":
                                    return <img className={styles.image} key={index} src={item.value} alt="content"/>;

                                case "file":
                                    return <div className={styles.fileItem} key={index}>
                                        <a href={item.value} target="_blank"
                                           rel="noopener noreferrer">
                                            📄 {item.value.replace(`${API_URL}/upload/`, "")}
                                        </a>
                                    </div>

                                default:
                                    return "";
                            }
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewModule;