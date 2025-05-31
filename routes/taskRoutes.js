const express = require("express");
const router = express.Router();
const {
    createTask,
    getTasks,
    completeTask,
} = require("../controllers/taskController");

const verifyToken = require("../middleware/authMiddleware");

router.use(verifyToken); // protect all routes

router.post("/", createTask);
router.get("/", getTasks);
router.patch("/:id/complete", completeTask);

module.exports = router;
