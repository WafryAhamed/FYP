const express = require('express');
const router = express.Router();
const pool = require('../db');
const authMiddleware = require('../middleware/auth');

// Get logged-in user profile
router.get('/profile', authMiddleware(), async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, first_name, last_name, roll, email, password_hint, created_at FROM users WHERE id = ?', [req.user.id]);
    if (!rows.length) return res.status(404).json({ message: 'User not found' });

    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update logged-in user profile
router.put('/profile', authMiddleware(), async (req, res) => {
  const { firstName, lastName, passwordHint } = req.body;

  try {
    await pool.query(
      'UPDATE users SET first_name = ?, last_name = ?, password_hint = ? WHERE id = ?',
      [firstName, lastName, passwordHint, req.user.id]
    );

    res.json({ message: 'Profile updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: get all users
router.get('/all', authMiddleware(['admin']), async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, first_name, last_name, roll, email, created_at FROM users');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
