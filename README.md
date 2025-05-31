# 🧠 Task Scheduler Backend API

A backend system that allows users to create, manage, and get notified about tasks. Built with Node.js, Express, MySQL (via `mysql2`), raw SQL, and JWT authentication.

---

## 🔑 Features

* ✅ User Authentication (JWT-based)
* ✅ Task creation, update, and completion
* 🔁 Recurring Tasks (daily, weekly, monthly)
* 📬 Email Notifications (1 hour before due)
* 📜 Task History Tracking
* 🧠 Built with raw SQL (no ORM)
* 🔒 Protected API routes using middleware
* ⏰ Background scheduler using Cron

---

## 🚀 Tech Stack

* Node.js
* Express.js
* MySQL (`mysql2`)
* Nodemailer (email)
* JWT for auth
* Cron for background tasks

---

## 📦 Setup Instructions

1. **Clone repo**

   ```bash
   git clone https://github.com/yourusername/task-scheduler-api.git
   cd task-scheduler-api
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start MySQL and import database**

   * Open XAMPP, start Apache & MySQL
   * Import `task_db.sql` from the `db/` folder

4. **Configure `.env`**

   ```env
   DB_HOST=localhost
  DB_PORT=3306
  DB_USER=root
  DB_PASSWORD=
  DB_NAME=task_db
  JWT_SECRET=your_jwt_secret_key
  JWT_EXPIRES_IN=1d
  EMAIL_USER=
  EMAIL_PASS=
   ```

5. **Start server**

   ```bash
    nvm use 20.17.0
   npm run dev
   ```

---

## 📬 Email Notification Setup

* You must use a Gmail **App Password**
* Set in `.env`:

  ```env
  EMAIL_USER=your_email
  EMAIL_PASS=your_app_password
  ```

---

## 🔁 Recurring Task Logic

When a recurring task is marked as completed, a new one is created with the next due date automatically.

---

## 📮 API Endpoints

| Method | Endpoint                | Description            |
| ------ | ----------------------- | ---------------------- |
| POST   | /api/auth/register      | Register user          |
| POST   | /api/auth/login         | Login and get JWT      |
| POST   | /api/tasks/create        | Create task            |
| GET    | /api/tasks               | Get all task |
| GET    | /api/tasks/complete?TaskId={value} | Mark task as completed |
| POST  | /api/tasks/update/\:id   | Update task details    |
| GET    | /api/task/\:id/history  | View task history      |

🔐 Protected routes require:

```
Authorization: Bearer <your_token>
```


---

## 👨‍💼 Author

Made by Meshv Patel for interview round 🚀
