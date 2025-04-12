const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../models");
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

// Middleware проверки токена
const authMiddleware = (req, res, next) => {
    const token = req.cookies.token;
    console.log("Токен из куки на сервере: ", token);
    if (!token) return res.status(401).json({ message: "Нет доступа" });

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(403).json({ message: "Неверный токен" });
    }
};

router.get("/profile", authMiddleware,  async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, {
            attributes: ["id", "username"]
        });
        if (!user) return res.status(404).json({ message: "Пользователь не найден" });

        res.json({ user });
    } catch (err) {
        res.status(500).json({ message: "Ошибка сервера" });
    }
});

router.get("/", authMiddleware, async (req, res) => {
    try {
        // Находим всех пользователей в базе данных
        const users = await User.findAll();

        // Преобразуем список пользователей, чтобы вернуть их id и username
        const userData = users.map(user => ({
            id: user.id,
            username: user.username
        }));

        res.json({ users: userData });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Ошибка при получении данных пользователей" });
    }
});


router.get("/users/search", authMiddleware, async (req, res) => {
    try {
        const { username } = req.query; // Имя пользователя передается как параметр в query строке

        if (!username) {
            return res.status(400).json({ message: "Не указано имя пользователя для поиска" });
        }

        // Поиск пользователя в базе данных по имени
        const user = await User.findOne({ where: { username } });

        if (!user) {
            return res.status(404).json({ message: "Пользователь не найден" });
        }

        // Возвращаем ID пользователя
        res.json({ userId: user.id });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Ошибка при поиске пользователя" });
    }
});




// Регистрация
router.post("/register", async (req, res) => {
    try {
        const { username, password, login } = req.body;

        const existingUser = await User.findOne({ where: { username } });
        if (existingUser) {
            return res.status(400).json({ message: "Пользователь уже существует" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({ username, password: hashedPassword, login });

        console.log("Создан новый пользователь:", newUser);
        res.status(201).json({ message: "Пользователь зарегистрирован", user: newUser });
    } catch (error) {
        console.error("Ошибка при регистрации:", error);
        res.status(500).json({ error: error.message });
    }
});

// Логин
router.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ where: { username } });
        if (!user) return res.status(400).json({ message: "Неверные учетные данные" });

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) return res.status(400).json({ message: "Неверные учетные данные" });

        const token = jwt.sign(
            { id: user.id, username: user.username },
            JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.cookie("token", token, {
            httpOnly: true,
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
            maxAge: 60 * 60 * 1000
        });


        res.json({ user: { id: user.id, username: user.username } });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Logout
router.post("/logout", (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production"
    });
    res.json({ message: "Вы вышли из системы" });
});

module.exports = {
    router,
    authMiddleware,
};
