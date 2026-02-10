const express = require('express');
const router = express.Router();
const axios = require('axios');

/**
 * @route   GET /api/routes
 * @desc    Calculate route between two points using OSRM
 * @access  Public
 */
router.get('/', async (req, res) => {
    try {
        const { start, end, mode = 'driving' } = req.query;

        if (!start || !end) {
            return res.status(400).json({ error: 'Start and end coordinates are required (format: lon,lat)' });
        }

        // OSRM URL format: http://router.project-osrm.org/route/v1/{profile}/{coordinates}
        // coordinates format: {lon},{lat};{lon},{lat}
        const osrmUrl = `http://router.project-osrm.org/route/v1/${mode}/${start};${end}`;

        const response = await axios.get(osrmUrl, {
            params: {
                overview: 'full',
                geometries: 'geojson',
                steps: true
            }
        });

        if (response.data.code !== 'Ok') {
            return res.status(404).json({ error: 'No route found' });
        }

        const route = response.data.routes[0];

        res.json({
            distance: route.distance, // in meters
            duration: route.duration, // in seconds
            geometry: route.geometry,
            steps: route.legs[0].steps.map(step => ({
                instruction: step.maneuver.instruction || step.maneuver.type,
                distance: step.distance,
                duration: step.duration
            }))
        });
    } catch (error) {
        console.error('Routing error:', error.message);
        res.status(500).json({ error: 'Routing calculation failed' });
    }
});

module.exports = router;
