export const mockModules = [
    {
        id: 1,
        title: "Программирование на bash (начальный уровень)",
        description: "Основы работы с bash для начинающих.",
        topic: "Программирование",
        content: [
            { type: "header", value: "Введение в bash" },
            { type: "text", value: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nisl elit ut gravida at amet orci. Faucibus malesuada dignissim a malesuada adipiscing. Bibendum feugiat in arcu eget etiam turpis mauris ullamcorper. Volutpat feugiat leo varius sed senectus. Elementum sed sed quam pretium nullam quisque. Molestie hendrerit fames nullam euismod consequat, interdum. Mauris dictum ultricies gravida amet tincidunt sit tellus, eget. Sit aliquam odio viverra feugiat sit ut. Scelerisque et id ut bibendum dolor. Amet tellus adipiscing volutpat fusce tellus egestas tempor interdum purus. Urna ut odio vitae leo turpis vitae mattis fringilla. Hac habitasse adipiscing nunc consequat nisi vel tristique volutpat. Blandit erat aliquet aenean condimentum mi, enim accumsan, pharetra feugiat. Sit ullamcorper lectus aliquam imperdiet vitae non." },
            { type: "image", value: "https://www.nowteam.net/wp-content/uploads/2020/04/Versioning-De%CC%81veloppeurs.jpeg" },
            { type: "header", value: "Основные команды" },
            { type: "text", value: "Bash — это мощный инструмент для автоматизации задач..." },
            { type: "header", value: "Заключение" },
            { type: "text", value: "Теперь вы знаете основы bash." },
        ],
    },
    {
        id: 2,
        title: "Программирование на bash (базовый уровень)",
        description: "Углубленное изучение bash для опытных пользователей.",
        topic: "Программирование",
        content: [
            { type: "header", value: "Циклы в bash" },
            { type: "text", value: "Циклы позволяют повторять команды и обрабатывать списки." },
            { type: "image", value: "images/bash_loops.png" },
            { type: "text", value: "Пример использования цикла for для обработки файлов." },
        ],
    },
    {
        id: 3,
        title: "Работа с Git (начальный уровень)",
        description: "Основы работы с системой контроля версий Git.",
        topic: "Системы контроля версий",
        content: [
            { type: "header", value: "Что такое Git?" },
            { type: "text", value: "Git — это распределенная система контроля версий для разработки ПО." },
            { type: "image", value: "images/git_overview.png" },
            { type: "text", value: "Основные команды: git init, git add, git commit, git push." },
        ],
    },
    {
        id: 4,
        title: "Работа с Git (базовый уровень)",
        description: "Углубленные команды и ветвление в Git.",
        topic: "Системы контроля версий",
        content: [
            { type: "header", value: "Работа с ветками" },
            { type: "text", value: "Создание веток: git branch. Переключение между ветками: git checkout." },
            { type: "image", value: "images/git_branches.png" },
            { type: "text", value: "Слияние веток и разрешение конфликтов." },
        ],
    },
    {
        id: 5,
        title: "Основы SQL (начальный уровень)",
        description: "Изучение основ работы с базами данных с использованием SQL.",
        topic: "Базы данных",
        content: [
            { type: "header", value: "Что такое SQL?" },
            { type: "text", value: "SQL — это язык для работы с базами данных." },
            { type: "text", value: "Команды: SELECT, INSERT, UPDATE, DELETE." },
            { type: "image", value: "images/sql_intro.png" },
        ],
    },
    {
        id: 6,
        title: "Основы Docker",
        description: "Изучение контейнеризации с помощью Docker.",
        topic: "Контейнеризация",
        content: [
            { type: "header", value: "Что такое Docker?" },
            { type: "text", value: "Docker позволяет упаковывать приложения и их зависимости в контейнеры." },
            { type: "image", value: "images/docker_intro.png" },
            { type: "text", value: "Основные команды: docker build, docker run, docker ps." },
        ],
    },
];



export const mockPrograms = [
    {
        id: 1,
        title: "Программа для школьников",
        description: "Учебная программа для старшеклассников.",
        content: [
            { type: "module", id: 1 },
            {
                type: "group",
                title: "Основы программирования",
                modules: [
                    { id: 2 },
                    { id: 3 },
                ],
            },
            { type: "module", id: 4 },
        ],
    },
    {
        id: 2,
        title: "Программа для разработчиков",
        description: "Подготовка начинающих разработчиков.",
        content: [
            { type: "module", id: 1 },
            { type: "module", id: 2 },
            {
                type: "group",
                title: "Работа с инструментами",
                modules: [
                    { id: 5 },
                    { id: 6 },
                ],
            },
        ],
    },
];


export const mockTopics = [
    {
        id: 1,
        title: "Программирование",
        description: "Обучение основам и углубленным аспектам программирования на различных языках и платформах.",
    },
    {
        id: 2,
        title: "Системы контроля версий",
        description: "Знания и навыки работы с системами контроля версий, такими как Git, для управления кодовой базой.",
    },
    {
        id: 3,
        title: "Базы данных",
        description: "Изучение реляционных баз данных и работы с ними при помощи SQL.",
    },
    {
        id: 4,
        title: "Контейнеризация",
        description: "Контейнеризация приложений с использованием технологий, таких как Docker, для удобного развертывания и масштабирования.",
    },
];
