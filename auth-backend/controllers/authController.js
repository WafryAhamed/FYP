const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sendResetEmail } = require('../utils/email');
const dotenv = require('dotenv');
dotenv.config();

// Register
exports.register = async (req, res) => {
    const { firstName, lastName, roll, email, password, confirmPassword, passwordHint, role } = req.body;
    if (!firstName || !lastName || !email || !password || !confirmPassword)
        return res.status(400).json({ message: 'All fields are required' });
    if (password !== confirmPassword)
        return res.status(400).json({ message: 'Passwords do not match' });

    try {
        const [existing] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (existing.length) return res.status(400).json({ message: 'Email already exists' });

        const hashedPassword = await bcrypt.hash(password, 10);
        await db.query(
            'INSERT INTO users (first_name, last_name, roll, email, password, password_hint, role) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [firstName, lastName, roll || null, email, hashedPassword, passwordHint || null, role || 'student']
        );

        res.status(201).json({ message: 'Registration successful' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// Login
exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (!users.length) return res.status(400).json({ message: 'Invalid credentials' });

        const user = users[0];

        if (user.is_locked) return res.status(403).json({ message: 'Account locked. Reset password.' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            let attempts = user.login_attempts + 1;
            let locked = attempts >= 3 ? 1 : 0;
            await db.query('UPDATE users SET login_attempts = ?, is_locked = ? WHERE id = ?', [attempts, locked, user.id]);
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        await db.query('UPDATE users SET login_attempts = 0 WHERE id = ?', [user.id]);
        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ token, role: user.role, message: `Login successful as ${user.role}` });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// Logout
exports.logout = (req, res) => {
    res.json({ message: 'You have been logged out' });
};

// Forgot password → show hint
exports.forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (!users.length) return res.status(400).json({ message: 'Email not found' });

        res.json({ hint: users[0].password_hint || 'No hint available' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// Send password reset email
exports.sendReset = async (req, res) => {
    const { email } = req.body;
    try {
        const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (!users.length) return res.status(400).json({ message: 'Email not found' });

        const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '15m' });
        const emailSent = await sendResetEmail(email, token);

        if (!emailSent) return res.status(500).json({ message: 'Failed to send reset email' });
        res.json({ message: 'Password reset email sent' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// Reset password
exports.resetPassword = async (req, res) => {
    const { token, newPassword } = req.body;
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const email = decoded.email;

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await db.query('UPDATE users SET password = ?, login_attempts = 0, is_locked = 0 WHERE email = ?', [hashedPassword, email]);

        res.json({ message: 'Password reset successful' });
    } catch (err) {
        console.error(err);
        res.status(400).json({ message: 'Invalid or expired token' });
    }
};
