const express = require("express");
const router = express.Router();

router.use("/disciplines", require("./disciplines"));
router.use("/modules", require("./modules"));
router.use("/discipline-modules", require("./disciplineModules"));
router.use("/topics", require("./topics"));
router.use("/studyplans", require("./studyplans"));
router.use("/studyplan-disciplines", require("./studyplanDisciplines"));
router.use("/upload", require("./upload"));


module.exports = router;
