const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const prisma = new PrismaClient();

async function seedPois() {
    console.log("🌱 Insertion des POIs fictifs pour Camayenne...\n");

    // S'assurer qu'on a un admin user
    const existingAdmin = await prisma.utilisateur.findUnique({ where: { email: 'admin@camayenne.gn' } });
    let adminId;
    if (existingAdmin) {
        adminId = existingAdmin.id;
        console.log(`✅ Admin existant trouvé (ID: ${adminId})`);
    } else {
        const admin = await prisma.utilisateur.create({
            data: {
                nom: 'Admin',
                email: 'admin@camayenne.gn',
                motDePasse: '$2b$10$placeholder_hash_for_seed',
                role: 'admin'
            }
        });
        adminId = admin.id;
        console.log(`✅ Admin créé (ID: ${adminId})`);
    }

    // Supprimer les anciens POIs de test
    await prisma.$executeRaw`DELETE FROM pois WHERE nom LIKE '%[TEST]%'`;
    console.log("🗑️  Anciens POIs de test supprimés\n");

    // Données des POIs - Coordonnées réelles dans le quartier de Camayenne, Conakry
    const pois = [
        // RESTAURANTS (catégorie 1)
        { nom: 'Restaurant Le Jardin [TEST]', desc: 'Restaurant avec terrasse ombragée proposant des plats guinéens et internationaux. Spécialité : riz au gras et poulet grillé.', adr: 'Quartier Camayenne, Route du Niger', cat: 1, lng: -13.6920, lat: 9.5350, photo: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400' },
        { nom: 'Maquis Chez Fatou [TEST]', desc: 'Petit restaurant populaire servant des plats locaux à prix abordables. Ambiance conviviale.', adr: 'Camayenne Centre, près du marché', cat: 1, lng: -13.6885, lat: 9.5310, photo: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400' },
        { nom: 'Restaurant La Terrasse [TEST]', desc: 'Restaurant haut de gamme avec vue panoramique. Cuisine fusion africaine-européenne et cocktails.', adr: 'Boulevard du Commerce, Camayenne', cat: 1, lng: -13.6950, lat: 9.5280, photo: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400' },

        // PHARMACIES (catégorie 2)
        { nom: 'Pharmacie Centrale de Camayenne [TEST]', desc: 'Pharmacie de garde ouverte 24h/24. Large stock de médicaments génériques et de marque.', adr: 'Carrefour Camayenne', cat: 2, lng: -13.6905, lat: 9.5295, photo: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400' },
        { nom: 'Pharmacie du Port [TEST]', desc: 'Pharmacie bien approvisionnée avec service de conseil gratuit. Tests rapides disponibles.', adr: 'Route du Port, Camayenne', cat: 2, lng: -13.6940, lat: 9.5260, photo: 'https://images.unsplash.com/photo-1576602976047-174e57a47881?w=400' },

        // BANQUES (catégorie 3)
        { nom: 'Banque Centrale BCRG [TEST]', desc: 'Agence principale avec services de change et transferts internationaux.', adr: 'Avenue de la République, Camayenne', cat: 3, lng: -13.6870, lat: 9.5330, photo: 'https://images.unsplash.com/photo-1541354329998-f4d9a9f9297f?w=400' },
        { nom: 'Ecobank Camayenne [TEST]', desc: 'Agence Ecobank avec DAB 24h/24, services bancaires en ligne et Western Union.', adr: 'Rond-point Camayenne', cat: 3, lng: -13.6930, lat: 9.5320, photo: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400' },
        { nom: 'Société Générale [TEST]', desc: 'Agence bancaire avec services professionnels, crédits immobiliers et assurance.', adr: 'Boulevard du Commerce', cat: 3, lng: -13.6960, lat: 9.5300, photo: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400' },

        // SUPERMARCHÉS (catégorie 4)
        { nom: 'Supermarché Kaloum [TEST]', desc: 'Grand supermarché avec produits importés, fruits frais et produits d\'hygiène.', adr: 'Avenue du Port, Camayenne', cat: 4, lng: -13.6915, lat: 9.5275, photo: 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=400' },
        { nom: 'Mini-Prix Express [TEST]', desc: 'Supérette de proximité ouverte de 7h à 22h. Produits du quotidien.', adr: 'Quartier Camayenne Nord', cat: 4, lng: -13.6890, lat: 9.5345, photo: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=400' },

        // SANTÉ (catégorie 5)
        { nom: 'Centre de Santé de Camayenne [TEST]', desc: 'Centre médical avec consultation générale, maternité, vaccination et laboratoire.', adr: 'Rue de l\'Hôpital, Camayenne', cat: 5, lng: -13.6895, lat: 9.5315, photo: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400' },
        { nom: 'Clinique Pasteur [TEST]', desc: 'Clinique privée : cardiologie, dentisterie, ophtalmologie. Urgences 24h/24.', adr: 'Route Nationale, Camayenne', cat: 5, lng: -13.6925, lat: 9.5360, photo: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=400' },

        // ÉDUCATION (catégorie 6)
        { nom: 'Université Gamal Abdel Nasser [TEST]', desc: 'Campus universitaire principal. Facultés de sciences, lettres, droit et médecine.', adr: 'Campus Universitaire, Camayenne', cat: 6, lng: -13.6855, lat: 9.5370, photo: 'https://images.unsplash.com/photo-1562774053-701939374585?w=400' },
        { nom: 'Lycée de Camayenne [TEST]', desc: 'Établissement secondaire avec excellents résultats au baccalauréat.', adr: 'Avenue de l\'Éducation, Camayenne', cat: 6, lng: -13.6910, lat: 9.5340, photo: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=400' },
        { nom: 'École Primaire La Réussite [TEST]', desc: 'École primaire bilingue français-anglais avec activités parascolaires.', adr: 'Quartier résidentiel, Camayenne', cat: 6, lng: -13.6945, lat: 9.5290, photo: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400' },

        // HÔTELS (catégorie 7)
        { nom: 'Hôtel Camayenne [TEST]', desc: 'Hôtel 4 étoiles avec piscine, restaurant, salle de conférence et vue sur l\'océan.', adr: 'Corniche de Camayenne', cat: 7, lng: -13.6975, lat: 9.5250, photo: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400' },
        { nom: 'Résidence Le Palmier [TEST]', desc: 'Résidence hôtelière avec appartements meublés. WiFi et climatisation.', adr: 'Route de la Corniche, Camayenne', cat: 7, lng: -13.6965, lat: 9.5270, photo: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400' },

        // AUTRES (catégorie 8)
        { nom: 'Mosquée de Camayenne [TEST]', desc: 'Grande mosquée avec architecture traditionnelle. Prières quotidiennes et cours coraniques.', adr: 'Centre de Camayenne', cat: 8, lng: -13.6900, lat: 9.5305, photo: 'https://images.unsplash.com/photo-1585036156171-384164a8c159?w=400' },
        { nom: 'Marché de Camayenne [TEST]', desc: 'Grand marché local avec fruits, légumes, poissons, tissus et artisanat guinéen.', adr: 'Place du Marché, Camayenne', cat: 8, lng: -13.6880, lat: 9.5325, photo: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=400' },
        { nom: 'Stade de Camayenne [TEST]', desc: 'Stade municipal pour football et athlétisme. Rencontres sportives le weekend.', adr: 'Avenue du Sport, Camayenne', cat: 8, lng: -13.6935, lat: 9.5355, photo: 'https://images.unsplash.com/photo-1459865264687-595d652de67e?w=400' },
    ];

    let count = 0;
    for (const p of pois) {
        try {
            await prisma.$executeRaw`
                INSERT INTO pois (nom, description, adresse, altitude, photo, statut, categorie_id, geom, cree_par)
                VALUES (${p.nom}, ${p.desc}, ${p.adr}, ${20.0}, ${p.photo}, 'ouvert', ${p.cat}, 
                        ST_SetSRID(ST_MakePoint(${p.lng}, ${p.lat}), 4326), ${adminId})
            `;
            count++;
            console.log(`  ✅ ${p.nom}`);
        } catch (err) {
            console.error(`  ❌ Erreur pour "${p.nom}":`, err.message);
        }
    }

    console.log(`\n🎉 ${count}/${pois.length} POIs insérés avec succès !`);

    // Vérification
    const total = await prisma.$queryRaw`SELECT COUNT(*) as total FROM pois`;
    console.log(`📊 Total de POIs en base: ${total[0].total}`);

    await prisma.$disconnect();
}

seedPois().catch(e => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
});
