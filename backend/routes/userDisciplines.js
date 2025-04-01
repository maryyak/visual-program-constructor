const express = require("express");
const { UserDisciplines, Discipline } = require("../models");
const { authMiddleware } = require("../routes/users");
const router = express.Router();

// 📌 Получить список дисциплин, привязанных к пользователю
router.get("/", authMiddleware, async (req, res) => {
    try {
        const userDisciplines = await UserDisciplines.findAll({
            where: { userId: req.user.id },
            include: [{ model: Discipline }],
        });

        res.json(userDisciplines.map(entry => entry.Discipline));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 📌 Привязать пользователя к дисциплине
router.post("/:disciplineId", authMiddleware, async (req, res) => {
    try {
        const { disciplineId } = req.params;

        const existingEntry = await UserDisciplines.findOne({
            where: { userId: req.user.id, disciplineId }
        });

        if (existingEntry) {
            return res.status(400).json({ error: "Пользователь уже привязан к этой дисциплине" });
        }
        const newEntry = await UserDisciplines.create({ userId: req.user.id, disciplineId });

        res.status(201).json(newEntry);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 📌 Отвязать пользователя от дисциплины
router.delete("/:disciplineId", authMiddleware, async (req, res) => {
    try {
        const { disciplineId } = req.params;

        const deleted = await UserDisciplines.destroy({
            where: { userId: req.user.id, disciplineId }
        });

        if (!deleted) {
            return res.status(404).json({ error: "Привязка не найдена" });
        }

        res.json({ message: "Пользователь отвязан от дисциплины" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
