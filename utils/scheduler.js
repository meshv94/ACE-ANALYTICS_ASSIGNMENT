const cron = require("node-cron");
const db = require("../db");
const sendEmail = require("./sendEmail");

const scheduleTaskChecker = () => {
    // Run every 15 minute
    cron.schedule("*/15 * * * *", async () => {
        console.log("---- cron is running ------------ Checking for tasks due in 1 hour...");

        const now = new Date();
        const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);

        try {
            const tasks = await db.query(
                `SELECT tasks.*, users.email 
                FROM tasks 
                JOIN users ON tasks.user_id = users.id 
                WHERE tasks.due_date BETWEEN ? AND ? AND tasks.status = 'pending'`,
                [now, oneHourLater]
            );

            console.log('-------- Tasks are found', tasks.length)

            for (const task of tasks) {
                const subject = `⏰ Reminder: Task "${task.title}" is due soon`;
                const message = `Your task "${task.title}" is due at ${task.due_date}. Don't forget to complete it!`;
                await sendEmail.sendEmailReminders(task.email, subject, message);
            }
        } catch (err) {
            console.error("Error checking tasks:", err.message);
        }
    });
};

module.exports = scheduleTaskChecker;
