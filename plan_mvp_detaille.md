# PLAN MVP DÉTAILLÉ
## Application de Cartographie de Camayenne - Développement 2 Jours

---

## OBJECTIF DU MVP

Créer une application web progressive (PWA) fonctionnelle permettant :
- ✅ Visualisation de la carte OSM de Camayenne
- ✅ Géolocalisation en temps réel
- ✅ Recherche de lieux
- ✅ Calcul d'itinéraires
- ✅ Signalement de problèmes urbains
- ✅ Interface responsive (mobile + desktop)

**Délai** : 2 jours (16 heures de développement)
**Livrable** : Application déployée et fonctionnelle

---

## ARCHITECTURE TECHNIQUE CHOISIE

### Stack technologique

**Frontend (PWA)**
- React 18.2.0
- Leaflet.js 1.9.4 (cartographie)
- React Leaflet 4.2.1 (wrapper React pour Leaflet)
- Axios 1.6.0 (requêtes HTTP)
- React Router 6.20.0 (navigation)
- Tailwind CSS 3.3.0 (styling)

**Backend**
- Node.js 18+ avec Express.js 4.18.2
- PostgreSQL 14+ avec PostGIS 3.0+
- JWT pour authentification (simplifié pour MVP)
- Multer 1.4.5 (upload fichiers)
- CORS

**APIs externes**
- OpenStreetMap tiles : `https://tile.openstreetmap.org/{z}/{x}/{y}.png`
- Nominatim (geocoding) : `https://nominatim.openstreetmap.org/`
- OSRM (routing) : `http://router.project-osrm.org/`

**Outils**
- Git + GitHub
- VS Code
- Postman (test API)
- pgAdmin (gestion BDD)

---

## PRÉREQUIS AVANT DÉMARRAGE

### Installation nécessaire

```bash
# Node.js et npm
node --version  # v18+
npm --version   # v9+

# PostgreSQL et PostGIS
psql --version  # v14+

# Git
git --version

# VS Code (ou autre IDE)
```

### Création comptes (si besoin déploiement)
- GitHub account
- Vercel account (déploiement frontend gratuit)
- Railway account (déploiement backend gratuit)

---

## JOUR 1 : INFRASTRUCTURE ET FONCTIONNALITÉS DE BASE

### 📅 JOUR 1 - MATIN (08h00 - 12h00) - 4 heures

#### ⏰ 08h00 - 09h00 | Setup environnement (1h)

**Tâches**

1. **Initialiser le projet**
```bash
# Créer dossier projet
mkdir camayenne-map
cd camayenne-map

# Initialiser Git
git init
echo "node_modules/" > .gitignore
echo ".env" >> .gitignore
git add .
git commit -m "Initial commit"

# Créer repo GitHub
gh repo create camayenne-map --public --source=.
git push -u origin main
```

2. **Setup Frontend**
```bash
# Créer app React
npx create-react-app frontend
cd frontend

# Installer dépendances
npm install leaflet react-leaflet
npm install axios react-router-dom
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Configurer Tailwind (tailwind.config.js)
# content: ["./src/**/*.{js,jsx,ts,tsx}"]
```

3. **Setup Backend**
```bash
# Retour racine projet
cd ..
mkdir backend
cd backend

# Initialiser npm
npm init -y

# Installer dépendances
npm install express cors dotenv
npm install pg
npm install multer
npm install jsonwebtoken bcrypt
npm install nodemon --save-dev

# Créer structure
mkdir src
mkdir src/routes
mkdir src/controllers
mkdir src/models
mkdir src/middleware
mkdir uploads
```

4. **Setup Base de données PostgreSQL**
```bash
# Se connecter à PostgreSQL
psql -U postgres

# Créer base de données
CREATE DATABASE camayenne_map;
\c camayenne_map

# Activer extension PostGIS
CREATE EXTENSION postgis;

# Vérifier installation
SELECT PostGIS_version();
```

5. **Configuration fichiers environnement**

**backend/.env**
```env
PORT=5000
DATABASE_URL=postgresql://postgres:password@localhost:5432/camayenne_map
JWT_SECRET=votre_secret_jwt_ultra_securise_ici
NODE_ENV=development
```

**frontend/.env**
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_OSM_TILES=https://tile.openstreetmap.org/{z}/{x}/{y}.png
```

**✅ Checkpoint 09h00** : Environnement prêt, dépendances installées

---

#### ⏰ 09h00 - 10h30 | Création base de données (1h30)

**Tâches**

1. **Créer schéma de base de données**

```sql
-- Fichier: backend/src/database/schema.sql

