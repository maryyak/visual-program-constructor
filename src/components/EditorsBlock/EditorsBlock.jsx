import React, {useState} from 'react';
import clsx from "clsx";
import authUser from "../../hooks/api/users/authUser";
import styles from "./EditorsBlock.module.scss"

const EditorsBlock = ({elementId, data, loading, error, handleGiveAccess}) => {
    const {users} = authUser();

    const [searchQuery, setSearchQuery] = useState("");
    const userArray = users?.users || [];

    const [filteredUsers, setFilteredUsers] = useState(userArray);
    const [selectedUser, setSelectedUser] = useState(null);

    const handleSearchChange = (e) => {
        const query = e.target.value;
        setSearchQuery(query);

        if (Array.isArray(userArray)) {
            const filteredUsers = userArray.filter(user =>
                user.username.toLowerCase().includes(query.toLowerCase())
            );
            setFilteredUsers(filteredUsers);
        } else {
            console.error('Ошибка: users не является массивом', userArray);
        }
    };

    const handleUserClick = (user) => {
        setSelectedUser(user);
    };

    return (
        <div className={clsx(styles.contents, styles.searchContainer)}>
            <span className={styles.contentsHeading}>Редакторы</span>
            <ul>
                {loading && <p>Загрузка...</p>}
                {error && <p style={{color: "red"}}>Ошибка: {error}</p>}
                {data.map((user, index) => {
                        return <li key={index}>{user.username}</li>
                    }
                )}
            </ul>
            <input
                type="text"
                placeholder="Поиск пользователя..."
                value={searchQuery}
                onChange={handleSearchChange}
                className={styles.searchInput}
            />
            {searchQuery && (
                <ul className={styles.searchUl}>
                    {filteredUsers?.map((user, index) => (
                        <li
                            className={clsx(styles.searchLi, user.id === selectedUser?.id && styles.selected)}
                            key={index}
                            onClick={() => handleUserClick(user)} // Устанавливаем выбранного пользователя
                        >
                            {user.username}
                        </li>
                    ))}
                </ul>
            )}
            <button
                className={styles.searchButton}
                onClick={() => selectedUser && handleGiveAccess(selectedUser, elementId)} // Отправляем выбранного пользователя
                disabled={!selectedUser} // Если пользователь не выбран, кнопка будет отключена
            >
                Открыть доступ к дисциплине
            </button>
        </div>
    );
};

export default EditorsBlock;