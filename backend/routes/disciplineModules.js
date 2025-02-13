const express = require("express");
const { DisciplineModules } = require("../models");
const router = express.Router();

router.post("/", async (req, res) => {
    const entry = await DisciplineModules.create(req.body);
    res.status(201).json(entry);
});

router.delete("/:id", async (req, res) => {
    await DisciplineModules.destroy({ where: { id: req.params.id } });
    res.json({ message: "Связь удалена" });
});

module.exports = router;