-- Table users (authentification simplifiée pour MVP)
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Table places (lieux)
CREATE TABLE places (
    id SERIAL PRIMARY KEY,
    osm_id BIGINT,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    description TEXT,
    address TEXT,
    phone VARCHAR(20),
    location GEOGRAPHY(POINT, 4326) NOT NULL,
    photos TEXT[],
    rating DECIMAL(2,1) DEFAULT 0,
    source VARCHAR(50) DEFAULT 'osm',
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_places_location ON places USING GIST(location);
CREATE INDEX idx_places_category ON places(category);

-- Table incidents (signalements)
CREATE TABLE incidents (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    status VARCHAR(50) DEFAULT 'new',
    location GEOGRAPHY(POINT, 4326) NOT NULL,
    address TEXT,
    photos TEXT[] NOT NULL,
    priority VARCHAR(20) DEFAULT 'normal',
    reported_by INT REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_incidents_location ON incidents USING GIST(location);
CREATE INDEX idx_incidents_status ON incidents(status);

-- Table favorites (favoris)
CREATE TABLE favorites (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    place_id INT REFERENCES places(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, place_id)
);

-- Table osm_cache (cache données OSM)
CREATE TABLE osm_cache (
    id SERIAL PRIMARY KEY,
    osm_type VARCHAR(20),
    osm_id BIGINT NOT NULL,
    tags JSONB,
    geometry GEOGRAPHY(GEOMETRY, 4326),
    cached_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(osm_type, osm_id)
);

CREATE INDEX idx_osm_cache_geometry ON osm_cache USING GIST(geometry);
```

2. **Exécuter le schéma**
```bash
psql -U postgres -d camayenne_map -f backend/src/database/schema.sql
```

3. **Créer données de test**

```sql
-- Fichier: backend/src/database/seed.sql

-- Insérer quelques lieux de test à Camayenne
INSERT INTO places (name, category, address, location, rating) VALUES
('Pharmacie Kaloum', 'health', 'Avenue de la République, Camayenne', 
 ST_SetSRID(ST_MakePoint(-13.6785, 9.5370), 4326), 4.5),
('Restaurant Le Palmier', 'restaurant', 'Rue KA 028, Camayenne', 
 ST_SetSRID(ST_MakePoint(-13.6795, 9.5360), 4326), 4.2),
('École Primaire Camayenne', 'education', 'Quartier Camayenne Centre', 
 ST_SetSRID(ST_MakePoint(-13.6800, 9.5150), 4326), 4.0),
('Marché Madina', 'commerce', 'Quartier Madina, Camayenne', 
 ST_SetSRID(ST_MakePoint(-13.6820, 9.5180), 4326), 3.8),
('Hôpital Ignace Deen', 'health', 'Boulevard du Commerce, Conakry', 
 ST_SetSRID(ST_MakePoint(-13.6900, 9.5100), 4326), 4.3);

-- Insérer un utilisateur de test
INSERT INTO users (username, email, password_hash) VALUES
('testuser', 'test@example.com', '$2b$10$abcdefghijklmnopqrstuvwxyz1234567890');
```

```bash
psql -U postgres -d camayenne_map -f backend/src/database/seed.sql
```

**✅ Checkpoint 10h30** : Base de données créée et peuplée avec données de test

---

#### ⏰ 10h30 - 12h00 | Backend API de base (1h30)

**Tâches**

1. **Créer serveur Express**

**backend/src/server.js**
```javascript
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/places', require('./routes/places'));
app.use('/api/search', require('./routes/search'));
app.use('/api/incidents', require('./routes/incidents'));
app.use('/api/routes', require('./routes/routing'));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

2. **Configuration base de données**

**backend/src/config/database.js**
```javascript
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};
```

3. **Routes Places (lieux)**

**backend/src/routes/places.js**
```javascript
const express = require('express');
const router = express.Router();
const db = require('../config/database');

// GET all places
router.get('/', async (req, res) => {
  try {
    const { category, lat, lon, radius = 5000 } = req.query;
    
    let query = `
      SELECT 
        id, 
        name, 
        category, 
        address, 
        phone,
        rating,
        ST_X(location::geometry) as longitude,
        ST_Y(location::geometry) as latitude,
        photos
      FROM places
    `;
    
    const params = [];
    const conditions = [];
    
    if (category) {
      conditions.push(`category = $${params.length + 1}`);
      params.push(category);
    }
    
    if (lat && lon) {
      conditions.push(`
        ST_DWithin(
          location,
          ST_SetSRID(ST_MakePoint($${params.length + 1}, $${params.length + 2}), 4326)::geography,
          $${params.length + 3}
        )
      `);
      params.push(lon, lat, radius);
    }
    
    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }
    
    query += ' ORDER BY rating DESC LIMIT 50';
    
    const result = await db.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching places:', error);
    res.status(500).json({ error: 'Failed to fetch places' });
  }
});

// GET single place
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query(`
      SELECT 
        id, name, category, description, address, phone, rating, photos,
        ST_X(location::geometry) as longitude,
        ST_Y(location::geometry) as latitude
      FROM places WHERE id = $1
    `, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Place not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching place:', error);
    res.status(500).json({ error: 'Failed to fetch place' });
  }
});

module.exports = router;
```

4. **Routes Search (recherche)**

**backend/src/routes/search.js**
```javascript
const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Search places
router.get('/', async (req, res) => {
  try {
    const { q, lat, lon, limit = 20 } = req.query;
    
    if (!q) {
      return res.status(400).json({ error: 'Query parameter required' });
    }
    
    let query = `
      SELECT 
        id, name, category, address, rating, photos,
        ST_X(location::geometry) as longitude,
        ST_Y(location::geometry) as latitude
    `;
    
    if (lat && lon) {
      query += `,
        ST_Distance(
          location,
          ST_SetSRID(ST_MakePoint($2, $3), 4326)::geography
        ) as distance
      `;
    }
    
    query += `
      FROM places
      WHERE 
        name ILIKE $1 
        OR category ILIKE $1 
        OR address ILIKE $1
    `;
    
    if (lat && lon) {
      query += ' ORDER BY distance ASC';
    } else {
      query += ' ORDER BY rating DESC';
    }
    
    query += ` LIMIT $${lat && lon ? 4 : 2}`;
    
    const params = [`%${q}%`];
    if (lat && lon) {
      params.push(lon, lat);
    }
    params.push(limit);
    
    const result = await db.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Error searching places:', error);
    res.status(500).json({ error: 'Search failed' });
  }
});

module.exports = router;
```

5. **Routes Incidents (signalements)**

**backend/src/routes/incidents.js**
```javascript
const express = require('express');
const router = express.Router();
const multer = require('multer');
const db = require('../config/database');
const path = require('path');

// Configuration upload fichiers
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only image files are allowed'));
  }
});

// GET all incidents
router.get('/', async (req, res) => {
  try {
    const { status, category } = req.query;
    
    let query = `
      SELECT 
        id, title, description, category, status, priority, address, photos,
        ST_X(location::geometry) as longitude,
        ST_Y(location::geometry) as latitude,
        created_at
      FROM incidents
    `;
    
    const params = [];
    const conditions = [];
    
    if (status) {
      conditions.push(`status = $${params.length + 1}`);
      params.push(status);
    }
    
    if (category) {
      conditions.push(`category = $${params.length + 1}`);
      params.push(category);
    }
    
    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }
    
    query += ' ORDER BY created_at DESC LIMIT 100';
    
    const result = await db.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching incidents:', error);
    res.status(500).json({ error: 'Failed to fetch incidents' });
  }
});

// POST new incident
router.post('/', upload.array('photos', 5), async (req, res) => {
  try {
    const { title, description, category, priority, latitude, longitude, address } = req.body;
    
    if (!title || !description || !category || !latitude || !longitude) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'At least one photo is required' });
    }
    
    const photos = req.files.map(file => `/uploads/${file.filename}`);
    
    const result = await db.query(`
      INSERT INTO incidents (title, description, category, priority, location, address, photos)
      VALUES ($1, $2, $3, $4, ST_SetSRID(ST_MakePoint($5, $6), 4326), $7, $8)
      RETURNING id, title, status, created_at
    `, [title, description, category, priority || 'normal', longitude, latitude, address, photos]);
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating incident:', error);
    res.status(500).json({ error: 'Failed to create incident' });
  }
});

module.exports = router;
```

6. **Routes Auth (authentification simplifiée)**

**backend/src/routes/auth.js**
```javascript
const express = require('express');
const router = express.Router();

// Pour MVP, authentification ultra-simplifiée
// En production, utiliser bcrypt et JWT proprement

router.post('/login', (req, res) => {
  const { email, password } = req.body;
  
  // Mock login pour MVP
  if (email && password) {
    res.json({ 
      token: 'mock_token_for_mvp',
      user: { email, username: 'testuser' }
    });
  } else {
    res.status(400).json({ error: 'Invalid credentials' });
  }
});

router.post('/register', (req, res) => {
  res.json({ message: 'Registration endpoint - to be implemented' });
});

module.exports = router;
```

7. **Routes Routing (calcul itinéraires)**

**backend/src/routes/routing.js**
```javascript
const express = require('express');
const router = express.Router();
const axios = require('axios');

// Calcul itinéraire via OSRM
router.get('/', async (req, res) => {
  try {
    const { start, end, mode = 'driving' } = req.query;
    
    if (!start || !end) {
      return res.status(400).json({ error: 'Start and end coordinates required' });
    }
    
    // Format: longitude,latitude
    const osrmUrl = `http://router.project-osrm.org/route/v1/${mode}/${start};${end}`;
    const params = {
      overview: 'full',
      geometries: 'geojson',
      steps: true
    };
    
    const response = await axios.get(osrmUrl, { params });
    
    if (response.data.code !== 'Ok') {
      return res.status(404).json({ error: 'No route found' });
    }
    
    const route = response.data.routes[0];
    
    res.json({
      distance: route.distance, // meters
      duration: route.duration, // seconds
      geometry: route.geometry,
      steps: route.legs[0].steps.map(step => ({
        instruction: step.maneuver.instruction || `${step.maneuver.type}`,
        distance: step.distance,
        duration: step.duration
      }))
    });
  } catch (error) {
    console.error('Routing error:', error);
    res.status(500).json({ error: 'Routing failed' });
  }
});

module.exports = router;
```

8. **Lancer le serveur**

**backend/package.json** (ajouter dans scripts)
```json
"scripts": {
  "start": "node src/server.js",
  "dev": "nodemon src/server.js"
}
```

```bash
cd backend
npm run dev
```

**✅ Checkpoint 12h00** : API backend fonctionnelle avec endpoints de base

---

### 📅 JOUR 1 - APRÈS-MIDI (13h00 - 17h00) - 4 heures

#### ⏰ 13h00 - 17h00 | Frontend carte de base (4h)

**Tâches**

1. **Configuration Tailwind CSS**

**frontend/tailwind.config.js**
```javascript
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2196F3',
        secondary: '#4CAF50',
        accent: '#FF9800',
        error: '#F44336',
      },
    },
  },
  plugins: [],
}
```

**frontend/src/index.css**
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  margin: 0;
  font-family: 'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.leaflet-container {
  width: 100%;
  height: 100%;
}
```

2. **Créer composant Map**

**frontend/src/components/Map.jsx**
```javascript
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix pour icônes Leaflet dans React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Composant pour recentrer carte sur position
function LocationMarker({ position, setPosition }) {
  const map = useMap();

  useEffect(() => {
    map.locate().on('locationfound', (e) => {
      setPosition(e.latlng);
      map.flyTo(e.latlng, 15);
    });
  }, [map, setPosition]);

  return position === null ? null : (
    <Marker position={position}>
      <Popup>Vous êtes ici</Popup>
    </Marker>
  );
}

function Map({ places = [], incidents = [], onMarkerClick }) {
  const [position, setPosition] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  
  // Centre par défaut : Camayenne
  const defaultCenter = [9.5150, -13.6800];
  const center = position || defaultCenter;

  // Icônes personnalisées pour différents types
  const placeIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  const incidentIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  return (
    <div className="h-screen w-full">
      <MapContainer 
        center={center} 
        zoom={14} 
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <LocationMarker position={userLocation} setPosition={setUserLocation} />
        
        {/* Marqueurs des lieux */}
        {places.map((place) => (
          <Marker
            key={place.id}
            position={[place.latitude, place.longitude]}
            icon={placeIcon}
            eventHandlers={{
              click: () => onMarkerClick && onMarkerClick(place, 'place')
            }}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-bold text-lg">{place.name}</h3>
                <p className="text-sm text-gray-600">{place.category}</p>
                <p className="text-sm">{place.address}</p>
                {place.rating && (
                  <p className="text-sm text-yellow-600">⭐ {place.rating}</p>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
        
        {/* Marqueurs des incidents */}
        {incidents.map((incident) => (
          <Marker
            key={incident.id}
            position={[incident.latitude, incident.longitude]}
            icon={incidentIcon}
            eventHandlers={{
              click: () => onMarkerClick && onMarkerClick(incident, 'incident')
            }}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-bold text-lg">{incident.title}</h3>
                <p className="text-sm text-gray-600">{incident.category}</p>
                <p className="text-sm">{incident.description}</p>
                <span className={`text-xs px-2 py-1 rounded ${
                  incident.status === 'new' ? 'bg-orange-200 text-orange-800' :
                  incident.status === 'in_progress' ? 'bg-blue-200 text-blue-800' :
                  'bg-green-200 text-green-800'
                }`}>
                  {incident.status}
                </span>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

export default Map;
```

