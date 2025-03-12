import {Draggable} from "@hello-pangea/dnd";
import React from "react";
import useDisciplinesModules from "../../../hooks/api/disciplines/useDisciplinesModules";

const StudyplanDiscipline = ({disciplineId}) => {

    const {modules} = useDisciplinesModules(disciplineId)

    return (
        <div>
            {modules && modules.length > 0 ? (
                modules.map((module, moduleIndex) => (
                    <Draggable
                        key={`module-${module.id}-discipline-${disciplineId}`}
                        draggableId={`module-${module.id}-discipline-${disciplineId}`}
                        index={moduleIndex}
                    >
                        {(providedModuleItem) => (
                            <div
                                ref={providedModuleItem.innerRef}
                                {...providedModuleItem.draggableProps}
                                {...providedModuleItem.dragHandleProps}
                                style={{
                                    padding: '4px',
                                    margin: '4px 0',
                                    backgroundColor: '#d0ffd0',
                                    borderRadius: '4px',
                                    ...providedModuleItem.draggableProps.style,
                                }}
                            >
                                {module.title || module.name}
                            </div>
                        )}
                    </Draggable>
                ))
            ) : (
                <div style={{fontStyle: 'italic', color: '#999'}}>
                    Нет модулей
                </div>
            )}
        </div>
    );
};

export default StudyplanDiscipline;