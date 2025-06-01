
# 🧠 Task Scheduler Backend API

A backend system that allows users to create, manage, and get notified about tasks. Built with **Node.js**, **Express**, **MySQL** (via `mysql2`), **raw SQL**, and **JWT authentication**.

---

## 🔑 Features

* ✅ JWT-based User Authentication
* ✅ Create, Update, and Mark Tasks as Completed
* 🔁 Recurring Tasks (Daily, Weekly, Monthly)
* 📬 Email Notifications (1 hour before task due time)
* 📜 Task History Tracking
* 🧠 Uses **raw SQL** (No ORM like Sequelize or Prisma)
* 🔒 Middleware-Protected Routes
* ⏰ Background Job Scheduling using **Cron**

---

## 🚀 Tech Stack

* **Node.js**
* **Express.js**
* **MySQL** (`mysql2`)
* **Nodemailer** (for emails)
* **JWT** (for auth)
* **node-cron** (for scheduling)

---

## 📦 Setup Instructions

### 1. **Install Dependencies**

```bash
npm install
```

### 2. **Start MySQL & Import Database**

* Open **XAMPP**
* Start **Apache** & **MySQL**
* Import the `task_db.sql` file from the `db/` directory into **phpMyAdmin**

### 3. **Configure Environment Variables**

Create a `.env` file in the root folder:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=task_db

JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=1d

EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password
```

> 🔐 Use a [Gmail App Password](https://support.google.com/mail/answer/185833?hl=en) instead of your actual password

### 4. **Start Development Server**

```bash
nvm use 20.17.0
npm run dev
```

---

## 📮 Email Notification Setup

* Uses **Nodemailer** to send reminders 1 hour before a task's due date
* Email credentials must be set in `.env` as shown above

---

## 🔁 Recurring Task Logic

When a **recurring task** is marked as completed, a new task is automatically created with the next calculated due date based on the recurrence type:

* `daily` → next day
* `weekly` → same time next week
* `monthly` → same time next month

---

## 📮 API Endpoints

| Method | Endpoint                          | Description            |
| ------ | --------------------------------- | ---------------------- |
| POST   | `/api/auth/register`              | Register a new user    |
| POST   | `/api/auth/verify-otp`            | verify otp             |
| POST   | `/api/auth/login`                 | Login and receive JWT  |
| POST   | `/api/tasks/create`               | Create a new task      |
| GET    | `/api/tasks`                      | Get all tasks for user |
| GET    | `/api/tasks/complete?TaskId={id}` | Mark task as completed |
| POST   | `/api/tasks/update/:id`           | Update a task          |
| GET    | `/api/task/:id/history`           | Get task history       |

> 🔐 **All task routes are protected**
> Use the following header:

```http
Authorization: Bearer <your_jwt_token>
```

---

## 👨‍💼 Author

Built by **Meshv Patel** for a backend engineering interview round 🚀

📧 Email: [meshv1444@gmail.com](mailto:meshv1444@gmail.com)

---
