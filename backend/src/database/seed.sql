-- Données de test pour Camayenne Map

-- Utilisateur de test (password: "password123" - hash mocké pour exemple)
INSERT INTO users (username, email, password_hash) 
VALUES ('admin', 'admin@camayenne.gn', '$2b$10$EixZA5VK1pHEbeH9xY4/Ou6F9S/JcK.4iSgxRpq0iOOWt9.8B6kly')
ON CONFLICT (username) DO NOTHING;

-- Quelques lieux à Camayenne (Coordonnées approx pour test)
INSERT INTO places (name, category, address, location, source, rating)
VALUES 
('Hôpital Donka', 'health', 'Conakry, Guinée', ST_SetSRID(ST_MakePoint(-13.6844, 9.5422), 4326), 'manual', 4.5),
('Grand Hôtel de l''Indépendance (Novotel)', 'tourism', 'Camayenne, Conakry', ST_SetSRID(ST_MakePoint(-13.7022, 9.5085), 4326), 'manual', 4.2),
('Marché de Camayenne', 'commerce', 'Camayenne Centre', ST_SetSRID(ST_MakePoint(-13.6890, 9.5280), 4326), 'manual', 3.8),
('Restaurant Le Cèdre', 'restaurant', 'Camayenne', ST_SetSRID(ST_MakePoint(-13.6920, 9.5250), 4326), 'manual', 4.0),
('Pharmacie de la Paix', 'health', 'Avenue Jean Paul II', ST_SetSRID(ST_MakePoint(-13.6860, 9.5350), 4326), 'manual', 4.3)
ON CONFLICT (osm_id) DO NOTHING;

-- Un incident de test
INSERT INTO incidents (title, description, category, status, location, address, photos, priority)
VALUES 
('Nid-de-poule important', 'Un grand nid-de-poule bloque la circulation près de l''hôpital.', 'road', 'new', ST_SetSRID(ST_MakePoint(-13.6850, 9.5410), 4326), 'Route de l''Hôpital Donka', ARRAY['/uploads/test_photo.jpg'], 'high');
