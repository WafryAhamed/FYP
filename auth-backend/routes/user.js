// backend/routes/user.js
import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { pool } from '../db.js';

const router = express.Router();

// Get user profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, first_name, last_name, email, roll FROM users WHERE id=?', [req.user.id]);
    if (!rows[0]) return res.status(404).json({ message: 'User not found' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
