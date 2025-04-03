import useDisciplinesModules from "../../../hooks/api/disciplines/useDisciplinesModules";


const Modules = ({ disciplineId }) => {
    const { modules, loading, error } = useDisciplinesModules(disciplineId);

    if (loading) return <div>Загрузка модулей...</div>;
    if (error) return <div style={{ color: "red" }}>Ошибка при загрузке модулей: {error}</div>;

    return (
        <ul>
            {modules.map((module) => (
                <li key={module.id}>
                    {module.title}
                </li>
            ))}
        </ul>
    );
};

export default Modules;