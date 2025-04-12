const express = require("express");
const { UserDisciplines, Discipline, DisciplineModules, UserModules} = require("../models");
const { authMiddleware } = require("../routes/users");
const router = express.Router();

//Получить список дисциплин, привязанных к пользователю
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

// Привязать пользователя к дисциплине
router.post("/:disciplineId", authMiddleware, async (req, res) => {
    try {
        const { disciplineId } = req.params;
        const {userId} = req.body;

        const existingEntry = await UserDisciplines.findOne({
            where: { userId, disciplineId }
        });

        if (existingEntry) {
            return res.status(400).json({ error: "Пользователь уже привязан к этой дисциплине" });
        }
        const newEntry = await UserDisciplines.create({ userId, disciplineId });

        const disciplineModules = await DisciplineModules.findAll({
            where: { disciplineId }
        })

        for (const module of disciplineModules) {
            const moduleId = module.moduleId;

            // Привязка пользователя к модулю
            const existingModuleEntry = await UserModules.findOne({
                where: { userId, moduleId }
            });

            if (!existingModuleEntry) {
                await UserModules.create({ userId, moduleId });
            }
        }

        res.status(201).json(newEntry);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Отвязать пользователя от дисциплины
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
