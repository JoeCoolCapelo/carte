const prisma = require('./src/prisma');

async function testConnection() {
    try {
        await prisma.$connect();
        console.log('✅ Connexion à la base de données réussie !');

        const version = await prisma.$queryRaw`SELECT version();`;
        console.log('Serveur DB Version:', version[0].version);

        const postgis = await prisma.$queryRaw`SELECT postgis_full_version();`;
        console.log('PostGIS Version:', postgis[0].postgis_full_version);

    } catch (error) {
        console.error('❌ Échec de la connexion à la base de données :');
        console.error(error.message);
    } finally {
        await prisma.$disconnect();
    }
}

testConnection();
