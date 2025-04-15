import React, { useEffect, useState } from "react";
import {
    PDFDownloadLink,
    Document,
    Page,
    Text,
    View,
    StyleSheet,
    Image,
    Font,
    Link,
} from "@react-pdf/renderer";
import useStudyplans from "../hooks/api/studyplans/useStudyplans";
import useStudyplansDisciplines from "../hooks/api/studyplans/useStudyplansDisciplines";

const API_URL = process.env.REACT_APP_API_URL;

Font.register({
    family: "Roboto",
    fonts: [
        {
            src: "/fonts/Roboto-Regular.ttf",
            fontWeight: "normal",
        },
        {
            src: "/fonts/Roboto-Bold.ttf",
            fontWeight: "bold",
        },
    ],
});

const styles = StyleSheet.create({
    // Общая страница
    page: {
        fontFamily: "Roboto",
        padding: 40,
        backgroundColor: "#FFFFFF",
    },
    // Заголовок учебного плана (обложка)
    title: {
        fontSize: 28,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 20,
        color: "#4a4a4a",
    },
    // Общий раздел (например, для каждой дисциплины)
    disciplineBlock: {
        marginVertical: 20,
        padding: 15,
        border: "1pt solid #908269",
        borderRadius: 6,
        backgroundColor: "#faf9f7",
    },
    // Заголовок дисциплины
    header: {
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 8,
        color: "#4a4a4a",
        borderBottom: "1pt solid #908269",
        paddingBottom: 4,
    },
    // Подзаголовок внутри дисциплины (например, название модуля)
    subheader: {
        fontSize: 16,
        fontWeight: "bold",
        marginVertical: 8,
        color: "#4a4a4a",
    },
    // Основной текст, параграфы
    paragraph: {
        fontSize: 12,
        marginVertical: 4,
        lineHeight: 1.4,
        textAlign: "justify",
        color: "#4a4a4a",
    },
    // Секция с модулем внутри дисциплины
    moduleBlock: {
        marginVertical: 10,
        paddingLeft: 10,
        borderLeft: "3pt solid #908269",
    },
    // Название модуля, если нужно выделить его
    moduleTitle: {
        fontSize: 15,
        fontWeight: "600",
        marginBottom: 4,
        color: "#908269",
    },
    // Изображения – задаём относительную ширину и центрирование
    image: {
        width: "80%",
        marginVertical: 10,
        alignSelf: "center",
        borderRadius: 4,
    },
    // Стили для файлов
    file: {
        fontSize: 10,
        color: "#908269",
        textDecoration: "underline",
        marginVertical: 4,
    },
});


// Преобразование ссылки на изображение в base64
const imageToBase64 = async (url) => {
    try {
        const response = await fetch(url, { mode: "cors" });
        if (!response.ok) {
            console.error("Ошибка загрузки изображения, статус:", response.status, url);
            return null;
        }
        const blob = await response.blob();
        return await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    } catch (e) {
        console.error("Ошибка загрузки изображения:", url, e);
        return null;
    }
};


// Обработка одного модуля и конвертация картинок
const prepareModule = async (mod) => {
    // Если content не массив или пустой – возвращаем модуль как есть
    if (!Array.isArray(mod.content)) return mod;
    const newContent = await Promise.all(mod.content.map(async (item) => {
        if (item.type === "image" && item.value) {
            const base64 = await imageToBase64(item.value);
            if (base64) {
                return { ...item, value: base64 };
            }
        }
        return item;
    }));
    return { ...mod, content: newContent };
};

const PDFContent = ({ studyplan, disciplines, modulesByDiscipline }) => (
    <Document>
        <Page size="A4" style={styles.page}>
            <Text style={styles.title}>{studyplan?.title}</Text>
            <Text style={styles.paragraph}>{studyplan?.description}</Text>
            <Text style={styles.paragraph}>Курс: {studyplan?.courseNumber}</Text>

            {disciplines.map((discipline) => (
                <View key={discipline.id} style={styles.disciplineBlock} wrap={true}>
                    <Text style={styles.header}>{discipline.title}</Text>
                    <Text style={styles.paragraph}>{discipline.description}</Text>

                    {(modulesByDiscipline[discipline.id] || []).map((mod) => (
                        <View key={mod.id} style={styles.moduleBlock} wrap={true}>
                            <Text style={styles.moduleTitle}>{mod.title}</Text>
                            {mod.content?.map((item, idx) => {
                                switch (item.type) {
                                    case "header":
                                        return <Text key={idx} style={styles.subheader}>{item.value}</Text>;
                                    case "text":
                                        return <Text key={idx} style={styles.paragraph}>{item.value}</Text>;
                                    case "image":
                                        return <Image key={idx} src={item.value} style={styles.image} />;
                                    case "file":
                                        return (
                                            <Link key={idx} src={item.value} style={styles.file}>
                                                Файл: {decodeURIComponent(item.value.split("/").pop())}
                                            </Link>
                                        );
                                    default:
                                        return null;
                                }
                            })}
                        </View>
                    ))}
                </View>
            ))}
        </Page>
    </Document>
);


const PDFExportStudyplan = ({id, className}) => {
    const { studyplans } = useStudyplans();
    const { disciplines } = useStudyplansDisciplines(id);
    const [modulesByDiscipline, setModulesByDiscipline] = useState({});
    const [loading, setLoading] = useState(true);

    const studyplan = studyplans.find((mod) => mod.id === Number(id));

    useEffect(() => {
        const fetchAndPrepareModules = async () => {
            const result = {};
            for (const disc of disciplines) {
                try {
                    const res = await fetch(`${API_URL}/disciplines/${disc.id}/modules`);
                    const data = await res.json();
                    // Преобразуем каждый модуль
                    const prepared = await Promise.all(data.map(prepareModule));
                    result[disc.id] = prepared;
                } catch (e) {
                    console.error("Ошибка при загрузке модулей для дисциплины", disc.id, e);
                    result[disc.id] = [];
                }
            }
            setModulesByDiscipline(result);
            setLoading(false);
        };

        if (disciplines.length) {
            fetchAndPrepareModules();
        }
    }, [disciplines]);

    const fileName = `${studyplan?.title}.pdf`

    if (loading || !studyplan) return <p>Генерация PDF...</p>;

    return (
        <PDFDownloadLink
            document={
                <PDFContent
                    studyplan={studyplan}
                    disciplines={disciplines}
                    modulesByDiscipline={modulesByDiscipline}
                />
            }
            className={className}
            fileName={fileName}
        >
            {({ loading }) =>
                loading ? "Генерация PDF..." : "Скачать в PDF"
            }
        </PDFDownloadLink>
    );
};

export default PDFExportStudyplan;
