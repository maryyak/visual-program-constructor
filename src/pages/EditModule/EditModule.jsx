import React, {useEffect, useRef} from 'react';
import {useParams} from "react-router-dom";
import {mockModules} from "../../utils/mockedData";
import styles from './EditModule.module.scss'
import CustomInput from "../../components/UI/CustomInput/CustomInput";
import clsx from "clsx";
import TopicEditor from "./components/TopicEditor/TopicEditor";

const EditModule = () => {
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
                <TopicEditor/>
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
                    <CustomInput
                        type="text"
                        value={module.title}
                    />
                </div>
                <div className={styles.titleContainer}>
                    <span className={styles.heading}>Содержание</span>
                    <div className={styles.contentContainer}>
                        {module.content.map((item, index) => {
                            switch (item.type) {
                                case "header":
                                    return <h2
                                        contentEditable
                                        suppressContentEditableWarning
                                        className={styles.editable}
                                        ref={(el) => (headersRef.current[index] = el)}
                                        key={index}>{item.value}</h2>;

                                case "text":
                                    return <p
                                        contentEditable
                                        suppressContentEditableWarning
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
                <div className={styles.editGroup}>
                    <div className={styles.elements}>
                        <div className={styles.elementsItem}>
                            <svg width="20" height="18" viewBox="0 0 20 18" fill="none"
                                 xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M6.20003 16.875C6.0409 16.875 5.88829 16.8115 5.77577 16.6985C5.66324 16.5855 5.60003 16.4322 5.60003 16.2723V13.2589H3.80003C3.32282 13.2583 2.86533 13.0676 2.5279 12.7287C2.19046 12.3898 2.00063 11.9302 2.00003 11.4509V1.80804C2.00063 1.3287 2.19046 0.869165 2.5279 0.530222C2.86533 0.191279 3.32282 0.000598051 3.80003 0H18.2C18.6773 0.000498563 19.1348 0.191148 19.4723 0.530112C19.8097 0.869077 19.9995 1.32867 20 1.80804V11.4509C19.9994 11.9302 19.8096 12.3898 19.4722 12.7287C19.1347 13.0676 18.6772 13.2583 18.2 13.2589H10.9108L6.57503 16.7428C6.46861 16.8284 6.33635 16.875 6.20003 16.875ZM3.80003 1.20536C3.6409 1.20536 3.48829 1.26885 3.37577 1.38188C3.26324 1.4949 3.20003 1.6482 3.20003 1.80804V11.4509C3.20003 11.6107 3.26324 11.764 3.37577 11.8771C3.48829 11.9901 3.6409 12.0536 3.80003 12.0536H6.20003C6.35916 12.0536 6.51177 12.1171 6.6243 12.2301C6.73682 12.3431 6.80003 12.4964 6.80003 12.6563V15.0188L10.325 12.1854C10.4315 12.1 10.5638 12.0535 10.7 12.0536H18.2C18.3592 12.0536 18.5118 11.9901 18.6243 11.8771C18.7368 11.764 18.8 11.6107 18.8 11.4509V1.80804C18.8 1.6482 18.7368 1.4949 18.6243 1.38188C18.5118 1.26885 18.3592 1.20536 18.2 1.20536H3.80003Z"
                                    fill="#908269"/>
                                <path
                                    d="M15.7996 6.02567H6.19964C6.04051 6.02567 5.8879 5.96217 5.77538 5.84915C5.66285 5.73612 5.59964 5.58283 5.59964 5.42299C5.59964 5.26315 5.66285 5.10986 5.77538 4.99683C5.8879 4.88381 6.04051 4.82031 6.19964 4.82031H15.7996C15.9588 4.82031 16.1114 4.88381 16.2239 4.99683C16.3364 5.10986 16.3996 5.26315 16.3996 5.42299C16.3996 5.58283 16.3364 5.73612 16.2239 5.84915C16.1114 5.96217 15.9588 6.02567 15.7996 6.02567Z"
                                    fill="#908269"/>
                                <path
                                    d="M10.9996 8.43583H6.19964C6.04051 8.43583 5.8879 8.37233 5.77538 8.2593C5.66285 8.14628 5.59964 7.99299 5.59964 7.83315C5.59964 7.67331 5.66285 7.52001 5.77538 7.40699C5.8879 7.29396 6.04051 7.23047 6.19964 7.23047H10.9996C11.1588 7.23047 11.3114 7.29396 11.4239 7.40699C11.5364 7.52001 11.5996 7.67331 11.5996 7.83315C11.5996 7.99299 11.5364 8.14628 11.4239 8.2593C11.3114 8.37233 11.1588 8.43583 10.9996 8.43583Z"
                                    fill="#908269"/>
                            </svg>
                            <span>Заголовок</span>
                        </div>
                        <div className={styles.elementsItem}>
                            <svg width="20" height="18" viewBox="0 0 20 18" fill="none"
                                 xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M6.20003 16.875C6.0409 16.875 5.88829 16.8115 5.77577 16.6985C5.66324 16.5855 5.60003 16.4322 5.60003 16.2723V13.2589H3.80003C3.32282 13.2583 2.86533 13.0676 2.5279 12.7287C2.19046 12.3898 2.00063 11.9302 2.00003 11.4509V1.80804C2.00063 1.3287 2.19046 0.869165 2.5279 0.530222C2.86533 0.191279 3.32282 0.000598051 3.80003 0H18.2C18.6773 0.000498563 19.1348 0.191148 19.4723 0.530112C19.8097 0.869077 19.9995 1.32867 20 1.80804V11.4509C19.9994 11.9302 19.8096 12.3898 19.4722 12.7287C19.1347 13.0676 18.6772 13.2583 18.2 13.2589H10.9108L6.57503 16.7428C6.46861 16.8284 6.33635 16.875 6.20003 16.875ZM3.80003 1.20536C3.6409 1.20536 3.48829 1.26885 3.37577 1.38188C3.26324 1.4949 3.20003 1.6482 3.20003 1.80804V11.4509C3.20003 11.6107 3.26324 11.764 3.37577 11.8771C3.48829 11.9901 3.6409 12.0536 3.80003 12.0536H6.20003C6.35916 12.0536 6.51177 12.1171 6.6243 12.2301C6.73682 12.3431 6.80003 12.4964 6.80003 12.6563V15.0188L10.325 12.1854C10.4315 12.1 10.5638 12.0535 10.7 12.0536H18.2C18.3592 12.0536 18.5118 11.9901 18.6243 11.8771C18.7368 11.764 18.8 11.6107 18.8 11.4509V1.80804C18.8 1.6482 18.7368 1.4949 18.6243 1.38188C18.5118 1.26885 18.3592 1.20536 18.2 1.20536H3.80003Z"
                                    fill="#908269"/>
                                <path
                                    d="M15.7996 6.02567H6.19964C6.04051 6.02567 5.8879 5.96217 5.77538 5.84915C5.66285 5.73612 5.59964 5.58283 5.59964 5.42299C5.59964 5.26315 5.66285 5.10986 5.77538 4.99683C5.8879 4.88381 6.04051 4.82031 6.19964 4.82031H15.7996C15.9588 4.82031 16.1114 4.88381 16.2239 4.99683C16.3364 5.10986 16.3996 5.26315 16.3996 5.42299C16.3996 5.58283 16.3364 5.73612 16.2239 5.84915C16.1114 5.96217 15.9588 6.02567 15.7996 6.02567Z"
                                    fill="#908269"/>
                                <path
                                    d="M10.9996 8.43583H6.19964C6.04051 8.43583 5.8879 8.37233 5.77538 8.2593C5.66285 8.14628 5.59964 7.99299 5.59964 7.83315C5.59964 7.67331 5.66285 7.52001 5.77538 7.40699C5.8879 7.29396 6.04051 7.23047 6.19964 7.23047H10.9996C11.1588 7.23047 11.3114 7.29396 11.4239 7.40699C11.5364 7.52001 11.5996 7.67331 11.5996 7.83315C11.5996 7.99299 11.5364 8.14628 11.4239 8.2593C11.3114 8.37233 11.1588 8.43583 10.9996 8.43583Z"
                                    fill="#908269"/>
                            </svg>
                            <span>Текст</span>
                        </div>
                        <div className={styles.elementsItem}>
                            <svg width="20" height="18" viewBox="0 0 20 18" fill="none"
                                 xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M6.20003 16.875C6.0409 16.875 5.88829 16.8115 5.77577 16.6985C5.66324 16.5855 5.60003 16.4322 5.60003 16.2723V13.2589H3.80003C3.32282 13.2583 2.86533 13.0676 2.5279 12.7287C2.19046 12.3898 2.00063 11.9302 2.00003 11.4509V1.80804C2.00063 1.3287 2.19046 0.869165 2.5279 0.530222C2.86533 0.191279 3.32282 0.000598051 3.80003 0H18.2C18.6773 0.000498563 19.1348 0.191148 19.4723 0.530112C19.8097 0.869077 19.9995 1.32867 20 1.80804V11.4509C19.9994 11.9302 19.8096 12.3898 19.4722 12.7287C19.1347 13.0676 18.6772 13.2583 18.2 13.2589H10.9108L6.57503 16.7428C6.46861 16.8284 6.33635 16.875 6.20003 16.875ZM3.80003 1.20536C3.6409 1.20536 3.48829 1.26885 3.37577 1.38188C3.26324 1.4949 3.20003 1.6482 3.20003 1.80804V11.4509C3.20003 11.6107 3.26324 11.764 3.37577 11.8771C3.48829 11.9901 3.6409 12.0536 3.80003 12.0536H6.20003C6.35916 12.0536 6.51177 12.1171 6.6243 12.2301C6.73682 12.3431 6.80003 12.4964 6.80003 12.6563V15.0188L10.325 12.1854C10.4315 12.1 10.5638 12.0535 10.7 12.0536H18.2C18.3592 12.0536 18.5118 11.9901 18.6243 11.8771C18.7368 11.764 18.8 11.6107 18.8 11.4509V1.80804C18.8 1.6482 18.7368 1.4949 18.6243 1.38188C18.5118 1.26885 18.3592 1.20536 18.2 1.20536H3.80003Z"
                                    fill="#908269"/>
                                <path
                                    d="M15.7996 6.02567H6.19964C6.04051 6.02567 5.8879 5.96217 5.77538 5.84915C5.66285 5.73612 5.59964 5.58283 5.59964 5.42299C5.59964 5.26315 5.66285 5.10986 5.77538 4.99683C5.8879 4.88381 6.04051 4.82031 6.19964 4.82031H15.7996C15.9588 4.82031 16.1114 4.88381 16.2239 4.99683C16.3364 5.10986 16.3996 5.26315 16.3996 5.42299C16.3996 5.58283 16.3364 5.73612 16.2239 5.84915C16.1114 5.96217 15.9588 6.02567 15.7996 6.02567Z"
                                    fill="#908269"/>
                                <path
                                    d="M10.9996 8.43583H6.19964C6.04051 8.43583 5.8879 8.37233 5.77538 8.2593C5.66285 8.14628 5.59964 7.99299 5.59964 7.83315C5.59964 7.67331 5.66285 7.52001 5.77538 7.40699C5.8879 7.29396 6.04051 7.23047 6.19964 7.23047H10.9996C11.1588 7.23047 11.3114 7.29396 11.4239 7.40699C11.5364 7.52001 11.5996 7.67331 11.5996 7.83315C11.5996 7.99299 11.5364 8.14628 11.4239 8.2593C11.3114 8.37233 11.1588 8.43583 10.9996 8.43583Z"
                                    fill="#908269"/>
                            </svg>
                            <span>Группа</span>
                        </div>
                        <div className={styles.elementsItem}>
                            <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"
                                 width="25" height="25" viewBox="0 0 25 25" fill="none">
                                <rect width="25" height="25" fill="url(#pattern0_731_2041)"/>
                                <defs>
                                    <pattern id="pattern0_731_2041" patternContentUnits="objectBoundingBox" width="1"
                                             height="1">
                                        <use xlinkHref="#image0_731_2041" transform="scale(0.015625)"/>
                                    </pattern>
                                    <image id="image0_731_2041" width="64" height="64"
                                           xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAAGXRFWHRTb2Z0d2FyZQB3d3cuaW5rc2NhcGUub3Jnm+48GgAABMhJREFUeJztml1sFFUYht9vpmkpIkZtQwQSBTT0jkaiJcbGghYNhpRQuuGKqBck20L3R5pg290OrWlrIralPzvtnQnebGMjamIIggFDQEIIRhE3QKwobSQUCipiu3M+L8rC2szuzu7MbNt0nqvZc94z33venNn5BRwcHBwcHBwcHBwc5iOUrLOvzf34xCT2ELCNgWcA5GbHlmkmCBhmIMwib79P6RxPJEwYQIfiXkkSvgawwhaL2eOKTHL57kDPL3qdkl5jOFwlQ8IQ5v7kAWCVBm0oHK6S9Tp1A7gWKawgYI29vrIIo/hapGCzXpduAJLgDfY6mgEEdOekG4AgKrTXzQxAtESvWTcAIk56dpiLJJqTbgDzCcsCYOA4sbQlKrTC/CVarkTas0TkBTBiVQ07yLFiJ8Ro8wRDDUTguOYrALp6WmsORqPiMIC1VtSyGgtWAB/1NIXqp03+Abvqe8dIaFsB3DVfy3pMB8BMHak0HmXgKhM+NVvLDkwHoLH2nREdMZ02W8sOTAeQ+0Ten8aUfMdsLTswHQDd5qWGdODlZmvZgekAotA2GVOSQV12Mb8CmPf2tNY8mUzTta+mgoFSs7XswILTIC2PRsXhDsW9Uq+3o6V6K5M4aL6OPVhyIQRgLUm42NnsHgL4JDNuEdHTYGwG87oM93kTwHkwckEoBrDIIq//w6oAgKnHZdsB2k6x247Mbqk0AG1i0YJWv7/jH+D+o7ko9oPxtjVWH2JlAFbwL4F3eIJqOL6x+r3QLQDvdLa4I2C0W1lwNt0NjkOSNk6ffDzeQOgDAtwAhFVFZ0sAoxJEmbex90QqoScYUpl5B4CoFYVnQwA/kdDW1Qb7vzc6wNekfgJCJYB7ZovPbACM01GhveJRBq6mO9QbCH3OxG8C+MuMhRkLgMGHxKMLNuxRBm5kug9fQD0mgE0E3M50H5kGcA9As5DEC0LQc2DeBuJzaYxXlxWNVcZOc2bwB0PfapJ4DUBGQWZyGhwRkN/wB3t+iGu7HA5XfTZ6saCFCXuR+AqAibjJE1BbMqibEH9j/9mPmmvKJIgjAJ5KZ2xaK4CBX4lE2bTJAwBcrkHN0xSqF0wVCZakBmK31ZOP4Q/2XmDBL2HqUZxh0gkgIiQq9QT6LyU10tT3BRNKAPo5rvkuiLd4A2p/OubSxaeowyxrpSD8aHSM0QAusKytf7ex7zcjYm8gFJGEXMLgQwBuMnijN6B+adSUGXwNA6OTGr8KwnkjegMB0CkWeS/7GgZG0zFSq3TfWVY0VimJnDW+oHoynbFmqVPU66zlrQfoVCptygAm8xeWJ3u/ngyXa1CrVbp/z2SsWXxK5/hk/sLyVLqUAdTVffi3NZayjxHvugEwEz/czvCmdhYQ7z1+TvHovxwFrse2e/btXG29tezQ+X510YMfzH/oafQDYHEsth2V5K4Dyu7Flruzmfb2nY9JzAdivyVIR/V0uss7HK6SRyIFZ8Eovt90A6AzIJ4b/wdMjwBcAmDqYS3xuaWrx150uQa16dKEx3d3y64VGmtHAKyyzWh2uMyCy32KOqzXqfvhEAB89c2Z8bLXn/9YjsqTNPV1xeJk+lnGBECXAPRJIuctr9Kne/w7ODg4ODg4ODg4OMxf/gNN6prI1iyjZgAAAABJRU5ErkJggg=="/>
                                </defs>
                            </svg>
                            <span>Изображение</span>
                        </div>
                        <div className={styles.elementsItem}>
                            <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"
                                 width="18" height="17" viewBox="0 0 18 17" fill="none">
                                <rect width="18" height="17" fill="url(#pattern0_826_1807)"/>
                                <defs>
                                    <pattern id="pattern0_826_1807" patternContentUnits="objectBoundingBox" width="1"
                                             height="1">
                                        <use xlinkHref="#image0_826_1807"
                                             transform="matrix(0.00390625 0 0 0.00413603 0 -0.0294118)"/>
                                    </pattern>
                                    <image id="image0_826_1807" width="256" height="256"
                                           xlinkHref="data:image/png;base64,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"/>
                                </defs>
                            </svg>
                            <span>Файл</span>
                        </div>
                    </div>
                    <div className={styles.actions}>
                        <div className={styles.actionsItem}>
                            <svg width="19" height="19" viewBox="0 0 19 19" fill="none"
                                 xmlns="http://www.w3.org/2000/svg">
                                <g clipPath="url(#clip0_731_2036)">
                                    <path
                                        d="M9.07807 14.7161C9.13431 14.7727 9.20147 14.8173 9.27547 14.8472C9.34683 14.8762 9.42316 14.8911 9.50021 14.891C9.57725 14.891 9.65358 14.8762 9.72495 14.8472C9.79884 14.8173 9.86588 14.7727 9.92198 14.7161L13.7961 10.8419C13.8526 10.7857 13.8972 10.7187 13.9272 10.6449C13.9563 10.5735 13.9712 10.4972 13.9711 10.4201C13.9712 10.3431 13.9563 10.2668 13.9272 10.1954C13.8972 10.1216 13.8526 10.0546 13.7961 9.99836C13.74 9.94175 13.673 9.89714 13.5991 9.86726C13.5278 9.83823 13.4514 9.82335 13.3744 9.82344C13.2973 9.82335 13.221 9.83823 13.1496 9.86726C13.0757 9.89714 13.0087 9.94175 12.9526 9.99836L10.0965 12.8541V0.596689C10.097 0.47788 10.0616 0.361688 9.99502 0.263323C9.93027 0.167428 9.83923 0.0922534 9.73282 0.0468218C9.65941 0.0159665 9.58059 4.95195e-05 9.50096 7.19208e-07C9.38214 -0.000184239 9.26601 0.0353089 9.16759 0.101883C9.07163 0.166548 8.99643 0.257613 8.95109 0.364082C8.92004 0.437561 8.90412 0.516544 8.90427 0.596314V12.8541L6.04781 9.99836C5.99158 9.94174 5.92442 9.89713 5.85041 9.86726C5.77906 9.83819 5.70272 9.82331 5.62567 9.82344C5.54863 9.82338 5.47231 9.83827 5.40093 9.86726C5.32709 9.89723 5.26007 9.94183 5.20391 9.99836C5.14755 10.0547 5.10298 10.1217 5.07281 10.1954C5.04406 10.2668 5.02931 10.3431 5.02936 10.4201C5.02931 10.4971 5.04406 10.5734 5.07281 10.6449C5.10298 10.7186 5.14755 10.7856 5.20391 10.8419L9.07807 14.7161Z"
                                        fill="#908269"/>
                                    <path
                                        d="M1.09104 9.16762C1.0263 9.07172 0.935255 8.99655 0.828843 8.95112C0.755495 8.92007 0.676634 8.90414 0.596984 8.9043C0.478168 8.90411 0.362033 8.93961 0.26362 9.00618C0.167652 9.07084 0.0924574 9.16191 0.0471178 9.26838C0.0152467 9.34181 -0.00144398 9.42093 -0.00195065 9.50099V17.7194C-0.0024534 17.9747 0.073759 18.2242 0.216799 18.4356C0.355923 18.6418 0.55187 18.8033 0.780899 18.9004C0.938665 18.967 1.1082 19.0013 1.27945 19.0012H17.7167C17.9719 19.0017 18.2214 18.9255 18.4328 18.7824C18.639 18.6432 18.8004 18.4473 18.8977 18.2183C18.9644 18.0605 18.9985 17.8908 18.9981 17.7194V9.50099C18.9986 9.38218 18.9632 9.26599 18.8965 9.16762C18.8318 9.07172 18.7408 8.99655 18.6343 8.95112C18.561 8.92007 18.4821 8.90414 18.4025 8.9043C18.2837 8.90411 18.1675 8.93961 18.0691 9.00618C17.9732 9.07084 17.898 9.16191 17.8526 9.26838C17.8214 9.3418 17.8055 9.42082 17.8058 9.50061V17.8078H1.19255V9.50099C1.19305 9.38218 1.15767 9.26599 1.09104 9.16762Z"
                                        fill="#908269"/>
                                </g>
                                <defs>
                                    <clipPath id="clip0_731_2036">
                                        <rect width="19" height="19" fill="white"/>
                                    </clipPath>
                                </defs>
                            </svg>
                        </div>
                        <div className={styles.actionsItem}>
                            Сохранить изменения
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditModule;