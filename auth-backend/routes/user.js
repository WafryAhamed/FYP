// routes/user.js
import express from "express";
import pool from "../db.js";
import verifyToken from "../middleware/auth.js";

const router = express.Router();

// GET /api/user/profile
router.get("/profile", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const [rows] = await pool.query("SELECT id, first_name, last_name, email, roll FROM users WHERE id = ?", [userId]);
    if (rows.length === 0) return res.status(404).json({ message: "User not found" });
    const user = rows[0];
    return res.json({
      id: user.id,
      firstName: user.first_name,
      lastName: user.last_name,
      email: user.email,
      role: user.roll
    });
  } catch (err) {
    console.error("Profile Error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

export default router;