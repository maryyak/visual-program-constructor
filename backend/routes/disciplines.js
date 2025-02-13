const express = require("express");
const { Discipline, Module, DisciplineModules } = require("../models");
const router = express.Router();

router.get("/", async (req, res) => {
    const disciplines = await Discipline.findAll();
    res.json(disciplines);
});

router.post("/", async (req, res) => {
    const discipline = await Discipline.create(req.body);
    res.status(201).json(discipline);
});

router.get("/:id", async (req, res) => {
    const discipline = await Discipline.findByPk(req.params.id);
    if (!discipline) return res.status(404).json({ error: "Дисциплина не найдена" });
    res.json(discipline);
});

router.put("/:id", async (req, res) => {
    await Discipline.update(req.body, { where: { id: req.params.id } });
    res.json({ message: "Дисциплина обновлена" });
});

router.delete("/:id", async (req, res) => {
    await Discipline.destroy({ where: { id: req.params.id } });
    res.json({ message: "Дисциплина удалена" });
});

// Получить все модули, связанные с дисциплиной
router.get("/:id/modules", async (req, res) => {
    try {
        const { id } = req.params;

        // Найти дисциплину
        const discipline = await Discipline.findByPk(id);
        if (!discipline) {
            return res.status(404).json({ error: "Дисциплина не найдена" });
        }

        // Найти модули, связанные с дисциплиной через DisciplineModules
        const modules = await Module.findAll({
            include: {
                model: Discipline,
                through: { attributes: [] }, // Не включаем лишние данные из связи
                where: { id },
            },
        });

        res.json(modules);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Ошибка сервера" });
    }
});

// 📌 Добавить модуль в дисциплину
router.post("/:disciplineId/modules", async (req, res) => {
    try {
        const { disciplineId } = req.params;
        const { moduleId, order } = req.body; // Порядок модуля в дисциплине

        const discipline = await Discipline.findByPk(disciplineId);
        const moduleItem = await Module.findByPk(moduleId);

        if (!discipline || !moduleItem) {
            return res.status(404).json({ error: "Discipline or Module not found" });
        }

        const newEntry = await DisciplineModules.create({
            disciplineId,
            moduleId,
            order,
        });

        res.status(201).json(newEntry);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 📌 Обновить порядок модуля в дисциплине
router.put("/:disciplineId/modules/:moduleId", async (req, res) => {
    try {
        const { disciplineId, moduleId } = req.params;
        const { order } = req.body; // Новый порядок

        const updated = await DisciplineModules.update(
            { order },
            { where: { disciplineId, moduleId } }
        );

        if (updated[0] === 0) {
            return res.status(404).json({ error: "Module not found in this discipline" });
        }

        res.json({ message: "Module order updated successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 📌 Удалить модуль из дисциплины
router.delete("/:disciplineId/modules/:moduleId", async (req, res) => {
    try {
        const { disciplineId, moduleId } = req.params;

        const deleted = await DisciplineModules.destroy({
            where: { disciplineId, moduleId },
        });

        if (!deleted) {
            return res.status(404).json({ error: "Module not found in this discipline" });
        }

        res.json({ message: "Module removed from discipline successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Получить все группы, связанные с дисциплиной
router.get("/:id/groups", async (req, res) => {
    try {
        const { id } = req.params;

        // Найти дисциплину
        const discipline = await Discipline.findByPk(id);
        if (!discipline) {
            return res.status(404).json({ error: "Дисциплина не найдена" });
        }

        // Найти модули, связанные с дисциплиной через DisciplineModules
        const modules = await Module.findAll({
            include: {
                model: Discipline,
                through: { attributes: [] }, // Не включаем лишние данные из связи
                where: { id },
            },
        });

        res.json(modules);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Ошибка сервера" });
    }
});

// 📌 Добавить группу в дисциплину
router.post("/:disciplineId/modules", async (req, res) => {
    try {
        const { disciplineId } = req.params;
        const { moduleId, order } = req.body; // Порядок модуля в дисциплине

        const discipline = await Discipline.findByPk(disciplineId);
        const moduleItem = await Module.findByPk(moduleId);

        if (!discipline || !moduleItem) {
            return res.status(404).json({ error: "Discipline or Module not found" });
        }

        const newEntry = await DisciplineModules.create({
            disciplineId,
            moduleId,
            order,
        });

        res.status(201).json(newEntry);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 📌 Обновить порядок групп в дисциплине
router.put("/:disciplineId/modules/:moduleId", async (req, res) => {
    try {
        const { disciplineId, moduleId } = req.params;
        const { order } = req.body; // Новый порядок

        const updated = await DisciplineModules.update(
            { order },
            { where: { disciplineId, moduleId } }
        );

        if (updated[0] === 0) {
            return res.status(404).json({ error: "Module not found in this discipline" });
        }

        res.json({ message: "Module order updated successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 📌 Удалить группу из дисциплины
router.delete("/:disciplineId/modules/:moduleId", async (req, res) => {
    try {
        const { disciplineId, moduleId } = req.params;

        const deleted = await DisciplineModules.destroy({
            where: { disciplineId, moduleId },
        });

        if (!deleted) {
            return res.status(404).json({ error: "Module not found in this discipline" });
        }

        res.json({ message: "Module removed from discipline successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
