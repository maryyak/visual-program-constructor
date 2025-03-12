import styles from "./DisciplineViewer.module.scss"
import useSearch from "../../../../hooks/useSearch";
import React, {useState} from "react";
import {Draggable, Droppable} from "@hello-pangea/dnd";

const DisciplineViewer = ({availableDisciplines}) => {

    const [query, setQuery] = useState("");

    const handleSearch = (e) => {
        setQuery(e.target.value);
    };

    const currentElements = useSearch(availableDisciplines, query);

    return (
        <>
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
                    placeholder="Поиск"
                    value={query}
                    onChange={handleSearch}
                />
            </div>
            <Droppable droppableId="availableDisciplines">
                {(provided) => (
                    <div ref={provided.innerRef} {...provided.droppableProps} className={styles.studyplanDisciplines}>
                        {currentElements.map((disc, index) => (
                            <Draggable key={disc.id} draggableId={`discipline-${disc.id}`} index={index}>
                                {(provided) => (
                                    <div
                                        className={styles.module}
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                    >
                                        {disc.title || disc.name}
                                    </div>
                                )}
                            </Draggable>
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </>
    );
};

export default DisciplineViewer;