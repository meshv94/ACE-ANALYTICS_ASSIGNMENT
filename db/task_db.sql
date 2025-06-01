CREATE DATABASE IF NOT EXISTS task_db;
USE task_db;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  is_verified BOOLEAN DEFAULT FALSE,
  otp VARCHAR(10),
  otp_expires DATETIME
);

CREATE TABLE IF NOT EXISTS tasks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  title VARCHAR(255),
  description TEXT,
  due_date DATETIME NOT NULL,
  priority ENUM('low', 'medium', 'high'),
  status ENUM('pending', 'completed') DEFAULT 'pending',
  recurrence ENUM('none', 'daily', 'weekly', 'monthly') DEFAULT 'none',
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS task_history (
  id INT AUTO_INCREMENT PRIMARY KEY,
  task_id INT NOT NULL,
  old_status ENUM('pending', 'completed'),
  new_status ENUM('pending', 'completed'),
  changed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS notifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  task_id INT,
  user_id INT,
  sent_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  type VARCHAR(50),
  FOREIGN KEY (task_id) REFERENCES tasks(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

ALTER TABLE users
ADD COLUMN is_verified BOOLEAN DEFAULT FALSE,
ADD COLUMN otp VARCHAR(6),
ADD COLUMN otp_expires DATETIME;

ALTER TABLE tasks 
MODIFY recurrence ENUM('none', 'daily', 'weekly', 'monthly', 'yearly') DEFAULT 'none';
