const { PrismaClient } = require('@prisma/client');
require('dotenv').config();
const p = new PrismaClient();

async function main() {
    console.log("🛠️  Ajout des colonnes manquantes à la table pois...");
    try {
        await p.$executeRawUnsafe(`
            ALTER TABLE pois 
            ADD COLUMN IF NOT EXISTS adresse TEXT, 
            ADD COLUMN IF NOT EXISTS altitude DOUBLE PRECISION, 
            ADD COLUMN IF NOT EXISTS photo VARCHAR(255), 
            ADD COLUMN IF NOT EXISTS statut VARCHAR(20) DEFAULT 'ouvert'
        `);
        console.log("✅ Colonnes ajoutées avec succès.");
    } catch (e) {
        console.error("❌ Erreur lors de l'ajout des colonnes:", e.message);
    } finally {
        await p.$disconnect();
    }
}
main();
