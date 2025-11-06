// routes/user.js
import express from "express";
import pool from "../db.js";
import verifyToken from "../middleware/auth.js";

const router = express.Router();

// GET /api/user/profile
router.get("/profile", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const [rows] = await pool.query("SELECT id, name, email, created_at FROM users WHERE id = ?", [userId]);
    if (rows.length === 0) return res.status(404).json({ message: "User not found" });
    return res.json(rows[0]);
  } catch (err) {
    console.error("Profile Error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

export default router;
