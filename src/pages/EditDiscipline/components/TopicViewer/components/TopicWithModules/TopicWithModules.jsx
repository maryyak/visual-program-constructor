import {useState} from "react";
import {Draggable, Droppable} from "@hello-pangea/dnd";
import styles from "./TopicWithModules.module.scss";

const TopicWithModules = ({topic, modules}) => {

    const [showModules, setShowModules] = useState(true);

    return (
        <div className={styles.topic} id={topic.id} key={topic.id}>
            <div className={styles.topicHeading} onClick={() => setShowModules(!showModules)}>
                <svg
                    style={{rotate: showModules ? "" : "90deg"}}
                    width="5"
                    height="10"
                    viewBox="0 0 5 10"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path d="M0 10L5 5L0 0L0 10Z" fill="#151515"/>
                </svg>
                <span>{topic.title}</span>
            </div>
            {showModules &&
                <div>
                    <Droppable droppableId="topicModules">
                        {(provided) => (
                            <div ref={provided.innerRef} {...provided.droppableProps}
                                 className={styles.topicModules}>
                                {modules.map((mod, index) => (
                                    <Draggable key={mod.id} draggableId={`module-${mod.id}`} index={index}>
                                        {(provided) => (
                                            <div
                                                className={styles.module}
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                            >
                                                {mod.title || mod.name}
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </div>
            }
        </div>
    );
};

export default TopicWithModules;
