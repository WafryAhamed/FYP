const db = require('../config/db');

exports.checkLock = async (req, res, next) => {
    try {
        const [users] = await db.query('SELECT is_locked FROM users WHERE id = ?', [req.user.id]);
        if (!users.length) return res.status(404).json({ message: 'User not found' });

        if (users[0].is_locked) {
            return res.status(403).json({ message: 'Account is locked. Please reset your password.' });
        }

        next();
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};
