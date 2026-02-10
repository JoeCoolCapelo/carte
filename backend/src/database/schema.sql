-- Schéma de base de données pour Camayenne Map
-- Extension PostGIS (à activer au préalable)
-- CREATE EXTENSION IF NOT EXISTS postgis;

-- Table : users (Authentification)
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Table : places (Points d'intérêt)
CREATE TABLE IF NOT EXISTS places (
    id SERIAL PRIMARY KEY,
    osm_id BIGINT UNIQUE,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100), -- restaurant, health, education, etc.
    subcategory VARCHAR(100),
    description TEXT,
    address TEXT,
    phone VARCHAR(20),
    email VARCHAR(100),
    website VARCHAR(255),
    location GEOGRAPHY(POINT, 4326) NOT NULL,
    photos TEXT[], -- URLs des photos
    rating DECIMAL(2,1) DEFAULT 0,
    reviews_count INT DEFAULT 0,
    verified BOOLEAN DEFAULT FALSE,
    source VARCHAR(50) DEFAULT 'osm',
    created_by INT REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_places_location ON places USING GIST(location);
CREATE INDEX IF NOT EXISTS idx_places_category ON places(category);

-- Table : incidents (Signalements urbains)
CREATE TABLE IF NOT EXISTS incidents (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(100) NOT NULL, -- road, lighting, waste, water, other
    status VARCHAR(50) DEFAULT 'new', -- new, in_progress, resolved, rejected
    location GEOGRAPHY(POINT, 4326) NOT NULL,
    address TEXT,
    photos TEXT[] NOT NULL,
    priority VARCHAR(20) DEFAULT 'normal', -- low, normal, high, urgent
    reported_by INT REFERENCES users(id),
    assigned_to INT REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    resolved_at TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_incidents_location ON incidents USING GIST(location);
CREATE INDEX IF NOT EXISTS idx_incidents_status ON incidents(status);

-- Table : favorites
CREATE TABLE IF NOT EXISTS favorites (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    place_id INT REFERENCES places(id) ON DELETE CASCADE,
    category VARCHAR(100), -- work, home, shopping, etc.
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, place_id)
);

-- Table : reviews
CREATE TABLE IF NOT EXISTS reviews (
    id SERIAL PRIMARY KEY,
    place_id INT REFERENCES places(id) ON DELETE CASCADE,
    user_id INT REFERENCES users(id),
    rating INT CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    photos TEXT[],
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Table : osm_cache (Cache pour les données Overpass)
CREATE TABLE IF NOT EXISTS osm_cache (
    id SERIAL PRIMARY KEY,
    osm_type VARCHAR(20), -- node, way, relation
    osm_id BIGINT NOT NULL,
    tags JSONB,
    geometry GEOGRAPHY(GEOMETRY, 4326),
    cached_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(osm_type, osm_id)
);

CREATE INDEX IF NOT EXISTS idx_osm_cache_geometry ON osm_cache USING GIST(geometry);
