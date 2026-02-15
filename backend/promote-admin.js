const { Client } = require('pg');
require('dotenv').config();

const client = new Client({ connectionString: process.env.DATABASE_URL });

async function promoteAdmin() {
    try {
        await client.connect();
        const email = 'test2@example.com'; // L'utilisateur qu'on a créé précédemment
        const res = await client.query("UPDATE utilisateurs SET role = 'admin' WHERE email = $1 RETURNING *", [email]);

        if (res.rows.length > 0) {
            console.log('✅ Utilisateur promu admin:', res.rows[0]);
        } else {
            console.log('❌ Utilisateur non trouvé');
        }
    } catch (error) {
        console.error('❌ Erreur:', error.message);
    } finally {
        await client.end();
    }
}

promoteAdmin();
