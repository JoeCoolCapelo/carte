const express = require('express');
const router = express.Router();
const { query } = require('../config/db');

/**
 * @route   GET /api/search
 * @desc    Search places by name, category, or address
 * @access  Public
 */
router.get('/', async (req, res) => {
    try {
        const { q, lat, lon, limit = 20 } = req.query;

        if (!q) {
            return res.status(400).json({ error: 'Query parameter "q" is required' });
        }

        let queryText = `
      SELECT 
        id, osm_id, name, category, subcategory, address, rating, photos,
        ST_X(location::geometry) as longitude,
        ST_Y(location::geometry) as latitude
    `;

        const params = [`%${q}%`];

        if (lat && lon) {
            queryText += `,
        ST_Distance(
          location,
          ST_SetSRID(ST_MakePoint($2, $3), 4326)::geography
        ) as distance
      `;
            params.push(lon, lat);
        }

        queryText += `
      FROM places
      WHERE 
        name ILIKE $1 
        OR category ILIKE $1 
        OR subcategory ILIKE $1
        OR address ILIKE $1
    `;

        if (lat && lon) {
            queryText += ' ORDER BY distance ASC';
        } else {
            queryText += ' ORDER BY rating DESC, name ASC';
        }

        queryText += ` LIMIT $${params.length + 1}`;
        params.push(limit);

        const result = await query(queryText, params);
        res.json(result.rows);
    } catch (error) {
        console.error('Error searching places:', error);
        res.status(500).json({ error: 'Search failed' });
    }
});

module.exports = router;
