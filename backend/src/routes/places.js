const express = require('express');
const router = express.Router();
const { query } = require('../config/db');

/**
 * @route   GET /api/places
 * @desc    Get all places with optional category and proximity filters
 * @access  Public
 */
router.get('/', async (req, res) => {
    try {
        const { category, lat, lon, radius = 5000 } = req.query;

        let queryText = `
      SELECT 
        id, 
        osm_id,
        name, 
        category, 
        subcategory,
        address, 
        phone,
        website,
        rating,
        ST_X(location::geometry) as longitude,
        ST_Y(location::geometry) as latitude,
        photos,
        source
      FROM places
    `;

        const params = [];
        const conditions = [];

        if (category) {
            conditions.push(`category = $${params.length + 1}`);
            params.push(category);
        }

        if (lat && lon) {
            conditions.push(`
        ST_DWithin(
          location,
          ST_SetSRID(ST_MakePoint($${params.length + 1}, $${params.length + 2}), 4326)::geography,
          $${params.length + 3}
        )
      `);
            params.push(lon, lat, radius);
        }

        if (conditions.length > 0) {
            queryText += ' WHERE ' + conditions.join(' AND ');
        }

        queryText += ' ORDER BY rating DESC, name ASC LIMIT 100';

        const result = await query(queryText, params);
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching places:', error);
        res.status(500).json({ error: 'Failed to fetch places' });
    }
});

/**
 * @route   GET /api/places/:id
 * @desc    Get a single place by ID
 * @access  Public
 */
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await query(`
      SELECT 
        id, osm_id, name, category, subcategory, description, address, phone, email, website, rating, photos, source,
        ST_X(location::geometry) as longitude,
        ST_Y(location::geometry) as latitude
      FROM places WHERE id = $1
    `, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Place not found' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error fetching place:', error);
        res.status(500).json({ error: 'Failed to fetch place' });
    }
});

module.exports = router;
