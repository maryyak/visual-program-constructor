import {useState} from 'react';
import {mockTopics} from "../../../../utils/mockedData";
import useSearch from "../../../../hooks/useSearch";
import styles from "./TopicEditor.module.scss";

const TopicEditor = () => {
    const topics = mockTopics;

    const [query, setQuery] = useState("");
    const handleSearch = (e) => {
        setQuery(e.target.value);
    };

    const currentElements = useSearch(topics, query);

    return (
        <div className={styles.topicEditor}>
            <div className={styles.heading}>Добавить в тему</div>
            <div className={styles.content}>
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
                <div className={styles.topicsGroup}>
                    {currentElements.map((topic) => (
                        <div className={styles.topic} id={topic.id} key={topic.id}>
                            {topic.title}
                        </div>
                    ))}
                </div>
                <div className={styles.addGroup}>
                    <svg width="15" height="14" viewBox="0 0 15 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M4.80469 6.5625H7.03125V4.48438C7.03125 4.42422 7.08398 4.375 7.14844 4.375H7.85156C7.91602 4.375 7.96875 4.42422 7.96875 4.48438V6.5625H10.1953C10.2598 6.5625 10.3125 6.61172 10.3125 6.67188V7.32812C10.3125 7.38828 10.2598 7.4375 10.1953 7.4375H7.96875V9.51562C7.96875 9.57578 7.91602 9.625 7.85156 9.625H7.14844C7.08398 9.625 7.03125 9.57578 7.03125 9.51562V7.4375H4.80469C4.74023 7.4375 4.6875 7.38828 4.6875 7.32812V6.67188C4.6875 6.61172 4.74023 6.5625 4.80469 6.5625Z"
                            fill="#908269"/>
                        <path
                            d="M12.8906 12.4688H2.10938C1.8501 12.4688 1.64062 12.2732 1.64062 12.0312V1.96875C1.64062 1.72676 1.8501 1.53125 2.10938 1.53125H12.8906C13.1499 1.53125 13.3594 1.72676 13.3594 1.96875V12.0312C13.3594 12.2732 13.1499 12.4688 12.8906 12.4688ZM12.3047 2.51562H2.69531V11.4844H12.3047V2.51562Z"
                            fill="#908269"/>
                    </svg>
                    <span>Создать тему</span>
                </div>
            </div>
        </div>
    );
};

export default TopicEditor;