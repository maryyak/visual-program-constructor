const express = require("express");
const { StudyplanDisciplines } = require("../models");
const router = express.Router();

router.post("/", async (req, res) => {
    const entry = await StudyplanDisciplines.create(req.body);
    res.status(201).json(entry);
});

router.delete("/:id", async (req, res) => {
    await StudyplanDisciplines.destroy({ where: { id: req.params.id } });
    res.json({ message: "Связь удалена" });
});

module.exports = router;
