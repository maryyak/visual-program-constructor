const express = require("express");
const { UserModules, Module, User } = require("../models");
const { authMiddleware } = require("../routes/users");
const router = express.Router();

//Получить список модулей, привязанных к пользователю
router.get("/", authMiddleware, async (req, res) => {
    try {
        const userModules = await UserModules.findAll({
            where: { userId: req.user.id },
            include: [{ model: Module }],
        });

        res.json(userModules.map(entry => entry.Module));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get("/:moduleId", async (req, res) => {
    try {
        const { moduleId } = req.params;

        const moduleUsers = await UserModules.findAll({
            where: { moduleId: moduleId },
            include: [{ model: User }],
        });

        res.json(moduleUsers.map(entry => entry.User));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//Привязать текущего пользователя к модулю
router.post("/:moduleId", authMiddleware, async (req, res) => {
    try {
        const { moduleId } = req.params;
        const userId = req.user.id;

        const existingEntry = await UserModules.findOne({
            where: { userId, moduleId }
        });

        if (existingEntry) {
            return res.status(400).json({ error: "Пользователь уже привязан к этому модулю" });
        }

        const newEntry = await UserModules.create({ userId, moduleId });

        res.status(201).json(newEntry);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//Привязать другого пользователя к модулю
router.post("/:moduleId/user/:userId", authMiddleware, async (req, res) => {
    try {
        const { moduleId, userId } = req.params;

        const existingEntry = await UserModules.findOne({
            where: { userId, moduleId }
        });

        if (existingEntry) {
            return res.status(400).json({ error: "Пользователь уже привязан к этому модулю" });
        }

        const newEntry = await UserModules.create({ userId, moduleId });

        res.status(201).json(newEntry);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Отвязать пользователя от модуля
router.delete("/:moduleId", authMiddleware, async (req, res) => {
    try {
        const { moduleId } = req.params;

        const deleted = await UserModules.destroy({
            where: { userId: req.user.id, moduleId }
        });

        if (!deleted) {
            return res.status(404).json({ error: "Привязка не найдена" });
        }

        res.json({ message: "Пользователь отвязан от модуля" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
