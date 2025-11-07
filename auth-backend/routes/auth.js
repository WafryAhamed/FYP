// backend/routes/auth.js
import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { pool } from '../db.js';

dotenv.config();
const router = express.Router();

const MAX_ATTEMPTS = 3;
const LOCK_TIME = 15 * 60 * 1000; // 15 min

// Register
router.post('/register', async (req, res) => {
  const { firstName, lastName, roll, email, password, confirmPassword, passwordHint } = req.body;
  if (!firstName || !lastName || !email || !password || !confirmPassword || !roll) {
    return res.status(400).json({ message: 'Please fill all required fields' });
  }
  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Passwords do not match' });
  }

  try {
    const [existing] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (existing.length > 0) return res.status(400).json({ message: 'Email already registered' });

    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query(
      'INSERT INTO users (first_name, last_name, roll, email, password, password_hint) VALUES (?, ?, ?, ?, ?, ?)',
      [firstName, lastName, roll, email, hashedPassword, passwordHint || null]
    );
    res.status(201).json({ message: 'User registered successfully' });
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
    const user = rows[0];
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    if (user.locked_until && new Date() < new Date(user.locked_until)) {
      return res.status(403).json({ message: `Account locked. Try again later.` });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      const failedAttempts = user.failed_attempts + 1;
      let lockedUntil = null;
      if (failedAttempts >= MAX_ATTEMPTS) {
        lockedUntil = new Date(Date.now() + LOCK_TIME);
      }
      await pool.query('UPDATE users SET failed_attempts=?, locked_until=? WHERE id=?', [
        failedAttempts,
        lockedUntil,
        user.id
      ]);
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Reset failed attempts
    await pool.query('UPDATE users SET failed_attempts=0, locked_until=NULL WHERE id=?', [user.id]);

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.roll },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    res.json({ token, role: user.roll, firstName: user.first_name });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Forgot Password
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE email=?', [email]);
    const user = rows[0];
    if (!user) return res.status(400).json({ message: 'Email not found' });

    // For simplicity, return password hint
    res.json({ passwordHint: user.password_hint || 'No hint set' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Reset Password
router.post('/reset-password', async (req, res) => {
  const { email, newPassword, confirmPassword } = req.body;
  if (newPassword !== confirmPassword) return res.status(400).json({ message: 'Passwords do not match' });

  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await pool.query('UPDATE users SET password=? WHERE email=?', [hashedPassword, email]);
    res.json({ message: 'Password reset successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
