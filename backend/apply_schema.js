const fs = require('fs');
const path = require('path');
const { pool } = require('./src/config/db');

async function applySchema() {
    try {
        console.log('Applying database schema...');

        // Read schema file
        const schemaPath = path.join(__dirname, 'src', 'database', 'schema.sql');
        const schema = fs.readFileSync(schemaPath, 'utf8');

        // Enable PostGIS first (might fail if user doesn't have permissions, but usually ok on local)
        try {
            await pool.query('CREATE EXTENSION IF NOT EXISTS postgis;');
            console.log('PostGIS extension enabled or already exists.');
        } catch (e) {
            console.warn('Warning: Could not enable PostGIS. It might already be enabled or you lack permissions.', e.message);
        }

        // Run schema
        await pool.query(schema);
        console.log('Schema applied successfully!');
        process.exit(0);
    } catch (err) {
        console.error('Error applying schema:', err);
        process.exit(1);
    }
}

applySchema();
