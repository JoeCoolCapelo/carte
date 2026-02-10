const express = require('express');
const router = express.Router();
const { query } = require('../config/db');

/**
 * @route   GET /api/stats/me
 * @desc    Get counts of incidents and favorites for the current user
 * @access  Public (MVP)
 */
router.get('/me', async (req, res) => {
    try {
        const userId = 1; // Default for MVP

        const reportsCount = await query(
            'SELECT COUNT(*) FROM incidents WHERE reported_by = $1 OR 1=1', // 1=1 for MVP to show some data if user_id is null
            [userId]
        );

        const favoritesCount = await query(
            'SELECT COUNT(*) FROM favorites WHERE user_id = $1',
            [userId]
        );

        res.json({
            reports: parseInt(reportsCount.rows[0].count),
            favorites: parseInt(favoritesCount.rows[0].count),
            memberSince: 'Février 2026'
        });
    } catch (error) {
        console.error('Error fetching stats:', error);
        res.status(500).json({ error: 'Failed to fetch statistics' });
    }
});

module.exports = router;
