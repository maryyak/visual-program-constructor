import React, {useEffect, useRef} from 'react';
import {useParams} from "react-router-dom";
import {mockModules} from "../../utils/mockedData";
import styles from "../EditModule/EditModule.module.scss";
import clsx from "clsx";
import CustomInput from "../../components/UI/CustomInput/CustomInput";

const ViewModule = () => {
    const {id} = useParams();
    const module = mockModules.find(mod => mod.id == id);

    const headersRef = useRef([]); // Хранение ссылок на заголовки

    const handleScrollTo = (index) => {
        headersRef.current[index]?.scrollIntoView({behavior: "smooth"});
    };

    useEffect(() => {
        headersRef.current = headersRef.current.slice(0, module.content.length); // Актуализируем массив ссылок
    }, [module.content]);

    return (
        <div className={styles.page}>
            <div className={clsx(styles.colContainer, styles.aside)}>
                <div className={styles.contents}>
                    <span className={styles.contentsHeading}>Оглавление</span>
                    {module.content
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
                    <h2>{module.title}</h2>
                </div>
                <div className={styles.titleContainer}>
                    <span className={styles.heading}>Содержание</span>
                    <div className={styles.contentContainer}>
                        {module.content.map((item, index) => {
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