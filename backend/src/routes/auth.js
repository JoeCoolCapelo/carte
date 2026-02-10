const express = require('express');
const router = express.Router();

/**
 * @route   POST /api/auth/login
 * @desc    Mock login for MVP
 * @access  Public
 */
router.post('/login', (req, res) => {
    const { email, password } = req.body;

    // Basic validation
    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    // Mock successful login
    // In a real app, you would verify against the DB and use bcrypt
    console.log(`Login attempt for: ${email}`);

    res.json({
        token: 'mock-jwt-token-for-mvp',
        user: {
            id: 1,
            username: email.split('@')[0],
            email: email,
            role: 'user'
        }
    });
});

/**
 * @route   POST /api/auth/register
 * @desc    Mock registration
 * @access  Public
 */
router.post('/register', (req, res) => {
    res.status(501).json({ message: 'Registration not implemented for MVP. Use the mock login.' });
});

module.exports = router;
