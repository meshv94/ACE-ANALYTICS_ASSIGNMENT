const express = require("express");
const router = express.Router();
const taskController = require("../controllers/taskController");
const authMiddleware = require("../middleware/authMiddleware");

router.use(authMiddleware);

router.post("/create", taskController.createTask); // Create
router.get("/complete", taskController.completeTask); // Complete
router.get("/", taskController.getUserTasks); // List

module.exports = router;
