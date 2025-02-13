const express = require("express");
const router = express.Router();
const { Module, Topic } = require("../models");

// Получить все модули
router.get("/", async (req, res) => {
    const modules = await Module.findAll();
    res.json(modules);
});

// Получить модуль по ID
router.get("/:id", async (req, res) => {
    const module = await Module.findByPk(req.params.id);
    module ? res.json(module) : res.status(404).json({ error: "Модуль не найден" });
});

// Создать новый модуль
router.post("/", async (req, res) => {
    const newModule = await Module.create(req.body);
    res.status(201).json(newModule);
});

// Обновить модуль
router.put("/:id", async (req, res) => {
    const module = await Module.findByPk(req.params.id);
    if (!module) return res.status(404).json({ error: "Модуль не найден" });

    await module.update(req.body);
    res.json({ message: "Модуль обновлен" });
});

// Частичное обновление модуля (заголовок, описание, контент и т. д.)
router.patch("/:id", async (req, res) => {
    try {
        const module = await Module.findByPk(req.params.id);
        if (!module) return res.status(404).json({ error: "Модуль не найден" });

        // Обновляем только переданные поля
        const { title, description, content } = req.body;
        if (title !== undefined) module.title = title;
        if (description !== undefined) module.description = description;
        if (content !== undefined) module.content = content;

        await module.save();
        res.json({ message: "Модуль обновлён", module });
    } catch (err) {
        res.status(500).json({ error: "Ошибка сервера" });
    }
});

// Удалить модуль
router.delete("/:id", async (req, res) => {
    const module = await Module.findByPk(req.params.id);
    if (!module) return res.status(404).json({ error: "Модуль не найден" });

    await module.destroy();
    res.json({ message: "Модуль удален" });
});

// Получить тему модуля
router.get("/:moduleId/topic", async (req, res) => {
    try {
        const module = await Module.findByPk(req.params.moduleId, { include: Topic });
        if (!module) return res.status(404).json({ error: "Модуль не найден" });

        res.json(module.Topic);
    } catch (err) {
        res.status(500).json({ error: "Ошибка сервера" });
    }
});

// Добавить тему к модулю
router.post("/:moduleId/topic/:topicId", async (req, res) => {
    try {
        const module = await Module.findByPk(req.params.moduleId);
        const topic = await Topic.findByPk(req.params.topicId);

        if (!module || !topic) return res.status(404).json({ error: "Модуль или тема не найдены" });

        module.topicId = topic.id;
        await module.save();

        res.json({ message: "Тема присвоена модулю", module });
    } catch (err) {
        res.status(500).json({ error: "Ошибка сервера" });
    }
});

// Удалить тему из модуля
router.delete("/:moduleId/topic", async (req, res) => {
    try {
        const module = await Module.findByPk(req.params.moduleId);
        if (!module) return res.status(404).json({ error: "Модуль не найден" });

        module.topicId = null;
        await module.save();

        res.json({ message: "Тема удалена у модуля" });
    } catch (err) {
        res.status(500).json({ error: "Ошибка сервера" });
    }
});


module.exports = router;
