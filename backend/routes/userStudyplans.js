const express = require("express");
const { UserStudyplans, Studyplan } = require("../models");
const { authMiddleware } = require("../routes/users");
const router = express.Router();

// 📌 Получить список учебных планов, привязанных к пользователю
router.get("/", authMiddleware, async (req, res) => {
    try {
        const userStudyplans = await UserStudyplans.findAll({
            where: { userId: req.user.id },
            include: [{ model: Studyplan }],
        });

        res.json(userStudyplans.map(entry => entry.Studyplan));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 📌 Привязать пользователя к учебному плану
router.post("/:studyplanId", authMiddleware, async (req, res) => {
    try {
        const { studyplanId } = req.params;

        const existingEntry = await UserStudyplans.findOne({
            where: { userId: req.user.id, studyplanId }
        });

        if (existingEntry) {
            return res.status(400).json({ error: "Пользователь уже привязан к этому учебному плану" });
        }

        const newEntry = await UserStudyplans.create({ userId: req.user.id, studyplanId });

        res.status(201).json(newEntry);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 📌 Отвязать пользователя от учебного плана
router.delete("/:studyplanId", authMiddleware, async (req, res) => {
    try {
        const { studyplanId } = req.params;

        const deleted = await UserStudyplans.destroy({
            where: { userId: req.user.id, studyplanId }
        });

        if (!deleted) {
            return res.status(404).json({ error: "Привязка не найдена" });
        }

        res.json({ message: "Пользователь отвязан от учебного плана" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
