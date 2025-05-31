const db = require("../db");

// CREATE TASK
exports.createTask = async (req, res) => {
  let { title, description, due_date, priority, recurrence } = req.body;
  const userId = req.user.id;

  if (!title || !due_date || !priority) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  if(recurrence !== "none" || recurrence !== "daily" || recurrence !== "weekly" || recurrence !== "monthly"){
    recurrence = "none"
  }

  try {
    await db.query(
      `INSERT INTO tasks (user_id, title, description, due_date, priority, recurrence) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [userId, title, description, due_date, priority, recurrence || "none"]
    );
    res.status(201).json({ message: "Task created successfully" });
  } catch (err) {
    console.error("Create Task Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// MARK TASK AS COMPLETED
exports.completeTask = async (req, res) => {
  const taskId = req.query.TaskId;
//   const taskId = req.params.id;
  const userId = req.user.id;

  try {
    // Get current task
    const [task] = await db.query(`SELECT * FROM tasks WHERE id = ? AND user_id = ?`, [taskId, userId]);

    if (!task) return res.status(404).json({ message: "Task not found" });

    if (task.status === "completed") {
      return res.status(400).json({ message: "Task is already completed" });
    }

    // Update status
    await db.query(`UPDATE tasks SET status = 'completed' WHERE id = ?`, [taskId]);

    // Log to task history
    await db.query(
      `INSERT INTO task_history (task_id, old_status, new_status) VALUES (?, ?, ?)`,
      [taskId, "pending", "completed"]
    );

    // Handle recurring task
    if (task.recurrence !== "none") {
      let nextDueDate = new Date(task.due_date);
      switch (task.recurrence) {
        case "daily":
          nextDueDate.setDate(nextDueDate.getDate() + 1);
          break;
        case "weekly":
          nextDueDate.setDate(nextDueDate.getDate() + 7);
          break;
        case "monthly":
          nextDueDate.setMonth(nextDueDate.getMonth() + 1);
          break;
      }

      await db.query(
        `INSERT INTO tasks (user_id, title, description, due_date, priority, status, recurrence)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          task.user_id,
          task.title,
          task.description,
          nextDueDate,
          task.priority,
          "pending",
          task.recurrence,
        ]
      );
    }

    res.status(200).json({ message: "Task marked as completed" });
  } catch (err) {
    console.error("Complete Task Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// GET ALL TASKS FOR USER
exports.getUserTasks = async (req, res) => {
  const userId = req.user.id;
  try {
    const tasks = await db.query(`SELECT * FROM tasks WHERE user_id = ?`, [userId]);
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
