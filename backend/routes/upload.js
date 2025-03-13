const express = require("express");
const multer = require("multer");
const path = require("path");

const router = express.Router();

// Настраиваем хранилище для загрузки файлов
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "upload/"); // Папка для загрузки
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Генерация уникального имени
    }
});

const upload = multer({ storage });

// Эндпоинт для загрузки файла
router.post("/", upload.single("file"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "Файл не загружен" });
    }
    res.json({ fileUrl: `/upload/${req.file.filename}` }); // Возвращаем путь к файлу
});

module.exports = router;