3. **Créer composant SearchBar**

**frontend/src/components/SearchBar.jsx**
```javascript
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

function SearchBar({ onResultSelect, userLocation }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      return;
    }

    const delaySearch = setTimeout(async () => {
      setLoading(true);
      try {
        const params = { q: query };
        if (userLocation) {
          params.lat = userLocation.lat;
          params.lon = userLocation.lng;
        }
        
        const response = await axios.get(`${API_URL}/search`, { params });
        setResults(response.data);
        setShowResults(true);
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(delaySearch);
  }, [query, userLocation]);

  const handleSelect = (result) => {
    onResultSelect(result);
    setQuery('');
    setShowResults(false);
  };

  return (
    <div className="relative w-full max-w-md">
      <div className="flex items-center bg-gray-100 rounded-full px-4 py-3 shadow-md">
        <svg className="w-5 h-5 text-gray-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          placeholder="Rechercher un lieu..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => results.length > 0 && setShowResults(true)}
          className="flex-1 bg-transparent outline-none text-gray-800"
        />
        {query && (
          <button onClick={() => { setQuery(''); setResults([]); }} className="text-gray-500">
            ✕
          </button>
        )}
      </div>

      {showResults && results.length > 0 && (
        <div className="absolute top-full mt-2 w-full bg-white rounded-lg shadow-lg max-h-96 overflow-y-auto z-50">
          {loading && <div className="p-4 text-center text-gray-500">Recherche...</div>}
          {results.map((result) => (
            <div
              key={result.id}
              onClick={() => handleSelect(result)}
              className="p-4 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
            >
              <h4 className="font-semibold text-gray-800">{result.name}</h4>
              <p className="text-sm text-gray-600">{result.category}</p>
              <p className="text-sm text-gray-500">{result.address}</p>
              {result.distance && (
                <p className="text-xs text-blue-600 mt-1">
                  📍 {(result.distance / 1000).toFixed(1)} km
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SearchBar;
```

4. **Créer composant BottomNavigation**

**frontend/src/components/BottomNavigation.jsx**
```javascript
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function BottomNavigation() {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { path: '/', icon: '🗺️', label: 'Carte' },
    { path: '/favorites', icon: '⭐', label: 'Favoris' },
    { path: '/report', icon: '🚨', label: 'Signaler' },
    { path: '/profile', icon: '👤', label: 'Profil' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg md:hidden">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center justify-center flex-1 h-full ${
                isActive ? 'text-primary' : 'text-gray-500'
              }`}
            >
              <span className="text-2xl">{item.icon}</span>
              <span className="text-xs mt-1">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

export default BottomNavigation;
```

5. **Créer page principale (Home)**

**frontend/src/pages/Home.jsx**
```javascript
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Map from '../components/Map';
import SearchBar from '../components/SearchBar';
import BottomNavigation from '../components/BottomNavigation';

const API_URL = process.env.REACT_APP_API_URL;

