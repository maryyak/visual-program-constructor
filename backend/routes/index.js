const express = require("express");
const router = express.Router();

router.use("/disciplines", require("./disciplines"));
router.use("/modules", require("./modules"));
router.use("/discipline-modules", require("./disciplineModules"));
router.use("/topics", require("./topics"));


module.exports = router;
