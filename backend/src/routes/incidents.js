const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { query } = require('../config/db');

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer configuration for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`);
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|webp/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('Only image files (jpg, png, webp) are allowed'));
    }
});

/**
 * @route   GET /api/incidents
 * @desc    Get all reported incidents
 * @access  Public
 */
router.get('/', async (req, res) => {
    try {
        const { status, category } = req.query;

        let queryText = `
      SELECT 
        id, title, description, category, status, priority, address, photos,
        ST_X(location::geometry) as longitude,
        ST_Y(location::geometry) as latitude,
        created_at,
        updated_at
      FROM incidents
    `;

        const params = [];
        const conditions = [];

        if (status) {
            conditions.push(`status = $${params.length + 1}`);
            params.push(status);
        }

        if (category) {
            conditions.push(`category = $${params.length + 1}`);
            params.push(category);
        }

        if (conditions.length > 0) {
            queryText += ' WHERE ' + conditions.join(' AND ');
        }

        queryText += ' ORDER BY created_at DESC LIMIT 100';

        const result = await query(queryText, params);
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching incidents:', error);
        res.status(500).json({ error: 'Failed to fetch incidents' });
    }
});

/**
 * @route   POST /api/incidents
 * @desc    Report a new incident
 * @access  Public (for MVP)
 */
router.post('/', upload.array('photos', 5), async (req, res) => {
    try {
        const { title, description, category, priority = 'normal', latitude, longitude, address } = req.body;

        if (!title || !description || !category || !latitude || !longitude) {
            return res.status(400).json({ error: 'Missing required fields (title, description, category, latitude, longitude)' });
        }

        const photoUrls = req.files ? req.files.map(file => `/uploads/${path.basename(file.path)}`) : [];

        const result = await query(`
      INSERT INTO incidents (
        title, description, category, priority, location, address, photos
      ) VALUES (
        $1, $2, $3, $4, ST_SetSRID(ST_MakePoint($5, $6), 4326), $7, $8
      )
      RETURNING id, title, status, created_at
    `, [title, description, category, priority, longitude, latitude, address, photoUrls]);

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error creating incident:', error);
        res.status(500).json({ error: 'Failed to report incident' });
    }
});

module.exports = router;
