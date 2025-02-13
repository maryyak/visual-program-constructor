const express = require("express");
const router = express.Router();
const { Topic, Module } = require("../models");

// Получить все темы
router.get("/", async (req, res) => {
    const topics = await Topic.findAll({ include: Module });
    res.json(topics);
});

// Получить тему по ID
router.get("/:id", async (req, res) => {
    const topic = await Topic.findByPk(req.params.id, { include: Module });
    if (!topic) return res.status(404).json({ error: "Тема не найдена" });
    res.json(topic);
});

// Создать тему
router.post("/", async (req, res) => {
    try {
        const newTopic = await Topic.create({ title: req.body.title });
        res.status(201).json(newTopic);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Удалить тему
router.delete("/:id", async (req, res) => {
    const topic = await Topic.findByPk(req.params.id);
    if (!topic) return res.status(404).json({ error: "Тема не найдена" });

    await topic.destroy();
    res.json({ message: "Тема удалена" });
});

// Получить все модули, входящие в тему
router.get("/:id/modules", async (req, res) => {
    try {
        const topic = await Topic.findByPk(req.params.id, { include: Module });
        if (!topic) return res.status(404).json({ error: "Тема не найдена" });

        res.json(topic.Modules);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Ошибка сервера" });
    }
});


module.exports = router;
