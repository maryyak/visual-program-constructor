const express = require("express");
const router = express.Router();
const { Studyplan, Discipline, StudyplanDisciplines} = require("../models");
const {Sequelize} = require("sequelize");

// Получить все учебные планы с дисциплинами
router.get("/", async (req, res) => {
    try {
        const studyplans = await Studyplan.findAll();
        res.json(studyplans);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Создать новый учебный план
router.post("/", async (req, res) => {
    try {
        const { title, description, courseNumber } = req.body;
        const studyplan = await Studyplan.create({ title, description, courseNumber });
        res.status(201).json(studyplan);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get("/:id", async (req, res) => {
    const studyplan = await Studyplan.findByPk(req.params.id);
    if (!studyplan) return res.status(404).json({ error: "Учебный план не найден" });
    res.json(studyplan);
});

// Обновить учебный план
router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, courseNumber } = req.body;
        await Studyplan.update({ title, description, courseNumber }, { where: { id } });
        res.json({ message: "Учебный план обновлён" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Удалить учебный план
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        await Studyplan.destroy({ where: { id } });
        res.json({ message: "Учебный план удалён" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get("/:id/disciplines", async (req, res) => {
    try {
        const { id } = req.params;

        const studyplan = await Studyplan.findByPk(req.params.id);
        if (!studyplan) return res.status(404).json({ error: "Учебный план не найден" });

        const disciplines = await Discipline.findAll({
            include: {
                model: Studyplan,
                through: { attributes: [] }, // Не включаем лишние данные из связи
                where: { id },
            },
            order: [[Sequelize.col('Studyplans->StudyplanDisciplines.order'), 'ASC']]
        });

        res.json(disciplines);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Ошибка сервера" });
    }
});

// Добавить дисциплину в учебный план
router.post("/:id/disciplines", async (req, res) => {
    try {
        const { id } = req.params;
        const { disciplineId, order } = req.body;
        const studyplan = await Studyplan.findByPk(id);
        if (!studyplan) return res.status(404).json({ error: "Учебный план не найден" });

        const discipline = await Discipline.findByPk(disciplineId);
        if (!discipline) return res.status(404).json({ error: "Дисциплина не найдена" });

        const newEntry = await StudyplanDisciplines.create({ studyplanId: id, disciplineId, order });
        res.status(201).json(newEntry);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Обновить порядок дисциплины в учебном плане
router.put("/:id/disciplines/:disciplineId", async (req, res) => {
    try {
        const { id, disciplineId } = req.params;
        const { order } = req.body;
        const updated = await StudyplanDisciplines.update(
            { order },
            { where: { studyplanId: id, disciplineId } }
        );
        if (updated[0] === 0) return res.status(404).json({ error: "Дисциплина не найдена в учебном плане" });
        res.json({ message: "Порядок дисциплины обновлён" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Удалить дисциплину из учебного плана
router.delete("/:id/disciplines/:disciplineId", async (req, res) => {
    try {
        const { id, disciplineId } = req.params;
        const deleted = await StudyplanDisciplines.destroy({ where: { studyplanId: id, disciplineId } });
        if (!deleted) return res.status(404).json({ error: "Дисциплина не найдена в учебном плане" });
        res.json({ message: "Дисциплина удалена из учебного плана" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