function Home() {
  const [places, setPlaces] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    // Récupérer géolocalisation
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => console.error('Geolocation error:', error)
      );
    }

    // Charger places et incidents
    fetchPlaces();
    fetchIncidents();
  }, []);

  const fetchPlaces = async () => {
    try {
      const response = await axios.get(`${API_URL}/places`);
      setPlaces(response.data);
    } catch (error) {
      console.error('Error fetching places:', error);
    }
  };

  const fetchIncidents = async () => {
    try {
      const response = await axios.get(`${API_URL}/incidents`);
      setIncidents(response.data);
    } catch (error) {
      console.error('Error fetching incidents:', error);
    }
  };

  const handleMarkerClick = (item, type) => {
    setSelectedItem({ ...item, type });
  };

  const handleSearchSelect = (result) => {
    setSelectedItem({ ...result, type: 'place' });
  };

  return (
    <div className="relative h-screen">
      {/* Header avec recherche */}
      <div className="absolute top-0 left-0 right-0 z-10 p-4 bg-white/95 shadow-md">
        <SearchBar onResultSelect={handleSearchSelect} userLocation={userLocation} />
      </div>

      {/* Carte */}
      <Map 
        places={places} 
        incidents={incidents}
        onMarkerClick={handleMarkerClick}
      />

      {/* Bottom navigation */}
      <BottomNavigation />
    </div>
  );
}

export default Home;
```

6. **Créer page Signalement**

**frontend/src/pages/ReportIncident.jsx**
```javascript
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL;

