const { pool } = require('./src/config/db');

async function checkData() {
    try {
        const res = await pool.query('SELECT count(*) as count FROM places');
        console.log(`Total places in DB: ${res.rows[0].count}`);

        const sample = await pool.query('SELECT name, category, subcategory FROM places LIMIT 5');
        console.log('Sample data:', sample.rows);

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkData();
