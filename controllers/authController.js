const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../db");
const sendEmail = require("../utils/sendEmail");
require("dotenv").config();

// Helper to generate JWT
const generateToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || "1d",
    });
};

// Register user
exports.register = async (req, res) => {
    const { email, password } = req.body;
    try {
        // Check if user already exists
        const existingUser = await db.query("SELECT * FROM users WHERE email = ?", [email]);
        if (existingUser.length > 0) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        // Generate 6-digit OTP and expiration (10 mins)
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000);
        await db.query("INSERT INTO users (email, password,otp, otp_expires) VALUES (?, ?,?, ?)", [email, hashedPassword, otp, otpExpires]);

        // Send OTP email
        await sendEmail.sendEmailOTP(email, otp);

        res.status(201).json({ message: "OTP sent to your email. Please verify to complete registration." });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

exports.verifyOtp = async (req, res) => {
    const { email, otp } = req.body;
console.log(req.body)
    try {
        const [user] = await db.query("SELECT * FROM users WHERE email = ?", [email]);

        if (!user || user.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        const record = user;
        console.log(user)

        if (record.is_verified) {
            return res.status(400).json({ message: "User already verified" });
        }

        if (record.otp !== otp || new Date(record.otp_expires) < new Date()) {
            return res.status(400).json({ message: "Invalid or expired OTP" });
        }

        // Mark user as verified
        await db.query("UPDATE users SET is_verified = true, otp = NULL, otp_expires = NULL WHERE email = ?", [email]);

        res.status(200).json({ message: "Email verified successfully!" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

// Login user
exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const users = await db.query("SELECT * FROM users WHERE email = ?", [email]);
        const user = users[0];
        // console.log('user on login', user)

        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        if(user.is_verified === 0){
            return res.status(400).json({ message: "User is not verified" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = generateToken(user.id);
        res.status(200).json({ token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};