function ReportIncident() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'road',
    priority: 'normal',
    latitude: null,
    longitude: null,
  });
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(false);

  // Obtenir position au chargement
  useState(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setFormData(prev => ({
          ...prev,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        }));
      });
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (photos.length === 0) {
      alert('Au moins une photo est requise');
      return;
    }

    setLoading(true);
    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => {
        data.append(key, formData[key]);
      });
      photos.forEach(photo => {
        data.append('photos', photo);
      });

      await axios.post(`${API_URL}/incidents`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      alert('Signalement envoyé avec succès !');
      navigate('/');
    } catch (error) {
      console.error('Error submitting incident:', error);
      alert('Erreur lors de l\'envoi du signalement');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white shadow-sm p-4 sticky top-0 z-10">
        <button onClick={() => navigate('/')} className="text-primary">
          ← Retour
        </button>
        <h1 className="text-xl font-bold text-center">Signaler un problème</h1>
      </div>

      <form onSubmit={handleSubmit} className="p-4 max-w-2xl mx-auto">
        {/* Catégorie */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Catégorie *
          </label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({...formData, category: e.target.value})}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
            required
          >
            <option value="road">🚧 Problème de voirie</option>
            <option value="lighting">💡 Éclairage public</option>
            <option value="waste">🗑️ Déchets / Insalubrité</option>
            <option value="water">💧 Eau / Assainissement</option>
            <option value="signage">🚦 Signalisation</option>
            <option value="other">⚠️ Autre</option>
          </select>
        </div>

        {/* Titre */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Titre *
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            placeholder="Résumez le problème"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
            required
            minLength={10}
          />
        </div>

        {/* Description */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description *
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            placeholder="Décrivez le problème en détail"
            rows={4}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
            required
            minLength={20}
          />
        </div>

        {/* Photos */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Photos * (min 1, max 5)
          </label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => setPhotos(Array.from(e.target.files).slice(0, 5))}
            className="w-full p-3 border border-gray-300 rounded-lg"
            required
          />
          {photos.length > 0 && (
            <p className="text-sm text-gray-600 mt-2">{photos.length} photo(s) sélectionnée(s)</p>
          )}
        </div>

        {/* Priorité */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Priorité
          </label>
          <div className="flex gap-4">
            {['low', 'normal', 'high'].map(priority => (
              <label key={priority} className="flex items-center">
                <input
                  type="radio"
                  value={priority}
                  checked={formData.priority === priority}
                  onChange={(e) => setFormData({...formData, priority: e.target.value})}
                  className="mr-2"
                />
                <span className="capitalize">{priority}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Bouton submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary text-white py-4 rounded-lg font-semibold hover:bg-blue-600 disabled:bg-gray-400"
        >
          {loading ? 'Envoi en cours...' : 'ENVOYER LE SIGNALEMENT'}
        </button>
      </form>
    </div>
  );
}

export default ReportIncident;
```

7. **Configuration App et Routes**

**frontend/src/App.js**
```javascript
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ReportIncident from './pages/ReportIncident';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/report" element={<ReportIncident />} />
        <Route path="/favorites" element={<div className="p-4">Favoris - À implémenter</div>} />
        <Route path="/profile" element={<div className="p-4">Profil - À implémenter</div>} />
      </Routes>
    </Router>
  );
}

export default App;
```

8. **Lancer l'application**

```bash
cd frontend
npm start
```

**✅ Checkpoint 17h00** : Application frontend fonctionnelle avec carte, recherche, et signalement

---

## JOUR 2 : FONCTIONNALITÉS AVANCÉES ET FINALISATION

### 📅 JOUR 2 - MATIN (08h00 - 12h00) - 4 heures

#### ⏰ 08h00 - 10h00 | Itinéraires et navigation (2h)

**Tâches**

1. **Créer composant RoutePlanner**

**frontend/src/components/RoutePlanner.jsx**
```javascript
import React, { useState } from 'react';
import { Polyline, useMap } from 'react-leaflet';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

function RoutePlanner({ start, end, onRouteCalculated }) {
  const [route, setRoute] = useState(null);
  const [mode, setMode] = useState('driving');
  const [loading, setLoading] = useState(false);
  const map = useMap();

  const calculateRoute = async () => {
    if (!start || !end) return;

    setLoading(true);
    try {
      const startCoords = `${start.lng},${start.lat}`;
      const endCoords = `${end.lng},${end.lat}`;
      
      const response = await axios.get(`${API_URL}/routes`, {
        params: { start: startCoords, end: endCoords, mode }
      });

      setRoute(response.data);
      onRouteCalculated && onRouteCalculated(response.data);

      // Fit bounds pour voir tout l'itinéraire
      if (response.data.geometry && response.data.geometry.coordinates) {
        const coords = response.data.geometry.coordinates.map(coord => [coord[1], coord[0]]);
        const bounds = coords.reduce((bounds, coord) => {
          return bounds.extend(coord);
        }, L.latLngBounds(coords[0], coords[0]));
        map.fitBounds(bounds, { padding: [50, 50] });
      }
    } catch (error) {
      console.error('Route calculation error:', error);
      alert('Impossible de calculer l\'itinéraire');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (start && end) {
      calculateRoute();
    }
  }, [start, end, mode]);

  if (!route) return null;

  const pathCoordinates = route.geometry.coordinates.map(coord => [coord[1], coord[0]]);

  return (
    <>
      <Polyline positions={pathCoordinates} color="blue" weight={5} opacity={0.7} />
      
      <div className="absolute bottom-24 left-4 right-4 bg-white p-4 rounded-lg shadow-lg z-[1000]">
        <div className="flex gap-2 mb-3">
          <button
            onClick={() => setMode('driving')}
            className={`flex-1 py-2 rounded ${mode === 'driving' ? 'bg-primary text-white' : 'bg-gray-200'}`}
          >
            🚗 Voiture
          </button>
          <button
            onClick={() => setMode('walking')}
            className={`flex-1 py-2 rounded ${mode === 'walking' ? 'bg-primary text-white' : 'bg-gray-200'}`}
          >
            🚶 Marche
          </button>
        </div>
        
        <div className="space-y-2 text-sm">
          <p className="font-semibold">
            📏 Distance: {(route.distance / 1000).toFixed(1)} km
          </p>
          <p className="font-semibold">
            ⏱️ Durée: {Math.round(route.duration / 60)} minutes
          </p>
        </div>

        <button
          onClick={() => alert('Navigation guidée - À implémenter')}
          className="w-full mt-3 bg-primary text-white py-3 rounded-lg font-semibold"
        >
          DÉMARRER LA NAVIGATION
        </button>
      </div>
    </>
  );
}

export default RoutePlanner;
```

2. **Intégrer RoutePlanner dans Map**

Modifier **frontend/src/components/Map.jsx** pour ajouter :

```javascript
import RoutePlanner from './RoutePlanner';

// Dans le composant Map, ajouter états :
const [routeStart, setRouteStart] = useState(null);
const [routeEnd, setRouteEnd] = useState(null);

// Dans le return, après les Markers :
{routeStart && routeEnd && (
  <RoutePlanner 
    start={routeStart} 
    end={routeEnd}
    onRouteCalculated={(route) => console.log('Route:', route)}
  />
)}
```

**✅ Checkpoint 10h00** : Calcul et affichage d'itinéraires fonctionnels

---

#### ⏰ 10h00 - 12h00 | Amélioration système de signalement (2h)

**Tâches**

1. **Améliorer l'interface de signalement**

Modifier **frontend/src/pages/ReportIncident.jsx** pour ajouter :
- Preview des photos
- Carte pour ajuster la position
- Validation en temps réel

```javascript
// Ajouter après le champ photos :

{/* Preview photos */}
{photos.length > 0 && (
  <div className="grid grid-cols-3 gap-2 mt-2">
    {photos.map((photo, index) => (
      <div key={index} className="relative">
        <img 
          src={URL.createObjectURL(photo)} 
          alt={`Preview ${index + 1}`}
          className="w-full h-24 object-cover rounded"
        />
        <button
          type="button"
          onClick={() => setPhotos(photos.filter((_, i) => i !== index))}
          className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 text-xs"
        >
          ✕
        </button>
      </div>
    ))}
  </div>
)}

{/* Localisation */}
<div className="mb-4">
  <label className="block text-sm font-medium text-gray-700 mb-2">
    Localisation
  </label>
  <div className="p-3 bg-gray-100 rounded-lg">
    {formData.latitude && formData.longitude ? (
      <>
        <p className="text-sm">📍 Position détectée</p>
        <p className="text-xs text-gray-600">
          {formData.latitude.toFixed(4)}, {formData.longitude.toFixed(4)}
        </p>
      </>
    ) : (
      <p className="text-sm text-gray-500">Détection en cours...</p>
    )}
  </div>
</div>
```

2. **Créer page de confirmation**

**frontend/src/pages/IncidentConfirmation.jsx**
```javascript
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function IncidentConfirmation() {
  const navigate = useNavigate();
  const location = useLocation();
  const incidentId = location.state?.incidentId;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-8 max-w-md w-full text-center shadow-lg">
        <div className="text-6xl mb-4">✅</div>
        <h1 className="text-2xl font-bold mb-4">Signalement envoyé !</h1>
        {incidentId && (
          <p className="text-gray-600 mb-2">
            Numéro de suivi: <span className="font-mono font-bold">#{incidentId}</span>
          </p>
        )}
        <p className="text-gray-600 mb-6">
          Vous serez notifié des mises à jour sur ce signalement.
        </p>
        
        <div className="space-y-3">
          <button
            onClick={() => navigate('/')}
            className="w-full bg-primary text-white py-3 rounded-lg font-semibold"
          >
            VOIR SUR LA CARTE
          </button>
          <button
            onClick={() => navigate('/report')}
            className="w-full border border-primary text-primary py-3 rounded-lg font-semibold"
          >
            FAIRE UN AUTRE SIGNALEMENT
          </button>
        </div>
      </div>
    </div>
  );
}

export default IncidentConfirmation;
```

**✅ Checkpoint 12h00** : Système de signalement complet et amélioré

---

### 📅 JOUR 2 - APRÈS-MIDI (13h00 - 17h00) - 4 heures

#### ⏰ 13h00 - 15h00 | Tests et corrections (2h)

**Tâches**

1. **Tests fonctionnels manuels**

Créer une checklist de tests :

```markdown
# Checklist Tests MVP

## Carte
- [ ] Carte s'affiche correctement
- [ ] Géolocalisation fonctionne
- [ ] Zoom +/- opérationnel
- [ ] Marqueurs lieux visibles
- [ ] Marqueurs signalements visibles
- [ ] Popup au clic sur marqueur

## Recherche
- [ ] Barre de recherche réactive
- [ ] Autocomplétion fonctionne
- [ ] Résultats pertinents affichés
- [ ] Clic sur résultat centre la carte
- [ ] Distance calculée si géoloc active

## Itinéraires
- [ ] Calcul itinéraire fonctionne
- [ ] Modes voiture/marche disponibles
- [ ] Tracé visible sur carte
- [ ] Distance et durée affichées
- [ ] Instructions disponibles

## Signalement
- [ ] Formulaire accessible
- [ ] Upload photo fonctionne
- [ ] Géolocalisation auto
- [ ] Validation champs obligatoires
- [ ] Envoi réussi
- [ ] Confirmation affichée
- [ ] Nouveau marqueur visible

## Responsive
- [ ] Mobile (375px) OK
- [ ] Tablette (768px) OK
- [ ] Desktop (1024px+) OK
- [ ] Navigation bottom bar mobile
- [ ] Sidebar desktop

## Performance
- [ ] Chargement < 3s
- [ ] Pas de freeze
- [ ] Smooth scroll/zoom
```

2. **Corriger bugs identifiés**

Exemples de bugs courants à vérifier :
- Marqueurs qui ne s'affichent pas
- Erreurs CORS
- Photos qui ne s'uploadent pas
- Géolocalisation refusée
- Carte vide au chargement

3. **Optimisations**

```javascript
// Ajouter loading states
const [loading, setLoading] = useState(true);

// Gérer erreurs réseau
try {
  // API call
} catch (error) {
  setError(error.message);
  toast.error('Une erreur est survenue');
}

// Lazy loading composants
const Map = React.lazy(() => import('./components/Map'));
```

**✅ Checkpoint 15h00** : Bugs majeurs corrigés, app stable

---

#### ⏰ 15h00 - 17h00 | Documentation et déploiement (2h)

**Tâches**

1. **Créer README.md**

**README.md**
```markdown
# Camayenne Map

Application de cartographie interactive pour Camayenne, Conakry, Guinée.

## Fonctionnalités

- 🗺️ Carte interactive basée sur OpenStreetMap
- 📍 Géolocalisation en temps réel
- 🔍 Recherche de lieux et commerces
- 🧭 Calcul d'itinéraires (voiture, marche)
- 🚨 Signalement de problèmes urbains
- 📱 Interface responsive (mobile + desktop)

## Technologies

### Frontend
- React 18
- Leaflet.js
- Tailwind CSS
- Axios

### Backend
- Node.js + Express
- PostgreSQL + PostGIS
- Multer (upload fichiers)

### APIs externes
- OpenStreetMap (tiles)
- Nominatim (geocoding)
- OSRM (routing)

## Installation

### Prérequis
- Node.js 18+
- PostgreSQL 14+ avec PostGIS
- npm ou yarn

### Backend

\`\`\`bash
cd backend
npm install
cp .env.example .env
# Configurer DATABASE_URL dans .env
npm run dev
\`\`\`

### Frontend

\`\`\`bash
cd frontend
npm install
cp .env.example .env
# Configurer REACT_APP_API_URL dans .env
npm start
\`\`\`

### Base de données

\`\`\`bash
createdb camayenne_map
psql -d camayenne_map -c "CREATE EXTENSION postgis;"
psql -d camayenne_map -f backend/src/database/schema.sql
psql -d camayenne_map -f backend/src/database/seed.sql
\`\`\`

## Utilisation

1. Ouvrir http://localhost:3000
2. Autoriser la géolocalisation
3. Explorer la carte de Camayenne
4. Rechercher des lieux
5. Calculer des itinéraires
6. Signaler des problèmes

## Déploiement

### Frontend (Vercel)
\`\`\`bash
cd frontend
vercel --prod
\`\`\`

### Backend (Railway)
\`\`\`bash
cd backend
railway up
\`\`\`

## Licence

MIT

## Contact

Pour questions ou suggestions : contact@example.com
```

2. **Créer documentation API**

**backend/API.md**
```markdown
# API Documentation

Base URL: `http://localhost:5000/api`

## Endpoints

### Places

**GET /places**
Récupérer la liste des lieux

Query params:
- `category` (optionnel): Filtrer par catégorie
- `lat`, `lon` (optionnel): Centre de recherche
- `radius` (optionnel, défaut 5000): Rayon en mètres

**GET /places/:id**
Récupérer un lieu spécifique

### Search

**GET /search**
Rechercher des lieux

Query params:
- `q` (requis): Terme de recherche
- `lat`, `lon` (optionnel): Pour tri par distance
- `limit` (optionnel, défaut 20): Nombre de résultats

### Incidents

**GET /incidents**
Récupérer la liste des signalements

Query params:
- `status` (optionnel): new, in_progress, resolved
- `category` (optionnel): road, lighting, waste, etc.

**POST /incidents**
Créer un nouveau signalement

Body (multipart/form-data):
- `title` (requis): Titre
- `description` (requis): Description
- `category` (requis): Catégorie
- `latitude`, `longitude` (requis): Coordonnées
- `priority` (optionnel): low, normal, high
- `photos` (requis): 1-5 fichiers images

### Routes

**GET /routes**
Calculer un itinéraire

Query params:
- `start` (requis): "longitude,latitude"
- `end` (requis): "longitude,latitude"
- `mode` (optionnel, défaut driving): driving, walking, cycling

Response:
\`\`\`json
{
  "distance": 1234,
  "duration": 567,
  "geometry": {...},
  "steps": [...]
}
\`\`\`
```

3. **Déployer l'application**

**Déploiement Frontend sur Vercel**
```bash
cd frontend

# Installer Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel --prod

# Configurer variables d'environnement sur vercel.com
# REACT_APP_API_URL = https://your-backend.railway.app/api
```

**Déploiement Backend sur Railway**
```bash
cd backend

# Installer Railway CLI
npm install -g @railway/cli

# Login
railway login

# Init projet
railway init

# Deploy
railway up

# Ajouter PostgreSQL
railway add postgresql

# Configurer variables d'environnement
railway variables set PORT=5000
railway variables set JWT_SECRET=your_secret
```

4. **Tests finaux en production**

Vérifier :
- [ ] App accessible publiquement
- [ ] HTTPS activé
- [ ] API fonctionne
- [ ] Upload photos OK
- [ ] Pas d'erreurs console
- [ ] Performance acceptable

**✅ Checkpoint 17h00** : Application déployée et documentée

---

## LIVRABLES FINAUX

### Code source
- Repository GitHub avec code frontend + backend
- Documentation README.md
- Documentation API
- Fichiers .env.example

### Application déployée
- Frontend : https://camayenne-map.vercel.app
- Backend API : https://camayenne-map-api.railway.app

### Documentation
- Cahier des charges
- Maquettes détaillées
- Plan MVP (ce document)
- Guide d'installation
- Documentation API

---

## POST-MVP : PROCHAINES ÉTAPES

### Semaine 1 après MVP
- Authentification complète (JWT, bcrypt)
- Système d'avis et notes
- Gestion favoris
- Dashboard utilisateur

### Semaine 2
- Application mobile native (React Native)
- Notifications push
- Mode hors-ligne
- Amélioration UI/UX

### Mois 1
- Dashboard administrateur
- Modération signalements
- Analytics
- Optimisations performance

### Mois 2-3
- Gamification (badges, points)
- Partage social
- API publique
- Expansion autres quartiers

---

## MÉTRIQUES DE SUCCÈS

### Techniques
- ✅ Temps chargement < 3s
- ✅ 0 bug critique
- ✅ Responsive 100%
- ✅ Taux disponibilité > 99%

### Fonctionnelles
- ✅ Toutes fonctionnalités MVP opérationnelles
- ✅ Application déployée
- ✅ Documentation complète

### Utilisateurs (à mesurer post-lancement)
- 100+ utilisateurs première semaine
- 50+ lieux ajoutés
- 20+ signalements créés
- Satisfaction > 4/5

---

**Document créé le** : 9 février 2026
**Version** : 1.0 - Plan MVP 2 jours
**Statut** : Guide de développement complet
**Lié aux documents** : Cahier des charges v1.0, Maquettes v1.0

---

## NOTES IMPORTANTES

### Bonnes pratiques
- Commits réguliers sur Git
- Tests après chaque fonctionnalité
- Code commenté
- Gestion d'erreurs systématique
- Variables d'environnement pour config

### Pièges à éviter
- Ne pas négliger la sécurité (même en MVP)
- Tester sur vrais appareils mobiles
- Vérifier compatibilité navigateurs
- Optimiser images et requêtes
- Prévoir rate limiting API

### Ressources utiles
- [Leaflet Documentation](https://leafletjs.com/)
- [React Leaflet](https://react-leaflet.js.org/)
- [PostGIS Documentation](https://postgis.net/)
- [OSRM API](http://project-osrm.org/)
- [OpenStreetMap Guinée](https://www.openstreetmap.org/#map=12/9.5150/-13.6800)

---

**Bon développement ! 🚀**
