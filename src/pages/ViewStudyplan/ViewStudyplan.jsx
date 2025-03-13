import React from 'react';
import {useNavigate, useParams} from "react-router-dom";
import useStudyplans from "../../hooks/api/studyplans/useStudyplans";
import useStudyplansDisciplines from "../../hooks/api/studyplans/useStudyplansDisciplines";
import clsx from "clsx";
import styles from "../ViewDiscipline/ViewDiscipline.module.scss";
import StudyplanDiscipline from "../EditStudyplan/components/StudyplanDiscipline/StudyplanDiscipline";

const ViewStudyplan = () => {
    const navigate = useNavigate();

    const {id} = useParams();
    const {studyplans, loading: studyplansLoading, error: studyplansError} = useStudyplans();
    const studyplan = studyplans.find((mod) => mod.id === Number(id));

    const {disciplines, loading: disciplinesLoading, error: disciplinesError} = useStudyplansDisciplines(id);

    if (disciplinesLoading || studyplansLoading) return <p>Загрузка...</p>;
    if (disciplinesError || studyplansError) return <p style={{color: "red"}}>Ошибка: {disciplinesError}</p>;

    return (
        <div>
            <div className={clsx(styles.colContainer, styles.main)}>
                <div className={styles.titleContainer}>
                    <h1>{studyplan?.title}</h1>
                </div>
                <div className={styles.descriptionContainer}>
                    <span className={styles.heading}>Описание дисциплины:</span>
                    <p>{studyplan?.description}</p>
                    <span className={styles.heading}>Номер курса:</span>
                    <p>{studyplan?.courseNumber}</p>
                </div>
            </div>
            <div>
                <div className={styles.contentContainer}>
                    <span className={styles.contentsHeading}>Дисциплины</span>
                    <div className={styles.disciplineContainer}>
                        {disciplines?.map((discipline) => (
                            <div key={discipline.id} className={styles.moduleContainer}>
                                <StudyplanDiscipline discipline={discipline} withDescription/>
                                <button
                                    className={styles.arrowButton}
                                    onClick={() => navigate(`/discipline/${discipline.id}`)}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"
                                         width="34"
                                         height="31" viewBox="0 0 34 31" fill="none">
                                        <rect width="34" height="31" fill="url(#pattern0_839_1862)"/>
                                        <defs>
                                            <pattern id="pattern0_839_1862" patternContentUnits="objectBoundingBox"
                                                     width="1"
                                                     height="1">
                                                <use xlinkHref="#image0_839_1862"
                                                     transform="matrix(0.00195312 0 0 0.00214214 0 -0.0483871)"/>
                                            </pattern>
                                            <image id="image0_839_1862" width="512" height="512"
                                                   xlinkHref="data:image/png;base64,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"/>
                                        </defs>
                                    </svg>
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewStudyplan;