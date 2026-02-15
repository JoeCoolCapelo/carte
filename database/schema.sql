-- Extension PostGIS pour la gestion spatiale
CREATE EXTENSION IF NOT EXISTS postgis;

-- Table des utilisateurs
CREATE TABLE IF NOT EXISTS utilisateurs (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    mot_de_passe VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'admin', 'moderator')),
    date_creation TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table des catégories de lieux
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(50) NOT NULL UNIQUE,
    icone VARCHAR(50) -- Nom de l'icône Lucide ou URL
);

-- Table des Points d'Intérêt (POI)
CREATE TABLE IF NOT EXISTS pois (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    description TEXT,
    adresse TEXT,
    altitude DOUBLE PRECISION,
    photo VARCHAR(255),
    statut VARCHAR(20) DEFAULT 'ouvert' CHECK (statut IN ('ouvert', 'ferme', 'en_attente')),
    categorie_id INTEGER REFERENCES categories(id),
    geom GEOMETRY(Point, 4326), -- Coordonnées GPS (WGS84)
    cree_par INTEGER REFERENCES utilisateurs(id),
    date_creation TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index spatial pour optimiser les recherches géographiques
CREATE INDEX IF NOT EXISTS pois_geom_idx ON pois USING GIST (geom);

-- Table des signalements
CREATE TABLE IF NOT EXISTS signalements (
    id SERIAL PRIMARY KEY,
    type VARCHAR(50) NOT NULL CHECK (type IN ('erreur_position', 'fermeture', 'information_erronee', 'autre')),
    description TEXT,
    poi_id INTEGER REFERENCES pois(id) ON DELETE CASCADE,
    utilisateur_id INTEGER REFERENCES utilisateurs(id),
    statut VARCHAR(20) DEFAULT 'en_attente' CHECK (statut IN ('en_attente', 'valide', 'rejete')),
    date_creation TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insertion de catégories par défaut
INSERT INTO categories (nom, icone) VALUES 
('Restaurant', 'utensils'),
('Pharmacie', 'pill'),
('Banque', 'landmark'),
('Supermarché', 'shopping-cart'),
('Santé', 'heart-pulse'),
('Éducation', 'graduation-cap'),
('Hôtel', 'bed'),
('Autre', 'map-pin')
ON CONFLICT (nom) DO NOTHING;
