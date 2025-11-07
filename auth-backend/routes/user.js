import express from "express";
import pool from "../db.js";
import verifyToken from "../middleware/auth.js";

const router = express.Router();

router.get("/profile", verifyToken, async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT id, first_name, last_name, email, roll FROM users WHERE id = ?", [req.user.id]);
    if (rows.length === 0) return res.status(404).json({ message: "User not found" });
    const u = rows[0];
    return res.json({
      id: u.id,
      firstName: u.first_name,
      lastName: u.last_name,
      email: u.email,
      role: u.roll
    });
  } catch (err) {
    console.error("Profile Error:", err);
    res.status(500).json({ message: "Failed to load profile" });
  }
});

export default router;