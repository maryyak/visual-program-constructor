require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: "http://localhost:3000", // точный адрес фронта
    credentials: true                // разрешаем куки
}));
app.use(express.json());
app.use(cookieParser());

// Тестовый маршрут
app.get("/", (req, res) => {
    res.send("Сервер работает!");
});

app.use("/api/upload", express.static(path.join(__dirname, "upload")));

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});

const routes = require("./routes");
app.use("/api", routes);
