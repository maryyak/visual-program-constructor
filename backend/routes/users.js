const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../models");
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

router.post("/register", async (req, res) => {
    try {
        const { username, password, login } = req.body;

        // Проверяем, существует ли пользователь
        const existingUser = await User.findOne({ where: { username } });
        if (existingUser) {
            return res.status(400).json({ message: "Пользователь уже существует" });
        }

        // Хешируем пароль
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({ username, password: hashedPassword, login });

        console.log("Создан новый пользователь:", newUser);  // Логируем созданного пользователя

        res.status(201).json({ message: "Пользователь зарегистрирован", user: newUser });
    } catch (error) {
        console.error("Ошибка при регистрации:", error);  // Логируем ошибку
        res.status(500).json({ error: error.message });
    }
});

//Логин пользователя
router.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;

        // Проверяем пользователя
        const user = await User.findOne({ where: { username } });
        if (!user) return res.status(400).json({ message: "Неверные учетные данные" });

        // Проверяем пароль
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) return res.status(400).json({ message: "Неверные учетные данные" });

        // Генерируем токен
        const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: "1h" });

        res.json({ token, user: { id: user.id, username: user.username } });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//Middleware для проверки токена
const authMiddleware = (req, res, next) => {
    const token = req.header("Authorization")?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Нет доступа" });

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(403).json({ message: "Неверный токен" });
    }
};

module.exports = {
    router,
    authMiddleware,
};

