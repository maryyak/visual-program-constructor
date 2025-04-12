const express = require("express");
const { UserStudyplans, Studyplan, StudyplanDisciplines, DisciplineModules, UserDisciplines, UserModules } = require("../models");
const { authMiddleware } = require("../routes/users");

const router = express.Router();

// Получить список учебных планов, привязанных к пользователю
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

// Привязать пользователя к учебному плану, дисциплинам и модулям
router.post("/:studyplanId", authMiddleware, async (req, res) => {
    try {
        const { studyplanId } = req.params;
        const { userId } = req.body;

        // Привязка пользователя к учебному плану
        const existingEntry = await UserStudyplans.findOne({
            where: { userId, studyplanId }
        });

        if (existingEntry) {
            return res.status(400).json({ error: "Пользователь уже привязан к этому учебному плану" });
        }

        await UserStudyplans.create({ userId, studyplanId });

        // Получаем все дисциплины учебного плана
        const studyplanDisciplines = await StudyplanDisciplines.findAll({
            where: { studyplanId }
        });

        // Привязываем пользователя ко всем дисциплинам
        for (const discipline of studyplanDisciplines) {
            const disciplineId = discipline.disciplineId;

            // Привязка пользователя к дисциплине
            const existingDisciplineEntry = await UserDisciplines.findOne({
                where: { userId, disciplineId }
            });

            if (!existingDisciplineEntry) {
                await UserDisciplines.create({ userId, disciplineId });
            }

            // Получаем модули дисциплины
            const disciplineModules = await DisciplineModules.findAll({
                where: { disciplineId }
            });

            // Привязываем пользователя ко всем модулям дисциплины
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
        }

        res.status(201).json({ message: "Пользователь успешно привязан к учебному плану, дисциплинам и модулям" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});


// Отвязать пользователя от учебного плана
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
