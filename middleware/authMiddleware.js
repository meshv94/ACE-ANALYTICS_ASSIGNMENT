const jwt = require("jsonwebtoken");
const db = require("../db");
require("dotenv").config();

const authMiddleware = async(req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    const [result] = await db.query('SELECT id FROM users WHERE id = ?', [userId])
    console.log(result)
    if (!result || result.length === 0) {
        return res.status(401).json({ message: "Invalid token" });
      }
    req.user = { id: decoded.userId };
    next();
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = authMiddleware;
