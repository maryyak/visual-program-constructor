import useDisciplinesModules from "../../../hooks/api/disciplines/useDisciplinesModules";
import { useNavigate } from "react-router-dom";


const Modules = ({ disciplineId }) => {
    const { modules, loading, error } = useDisciplinesModules(disciplineId);
    const navigate = useNavigate();

    if (loading) return <div>Загрузка модулей...</div>;
    if (error) return <div style={{ color: "red" }}>Ошибка при загрузке модулей: {error}</div>;

    return (
        <ul>
            {modules.map((module) => (
                <li key={module.id} onDoubleClick={() => navigate(`/module/${module.id}`)}>
                    {module.title}
                </li>
            ))}
        </ul>
    );
};

export default Modules;