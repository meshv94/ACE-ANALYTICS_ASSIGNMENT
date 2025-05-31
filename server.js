require("dotenv").config();
const express = require("express");
const app = express();

const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");
const logger = require("./middleware/logger");

app.use(logger); // logging middleware


const db = require("./db");

db.query("SELECT 1").then(() => {
    console.log("MySQL connected!");
}).catch((err) => {
    console.error("MySQL connection failed:", err);
});


app.use(express.json());
app.use(express.urlencoded({ extended : true}))

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
