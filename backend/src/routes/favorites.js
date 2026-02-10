const express = require('express');
const router = express.Router();
const { query } = require('../config/db');

/**
 * @route   GET /api/favorites
 * @desc    Get all favorites for the current user
 * @access  Public (for MVP, should be Private)
 */
router.get('/', async (req, res) => {
    try {
        // In a real app, we'd get user_id from auth middleware
        // For MVP, we'll assume a default user_id or handle it simply
        const userId = 1;

        const result = await query(`
            SELECT 
                f.id as favorite_id,
                f.category as favorite_category,
                f.notes,
                p.*,
                ST_X(p.location::geometry) as longitude,
                ST_Y(p.location::geometry) as latitude
            FROM favorites f
            JOIN places p ON f.place_id = p.id
            WHERE f.user_id = $1
            ORDER BY f.created_at DESC
        `, [userId]);

        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching favorites:', error);
        res.status(500).json({ error: 'Failed to fetch favorites' });
    }
});

/**
 * @route   POST /api/favorites
 * @desc    Add a place to favorites
 * @access  Public
 */
router.post('/', async (req, res) => {
    try {
        const { place_id, category, notes } = req.body;
        const userId = 1; // Default for MVP

        if (!place_id) {
            return res.status(400).json({ error: 'place_id is required' });
        }

        const result = await query(`
            INSERT INTO favorites (user_id, place_id, category, notes)
            VALUES ($1, $2, $3, $4)
            ON CONFLICT (user_id, place_id) DO UPDATE SET
                category = EXCLUDED.category,
                notes = EXCLUDED.notes
            RETURNING *
        `, [userId, place_id, category, notes]);

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error adding favorite:', error);
        res.status(500).json({ error: 'Failed to add favorite' });
    }
});

/**
 * @route   DELETE /api/favorites/:id
 * @desc    Remove a place from favorites
 * @access  Public
 */
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const userId = 1;

        await query('DELETE FROM favorites WHERE id = $1 AND user_id = $2', [id, userId]);
        res.json({ message: 'Favorite removed' });
    } catch (error) {
        console.error('Error removing favorite:', error);
        res.status(500).json({ error: 'Failed to remove favorite' });
    }
});

module.exports = router;
