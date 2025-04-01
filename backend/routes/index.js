const express = require("express");
const router = express.Router();

const { router: userRouter } = require("./users");

router.use("/disciplines", require("./disciplines"));
router.use("/modules", require("./modules"));
router.use("/discipline-modules", require("./disciplineModules"));
router.use("/topics", require("./topics"));
router.use("/studyplans", require("./studyplans"));
router.use("/studyplan-disciplines", require("./studyplanDisciplines"));
router.use("/upload", require("./upload"));
router.use("/users", userRouter);
router.use("/user-disciplines", require("./userDisciplines"));
router.use("/user-studyplans", require("./userStudyplans"));
router.use("/user-modules", require("./userModules"))


module.exports = router;
