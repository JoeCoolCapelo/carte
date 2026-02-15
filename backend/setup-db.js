const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const connectionString = process.env.DATABASE_URL;

async function setupDatabase() {
    const client = new Client({ connectionString });

    try {
        await client.connect();
        console.log('✅ Connecté à PostgreSQL');

        const sqlPath = path.join(__dirname, '..', 'database', 'schema.sql');
        const sql = fs.readFileSync(sqlPath, 'utf8');

        await client.query(sql);
        console.log('✅ Schéma SQL exécuté avec succès (Tables créées)');

    } catch (error) {
        console.error('❌ Erreur lors de l\'initialisation du schéma :', error.message);
    } finally {
        await client.end();
    }
}

setupDatabase();
