const express = require('express');
const router = express.Router();
const pool = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authMiddleware = require('../middleware/auth');
require('dotenv').config();

// Helper: lockout check
const isLocked = (user) => {
  if (!user.locked_until) return false;
  return new Date(user.locked_until) > new Date();
};

// Register
router.post('/register', async (req, res) => {
  const { firstName, lastName, roll, email, password, confirmPassword, passwordHint } = req.body;

  if (!firstName || !lastName || !email || !password || !confirmPassword)
    return res.status(400).json({ message: 'All required fields must be filled' });

  if (password !== confirmPassword) return res.status(400).json({ message: 'Passwords do not match' });

  try {
    const [existing] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (existing.length) return res.status(400).json({ message: 'Email already registered' });

    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query(
      'INSERT INTO users (first_name, last_name, roll, email, password, password_hint) VALUES (?, ?, ?, ?, ?, ?)',
      [firstName, lastName, roll || 'student', email, hashedPassword, passwordHint || null]
    );

    res.status(201).json({ message: 'Registration successful' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (!rows.length) return res.status(400).json({ message: 'Invalid credentials' });

    const user = rows[0];

    if (isLocked(user)) {
      return res.status(403).json({ message: 'Account locked. Try again later.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      let failedAttempts = user.failed_attempts + 1;
      let locked_until = null;
      if (failedAttempts >= 3) {
        locked_until = new Date(Date.now() + 15 * 60 * 1000); // lock 15 mins
        failedAttempts = 0;
      }

      await pool.query('UPDATE users SET failed_attempts = ?, locked_until = ? WHERE id = ?', [failedAttempts, locked_until, user.id]);
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Reset failed attempts
    await pool.query('UPDATE users SET failed_attempts = 0, locked_until = NULL WHERE id = ?', [user.id]);

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.roll },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.json({ message: 'Login successful', token, role: user.roll });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Logout (client-side token delete, optional confirmation message)
router.post('/logout', authMiddleware(), (req, res) => {
  // Client should delete token
  res.json({ message: 'You have been logged out' });
});

// Forgot Password
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (!rows.length) return res.status(400).json({ message: 'Email not registered' });

    const user = rows[0];
    // For simplicity, just return password hint
    res.json({ message: 'Use this hint to remember your password', passwordHint: user.password_hint });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Reset Password
router.post('/reset-password', async (req, res) => {
  const { email, newPassword, confirmNewPassword } = req.body;

  if (newPassword !== confirmNewPassword) return res.status(400).json({ message: 'Passwords do not match' });

  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (!rows.length) return res.status(400).json({ message: 'Email not found' });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await pool.query('UPDATE users SET password = ? WHERE email = ?', [hashedPassword, email]);

    res.json({ message: 'Password reset successful' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
