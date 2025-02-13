const useSearch = (data, query) => {
    // Приводим запрос к нижнему регистру для поиска без учета регистра
    const normalizedQuery = query.toLowerCase();

    return data.filter((item) => {
        const title = item.title?.toLowerCase();
        const text = item.description?.toLowerCase();

        // Проверяем, содержит ли заголовок или текст введённый запрос
        return title?.includes(normalizedQuery) || text?.includes(normalizedQuery);
    });
};

export default useSearch;