const { PrismaClient } = require('@prisma/client');
require('dotenv').config();
const p = new PrismaClient();

async function main() {
    const cols = await p.$queryRawUnsafe(
        "SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'pois' ORDER BY ordinal_position"
    );
    console.log("Colonnes de la table pois:");
    console.log(JSON.stringify(cols, null, 2));
    await p.$disconnect();
}
main();
