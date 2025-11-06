// routes/auth.js
import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../db.js";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

const generateToken = () => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

// Register
router.post("/register", async (req, res) => {
  try {
    const { firstName, lastName, roll, email, password, confirmPassword, passwordHint } = req.body;
    if (!firstName || !lastName || !roll || !email || !password || !confirmPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }
    const [existing] = await pool.query("SELECT id FROM users WHERE email = ?", [email]);
    if (existing.length > 0) return res.status(400).json({ message: "Email already registered" });
    const hashed = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      `INSERT INTO users (first_name, last_name, roll, email, password, password_hint, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [firstName, lastName, roll, email, hashed, passwordHint || null, 0]
    );
    const activationToken = generateToken();
    await pool.query("UPDATE users SET activation_token = ? WHERE id = ?", [activationToken, result.insertId]);
    console.log(`[DEV] Activation: http://localhost:5173/activate?token=${activationToken}`);
    return res.status(201).json({ message: "Registration successful. Check email to activate." });
  } catch (err) {
    console.error("Registration Error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

// Activate Account
router.get("/activate", async (req, res) => {
  const { token } = req.query;
  if (!token) return res.status(400).json({ message: "Activation token required" });
  try {
    const [rows] = await pool.query("SELECT id FROM users WHERE activation_token = ? AND status = 0", [token]);
    if (rows.length === 0) return res.status(400).json({ message: "Invalid or expired token" });
    await pool.query("UPDATE users SET status = 1, activation_token = NULL WHERE id = ?", [rows[0].id]);
    res.send(`
      <div style="font-family: Arial; text-align: center; padding: 40px;">
        <h1 style="color: #0d6efd;">✅ Account Activated!</h1>
        <p>Your account is now active.</p>
        <a href="http://localhost:5173/login" style="display: inline-block; margin-top: 20px; padding: 12px 24px; background: #0d6efd; color: white; text-decoration: none; border-radius: 8px;">Go to Login</a>
      </div>
    `);
  } catch (err) {
    console.error("Activation Error:", err);
    res.status(500).send("Server Error");
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Email and password required" });
    const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
    if (rows.length === 0) return res.status(400).json({ message: "Invalid credentials" });
    const user = rows[0];
    if (user.locked_until && new Date() < new Date(user.locked_until)) {
      return res.status(403).json({ message: `Account locked. Try again after ${new Date(user.locked_until).toLocaleString()}` });
    }
    if (user.status !== 1) return res.status(403).json({ message: "Account not activated. Check your email." });
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      let newAttempts = user.failed_attempts + 1;
      let lockUntil = null;
      if (newAttempts >= 3) {
        lockUntil = new Date(Date.now() + 15 * 60 * 1000);
        newAttempts = 0;
      }
      await pool.query("UPDATE users SET failed_attempts = ?, locked_until = ? WHERE id = ?", [newAttempts, lockUntil, user.id]);
      return res.status(400).json({
        message: newAttempts >= 3 
          ? "Too many failed attempts. Account locked for 15 minutes." 
          : `Invalid credentials. ${3 - newAttempts} attempts left.`
      });
    }
    await pool.query("UPDATE users SET failed_attempts = 0, locked_until = NULL WHERE id = ?", [user.id]);
    const token = jwt.sign({ id: user.id, email: user.email, role: user.roll }, process.env.JWT_SECRET, { expiresIn: "1d" });
    return res.json({
      token,
      user: { id: user.id, firstName: user.first_name, lastName: user.last_name, email: user.email, role: user.roll }
    });
  } catch (err) {
    console.error("Login Error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

// Forgot Password
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email required" });
  try {
    const [rows] = await pool.query("SELECT id FROM users WHERE email = ? AND status = 1", [email]);
    const resetToken = generateToken();
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000);
    if (rows.length > 0) {
      await pool.query("UPDATE users SET reset_token = ?, reset_expires = ? WHERE id = ?", [resetToken, expiresAt, rows[0].id]);
    }
    console.log(`[DEV] Reset: http://localhost:5173/reset-password?token=${resetToken}`);
    res.json({ message: "If an account exists, a reset link has been sent." });
  } catch (err) {
    console.error("Forgot Password Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Reset Password
router.post("/reset-password", async (req, res) => {
  const { token, newPassword, confirmPassword } = req.body;
  if (!token || !newPassword || !confirmPassword) return res.status(400).json({ message: "All fields required" });
  if (newPassword !== confirmPassword) return res.status(400).json({ message: "Passwords do not match" });
  try {
    const [rows] = await pool.query("SELECT id FROM users WHERE reset_token = ? AND reset_expires > NOW()", [token]);
    if (rows.length === 0) return res.status(400).json({ message: "Invalid or expired reset token" });
    const hashed = await bcrypt.hash(newPassword, 10);
    await pool.query("UPDATE users SET password = ?, reset_token = NULL, reset_expires = NULL WHERE id = ?", [hashed, rows[0].id]);
    res.json({ message: "Password reset successfully. You can now log in." });
  } catch (err) {
    console.error("Reset Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;