-- ============================================================
-- Données fictives pour les POIs de Camayenne (Conakry, Guinée)
-- Coordonnées réelles de lieux dans le quartier de Camayenne
-- ============================================================

-- S'assurer qu'il existe un utilisateur admin (ID=1) pour le champ cree_par
-- Si l'admin existe déjà, cette commande ne fera rien grâce à ON CONFLICT
INSERT INTO utilisateurs (id, nom, email, mot_de_passe, role)
VALUES (1, 'Admin', 'admin@camayenne.gn', '$2b$10$XrG5G5G5G5G5G5G5G5G5GOeWcvqN5G5G5G5G5G5G5G5G5G5G5G5u', 'admin')
ON CONFLICT (email) DO NOTHING;

-- Réinitialiser la séquence de l'ID pour les POIs
-- (Supprime les anciens POIs de test si nécessaire)
DELETE FROM pois WHERE nom LIKE '%[TEST]%';

-- =====================
-- RESTAURANTS (catégorie 1)
-- =====================
INSERT INTO pois (nom, description, adresse, altitude, photo, statut, categorie_id, geom, cree_par)
VALUES 
('Restaurant Le Jardin [TEST]', 'Restaurant avec terrasse ombragée proposant des plats guinéens et internationaux. Spécialité : riz au gras et poulet grillé.', 'Quartier Camayenne, Route du Niger', 20, 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400', 'ouvert', 1, ST_SetSRID(ST_MakePoint(-13.6920, 9.5350), 4326), 1),

('Maquis Chez Fatou [TEST]', 'Petit restaurant populaire servant des plats locaux à prix abordables. Ambiance conviviale et musique live le weekend.', 'Camayenne Centre, près du marché', 18, 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400', 'ouvert', 1, ST_SetSRID(ST_MakePoint(-13.6885, 9.5310), 4326), 1),

('Restaurant La Terrasse [TEST]', 'Restaurant haut de gamme avec vue panoramique. Cuisine fusion africaine-européenne et cocktails.', 'Boulevard du Commerce, Camayenne', 25, 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400', 'ouvert', 1, ST_SetSRID(ST_MakePoint(-13.6950, 9.5280), 4326), 1),

-- =====================
-- PHARMACIES (catégorie 2)
-- =====================
('Pharmacie Centrale de Camayenne [TEST]', 'Pharmacie de garde ouverte 24h/24. Large stock de médicaments génériques et de marque.', 'Carrefour Camayenne', 15, 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400', 'ouvert', 2, ST_SetSRID(ST_MakePoint(-13.6905, 9.5295), 4326), 1),

('Pharmacie du Port [TEST]', 'Pharmacie bien approvisionnée avec service de conseil gratuit. Tests rapides disponibles.', 'Route du Port, Camayenne', 12, 'https://images.unsplash.com/photo-1576602976047-174e57a47881?w=400', 'ouvert', 2, ST_SetSRID(ST_MakePoint(-13.6940, 9.5260), 4326), 1),

-- =====================
-- BANQUES (catégorie 3)
-- =====================
('Banque Centrale BCRG [TEST]', 'Agence principale de la Banque Centrale avec services de change et transferts internationaux.', 'Avenue de la République, Camayenne', 22, 'https://images.unsplash.com/photo-1541354329998-f4d9a9f9297f?w=400', 'ouvert', 3, ST_SetSRID(ST_MakePoint(-13.6870, 9.5330), 4326), 1),

('Ecobank Camayenne [TEST]', 'Agence Ecobank avec DAB 24h/24, services bancaires en ligne et transferts Western Union.', 'Rond-point Camayenne', 20, 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400', 'ouvert', 3, ST_SetSRID(ST_MakePoint(-13.6930, 9.5320), 4326), 1),

('Société Générale [TEST]', 'Agence bancaire avec services professionnels, crédits immobiliers et assurance.', 'Boulevard du Commerce', 19, 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400', 'ouvert', 3, ST_SetSRID(ST_MakePoint(-13.6960, 9.5300), 4326), 1),

-- =====================
-- SUPERMARCHÉS (catégorie 4)
-- =====================
('Supermarché Kaloum [TEST]', 'Grand supermarché avec produits importés, fruits frais et produits d''hygiène. Parking disponible.', 'Avenue du Port, Camayenne', 14, 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=400', 'ouvert', 4, ST_SetSRID(ST_MakePoint(-13.6915, 9.5275), 4326), 1),

('Mini-Prix Express [TEST]', 'Supérette de proximité ouverte de 7h à 22h. Produits du quotidien et boissons fraîches.', 'Quartier Camayenne Nord', 16, 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=400', 'ouvert', 4, ST_SetSRID(ST_MakePoint(-13.6890, 9.5345), 4326), 1),

-- =====================
-- SANTÉ (catégorie 5)
-- =====================
('Centre de Santé de Camayenne [TEST]', 'Centre médical avec services de consultation générale, maternité, vaccination et laboratoire d''analyses.', 'Rue de l''Hôpital, Camayenne', 20, 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400', 'ouvert', 5, ST_SetSRID(ST_MakePoint(-13.6895, 9.5315), 4326), 1),

('Clinique Pasteur [TEST]', 'Clinique privée avec spécialistes : cardiologie, dentisterie, ophtalmologie. Urgences 24h/24.', 'Route Nationale, Camayenne', 23, 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=400', 'ouvert', 5, ST_SetSRID(ST_MakePoint(-13.6925, 9.5360), 4326), 1),

-- =====================
-- ÉDUCATION (catégorie 6)
-- =====================
('Université Gamal Abdel Nasser [TEST]', 'Principal campus universitaire de Conakry. Facultés de sciences, lettres, droit et médecine.', 'Campus Universitaire, Camayenne', 30, 'https://images.unsplash.com/photo-1562774053-701939374585?w=400', 'ouvert', 6, ST_SetSRID(ST_MakePoint(-13.6855, 9.5370), 4326), 1),

('Lycée de Camayenne [TEST]', 'Établissement d''enseignement secondaire avec excellents résultats au baccalauréat.', 'Avenue de l''Éducation, Camayenne', 25, 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=400', 'ouvert', 6, ST_SetSRID(ST_MakePoint(-13.6910, 9.5340), 4326), 1),

('École Primaire La Réussite [TEST]', 'École primaire avec programme bilingue français-anglais et activités parascolaires.', 'Quartier résidentiel, Camayenne', 18, 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400', 'ouvert', 6, ST_SetSRID(ST_MakePoint(-13.6945, 9.5290), 4326), 1),

-- =====================
-- HÔTELS (catégorie 7)
-- =====================
('Hôtel Camayenne [TEST]', 'Hôtel 4 étoiles avec piscine, restaurant, salle de conférence et vue sur l''océan Atlantique.', 'Corniche de Camayenne', 10, 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400', 'ouvert', 7, ST_SetSRID(ST_MakePoint(-13.6975, 9.5250), 4326), 1),

('Résidence Le Palmier [TEST]', 'Résidence hôtelière avec appartements meublés, idéale pour longs séjours. WiFi et climatisation.', 'Route de la Corniche, Camayenne', 15, 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400', 'ouvert', 7, ST_SetSRID(ST_MakePoint(-13.6965, 9.5270), 4326), 1),

-- =====================
-- AUTRES / LIEUX D'INTÉRÊT (catégorie 8)
-- =====================
('Mosquée de Camayenne [TEST]', 'Grande mosquée du quartier avec architecture traditionnelle. Prières quotidiennes et cours coraniques.', 'Centre de Camayenne', 20, 'https://images.unsplash.com/photo-1585036156171-384164a8c159?w=400', 'ouvert', 8, ST_SetSRID(ST_MakePoint(-13.6900, 9.5305), 4326), 1),

('Marché de Camayenne [TEST]', 'Grand marché local avec fruits, légumes, poissons frais, tissus et artisanat guinéen.', 'Place du Marché, Camayenne', 16, 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=400', 'ouvert', 8, ST_SetSRID(ST_MakePoint(-13.6880, 9.5325), 4326), 1),

('Stade de Camayenne [TEST]', 'Stade municipal pour football et athlétisme. Rencontres sportives le weekend.', 'Avenue du Sport, Camayenne', 22, 'https://images.unsplash.com/photo-1459865264687-595d652de67e?w=400', 'ouvert', 8, ST_SetSRID(ST_MakePoint(-13.6935, 9.5355), 4326), 1);

-- Résumé : 20 POIs insérés couvrant toutes les catégories
-- Restaurant (3), Pharmacie (2), Banque (3), Supermarché (2), 
-- Santé (2), Éducation (3), Hôtel (2), Autre (3)
