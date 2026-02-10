# CAHIER DES CHARGES
## Application de Cartographie de Camayenne - Conakry, Guinée

---

## 1. PRÉSENTATION DU PROJET

### 1.1 Contexte
Développement d'une application mobile et web de cartographie interactive pour le quartier de Camayenne à Conakry, Guinée. L'application vise à faciliter la navigation, la découverte des commerces, la gestion urbaine et le tourisme local en s'appuyant sur les données OpenStreetMap.

### 1.2 Objectifs principaux
- **Navigation GPS** : Guidage en temps réel pour les habitants et visiteurs
- **Répertoire des commerces** : Base de données exhaustive des services et commerces locaux
- **Gestion urbaine** : Outil de signalement et suivi des problèmes urbains
- **Tourisme** : Découverte des sites d'intérêt et attractions de Camayenne

### 1.3 Contraintes
- **Délai** : 2 jours de développement
- **Budget** : Limité
- **Technologie** : Intégration obligatoire avec OpenStreetMap (OSM)
- **Cible** : Application accessible sur mobile et web

---

## 2. SPÉCIFICATIONS FONCTIONNELLES

### 2.1 Fonctionnalités prioritaires (MVP - 2 jours)

#### A. Géolocalisation en temps réel
- Détection automatique de la position de l'utilisateur
- Affichage de la position sur la carte OSM
- Mise à jour en temps réel lors des déplacements
- Gestion des permissions de géolocalisation
- Fonctionnement même avec connexion limitée (cache local)

#### B. Recherche d'adresses et lieux
- Barre de recherche intelligente
- Autocomplétion basée sur les données OSM
- Recherche par :
  - Nom de lieu
  - Type de commerce (restaurant, pharmacie, école, etc.)
  - Adresse
  - Point d'intérêt touristique
- Affichage des résultats avec :
  - Nom
  - Distance depuis la position actuelle
  - Type de lieu
  - Photo (si disponible)
  - Horaires (si disponibles)

#### C. Itinéraires et navigation
- Calcul d'itinéraire entre deux points
- Modes de transport :
  - À pied
  - En voiture
  - Transport en commun (si données disponibles)
- Affichage :
  - Tracé de l'itinéraire sur la carte
  - Distance totale
  - Temps estimé
  - Instructions étape par étape
- Navigation guidée avec instructions vocales (optionnel pour MVP)

#### D. Signalement d'incidents/problèmes urbains
- Création de signalements géolocalisés :
  - Problèmes de voirie (nids-de-poule, routes endommagées)
  - Éclairage public défectueux
  - Déchets/insalubrité
  - Problèmes d'eau/assainissement
  - Autres incidents
- Pour chaque signalement :
  - Photo obligatoire
  - Description textuelle
  - Catégorie
  - Position GPS automatique
  - Date/heure
- Visualisation des signalements existants sur la carte
- Statuts : Nouveau / En cours / Résolu

### 2.2 Fonctionnalités secondaires (post-MVP)

#### E. Système de favoris
- Sauvegarde de lieux favoris
- Organisation par catégories
- Accès rapide aux favoris

#### F. Avis et évaluations
- Notes sur les commerces (1-5 étoiles)
- Commentaires des utilisateurs
- Photos de clients

#### G. Mode hors-ligne
- Téléchargement de zones cartographiques
- Accès aux données sans connexion
- Synchronisation automatique

#### H. Contribution communautaire
- Ajout de nouveaux commerces/lieux
- Mise à jour d'informations (horaires, téléphone)
- Validation par modération

---

## 3. SPÉCIFICATIONS TECHNIQUES

### 3.1 Architecture globale

#### Frontend
**Option 1 : Application Web Progressive (PWA)**
- Technologies : React.js + Leaflet.js ou Mapbox GL JS
- Avantages : Déploiement rapide, multi-plateforme, pas de stores
- Responsive : mobile-first design

**Option 2 : Application Mobile Native**
- React Native + react-native-maps
- Déploiement : Android (priorité) puis iOS

**Recommandation pour 2 jours** : PWA avec React + Leaflet

#### Backend
- **Framework** : Node.js + Express.js OU Python + FastAPI
- **Base de données** : PostgreSQL 14+ avec extension PostGIS
- **API REST** pour communication frontend-backend
- **Architecture** : MVC ou microservices légers

### 3.2 Intégration OpenStreetMap

#### Source des données cartographiques
1. **Tiles de carte**
   - Fournisseur : OpenStreetMap Standard Tiles OU Mapbox
   - Format : Raster tiles (256x256px)
   - Niveaux de zoom : 0-18
   - URL : `https://tile.openstreetmap.org/{z}/{x}/{y}.png`

2. **Données vectorielles via Overpass API**
   - Endpoint : `https://overpass-api.de/api/interpreter`
   - Requêtes pour récupérer :
     - Routes et rues de Camayenne
     - Bâtiments
     - Points d'intérêt (POI)
     - Limites administratives
   - Format de réponse : GeoJSON ou XML

3. **Geocoding et recherche**
   - Service : Nominatim (OSM)
   - Endpoint : `https://nominatim.openstreetmap.org/search`
   - Reverse geocoding pour adresses

4. **Routing (calcul d'itinéraires)**
   - Service : OSRM (Open Source Routing Machine)
   - OU GraphHopper
   - OU Mapbox Directions API (avec clé API gratuite limitée)

#### Limites géographiques de Camayenne
- **Coordonnées approximatives** :
  - Nord : 9.54° N
  - Sud : 9.49° N
  - Ouest : -13.70° W
  - Est : -13.65° W
- Bbox : `[-13.70, 9.49, -13.65, 9.54]`

### 3.3 Base de données locale

#### Schéma de base de données PostgreSQL + PostGIS

**Table : users**
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

**Table : places (données enrichies OSM + ajouts utilisateurs)**
```sql
CREATE TABLE places (
    id SERIAL PRIMARY KEY,
    osm_id BIGINT UNIQUE,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100), -- restaurant, pharmacy, school, etc.
    subcategory VARCHAR(100),
    description TEXT,
    address TEXT,
    phone VARCHAR(20),
    email VARCHAR(100),
    website VARCHAR(255),
    location GEOGRAPHY(POINT, 4326) NOT NULL,
    opening_hours JSONB,
    photos TEXT[], -- URLs des photos
    rating DECIMAL(2,1) DEFAULT 0,
    reviews_count INT DEFAULT 0,
    verified BOOLEAN DEFAULT FALSE,
    source VARCHAR(50) DEFAULT 'osm', -- osm, user, admin
    created_by INT REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_places_location ON places USING GIST(location);
CREATE INDEX idx_places_category ON places(category);
```

**Table : incidents (signalements)**
```sql
CREATE TABLE incidents (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(100) NOT NULL, -- road, lighting, waste, water, other
    status VARCHAR(50) DEFAULT 'new', -- new, in_progress, resolved, rejected
    location GEOGRAPHY(POINT, 4326) NOT NULL,
    address TEXT,
    photos TEXT[] NOT NULL, -- au moins 1 photo obligatoire
    priority VARCHAR(20) DEFAULT 'normal', -- low, normal, high, urgent
    reported_by INT REFERENCES users(id),
    assigned_to INT REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    resolved_at TIMESTAMP
);

CREATE INDEX idx_incidents_location ON incidents USING GIST(location);
CREATE INDEX idx_incidents_status ON incidents(status);
CREATE INDEX idx_incidents_category ON incidents(category);
```

**Table : favorites**
```sql
CREATE TABLE favorites (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    place_id INT REFERENCES places(id) ON DELETE CASCADE,
    category VARCHAR(100), -- work, home, shopping, etc.
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, place_id)
);
```

**Table : reviews**
```sql
CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    place_id INT REFERENCES places(id) ON DELETE CASCADE,
    user_id INT REFERENCES users(id),
    rating INT CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    photos TEXT[],
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

**Table : routes_cache (cache des itinéraires calculés)**
```sql
CREATE TABLE routes_cache (
    id SERIAL PRIMARY KEY,
    start_location GEOGRAPHY(POINT, 4326) NOT NULL,
    end_location GEOGRAPHY(POINT, 4326) NOT NULL,
    mode VARCHAR(20), -- walking, driving, cycling
    route_geometry GEOGRAPHY(LINESTRING, 4326),
    distance_meters INT,
    duration_seconds INT,
    instructions JSONB,
    created_at TIMESTAMP DEFAULT NOW(),
    expires_at TIMESTAMP
);

CREATE INDEX idx_routes_start ON routes_cache USING GIST(start_location);
CREATE INDEX idx_routes_end ON routes_cache USING GIST(end_location);
```

**Table : osm_cache (cache des données OSM)**
```sql
CREATE TABLE osm_cache (
    id SERIAL PRIMARY KEY,
    osm_type VARCHAR(20), -- node, way, relation
    osm_id BIGINT NOT NULL,
    tags JSONB,
    geometry GEOGRAPHY(GEOMETRY, 4326),
    cached_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(osm_type, osm_id)
);

CREATE INDEX idx_osm_cache_geometry ON osm_cache USING GIST(geometry);
```

### 3.4 API Endpoints (Backend)

#### Authentification
- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion
- `POST /api/auth/logout` - Déconnexion
- `GET /api/auth/me` - Profil utilisateur

#### Cartographie
- `GET /api/map/tiles/{z}/{x}/{y}` - Récupération de tiles (proxy OSM)
- `GET /api/map/bounds` - Limites de Camayenne

#### Recherche
- `GET /api/search?q={query}&lat={lat}&lon={lon}` - Recherche générale
- `GET /api/search/places?category={cat}&lat={lat}&lon={lon}&radius={m}` - Recherche par catégorie
- `GET /api/search/nearby?lat={lat}&lon={lon}&radius={m}` - Lieux à proximité

#### Lieux
- `GET /api/places` - Liste des lieux (avec pagination)
- `GET /api/places/{id}` - Détails d'un lieu
- `POST /api/places` - Ajouter un lieu (authentifié)
- `PUT /api/places/{id}` - Modifier un lieu (authentifié)
- `DELETE /api/places/{id}` - Supprimer un lieu (admin)

#### Itinéraires
- `GET /api/routes?start={lat,lon}&end={lat,lon}&mode={mode}` - Calcul d'itinéraire
- `GET /api/routes/{id}` - Récupération d'un itinéraire sauvegardé

#### Incidents/Signalements
- `GET /api/incidents` - Liste des incidents
- `GET /api/incidents/{id}` - Détails d'un incident
- `POST /api/incidents` - Créer un incident (authentifié)
- `PUT /api/incidents/{id}` - Modifier statut (admin/assigné)
- `DELETE /api/incidents/{id}` - Supprimer (admin)
- `POST /api/incidents/{id}/photos` - Ajouter des photos

#### Favoris
- `GET /api/favorites` - Mes favoris (authentifié)
- `POST /api/favorites` - Ajouter aux favoris
- `DELETE /api/favorites/{id}` - Retirer des favoris

#### Avis
- `GET /api/places/{id}/reviews` - Avis d'un lieu
- `POST /api/places/{id}/reviews` - Ajouter un avis (authentifié)
- `PUT /api/reviews/{id}` - Modifier un avis
- `DELETE /api/reviews/{id}` - Supprimer un avis

### 3.5 Technologies recommandées

#### Stack technique complète (recommandation)

**Frontend (PWA)**
- React 18+
- Leaflet.js 1.9+ OU Mapbox GL JS 2.0+
- React Router pour navigation
- Axios pour requêtes HTTP
- Redux OU Context API pour state management
- Tailwind CSS pour styling
- PWA Workbox pour fonctionnalités offline

**Backend**
- Node.js 18+ avec Express.js 4.18+
- OU Python 3.10+ avec FastAPI
- JWT pour authentification
- Multer pour upload de fichiers (photos)
- Bcrypt pour hash de mots de passe
- CORS middleware

**Base de données**
- PostgreSQL 14+ avec PostGIS 3.0+

**Déploiement (après MVP)**
- Frontend : Vercel, Netlify OU GitHub Pages
- Backend : Railway, Render OU DigitalOcean
- Base de données : Supabase OU Railway Postgres

**Outils de développement**
- Git pour versioning
- Visual Studio Code
- Postman pour test d'API
- pgAdmin pour gestion PostgreSQL

### 3.6 Sécurité et performances

#### Sécurité
- HTTPS obligatoire en production
- JWT avec expiration (24h)
- Rate limiting sur API (100 requêtes/minute/IP)
- Validation des inputs (sanitization)
- Protection CSRF
- Hachage bcrypt pour mots de passe (10 rounds)
- Upload de fichiers : validation type MIME, taille max 5MB

#### Performances
- Cache Redis pour requêtes fréquentes (optionnel)
- Pagination : 20 résultats par page
- Lazy loading des images
- Compression Gzip sur réponses API
- Index PostgreSQL sur champs recherchés
- CDN pour assets statiques

---

## 4. SPÉCIFICATIONS ERGONOMIQUES

### 4.1 Interface utilisateur

#### Design général
- **Style** : Moderne, épuré, Material Design OU iOS Human Interface
- **Couleurs** :
  - Primaire : Bleu (#2196F3) - confiance, navigation
  - Secondaire : Vert (#4CAF50) - validations, succès
  - Accent : Orange (#FF9800) - alertes, signalements
  - Neutre : Gris (#757575)
- **Typographie** :
  - Titres : Roboto Bold OU SF Pro Bold
  - Corps : Roboto Regular OU SF Pro Regular
  - Taille minimum : 14px (lisibilité mobile)

#### Navigation
- **Menu hamburger** (mobile) avec :
  - Accueil / Carte
  - Recherche
  - Mes favoris
  - Signaler un problème
  - Mon profil
  - À propos
- **Barre de recherche** toujours visible en haut
- **Bouton de géolocalisation** flottant en bas à droite
- **Zoom +/-** sur la carte

### 4.2 Parcours utilisateur

#### Scénario 1 : Trouver un restaurant
1. Ouverture de l'app → Carte centrée sur position actuelle
2. Recherche "restaurant" dans barre
3. Affichage des résultats avec filtres (cuisine, prix, note)
4. Sélection d'un restaurant → Fiche détaillée
5. "Obtenir l'itinéraire" → Navigation GPS

#### Scénario 2 : Signaler un nid-de-poule
1. Clic sur "Signaler un problème"
2. Sélection de catégorie "Problème de voirie"
3. Prise de photo du nid-de-poule
4. Ajout description
5. Position GPS auto-détectée
6. Validation → Confirmation + numéro de suivi

#### Scénario 3 : Navigation vers une adresse
1. Saisie adresse dans recherche
2. Validation → Marqueur sur carte
3. Clic "Itinéraire depuis ma position"
4. Choix mode transport (pied/voiture)
5. Démarrer navigation → Instructions étape par étape

### 4.3 Responsive design

#### Mobile (320px - 768px)
- Carte en plein écran
- Menu hamburger
- Recherche en overlay
- Boutons flottants
- Swipe pour détails de lieu

#### Tablette (768px - 1024px)
- Carte + panneau latéral (40% largeur)
- Menu visible en sidebar
- Résultats en colonne latérale

#### Desktop (1024px+)
- Carte principale (70% largeur)
- Panneau latéral fixe (30%)
- Menu horizontal
- Recherche avancée avec filtres

---

## 5. PLAN DE DÉVELOPPEMENT MVP (2 JOURS)

### Jour 1 : Infrastructure et fonctionnalités de base

#### Matin (4h)
- **Setup environnement** (1h)
  - Installation Node.js, PostgreSQL, PostGIS
  - Initialisation projet React
  - Configuration Git
  - Setup base de données
  
- **Backend API de base** (3h)
  - Création tables PostgreSQL
  - Endpoints authentification
  - Endpoint recherche basic
  - Endpoint lieux

#### Après-midi (4h)
- **Frontend carte de base** (4h)
  - Intégration Leaflet.js
  - Affichage carte OSM de Camayenne
  - Géolocalisation utilisateur
  - Marqueurs de lieux
  - Interface de recherche basique

### Jour 2 : Fonctionnalités avancées et finalisation

#### Matin (4h)
- **Itinéraires et navigation** (2h)
  - Intégration OSRM/Mapbox routing
  - Affichage tracé d'itinéraire
  - Instructions de navigation
  
- **Système de signalement** (2h)
  - Formulaire de signalement
  - Upload photo
  - Sauvegarde en base
  - Affichage sur carte

#### Après-midi (4h)
- **Finalisation et tests** (2h)
  - Tests fonctionnels
  - Correction bugs
  - Optimisation performances
  - Responsive design
  
- **Documentation et déploiement** (2h)
  - README
  - Documentation API
  - Déploiement test (Vercel + Railway)

### Fonctionnalités MVP minimal (2 jours)
✅ Affichage carte interactive OSM de Camayenne
✅ Géolocalisation en temps réel
✅ Recherche de lieux (nom, catégorie)
✅ Affichage détails d'un lieu
✅ Calcul d'itinéraire basique (A vers B)
✅ Signalement d'incidents avec photo
✅ Visualisation des signalements sur carte
✅ Interface responsive (mobile + desktop)

### Fonctionnalités post-MVP
❌ Authentification complète
❌ Système d'avis et notes
❌ Favoris
❌ Navigation guidée vocale
❌ Mode hors-ligne
❌ Contribution communautaire
❌ Dashboard administrateur

---

## 6. COÛTS ET RESSOURCES

### 6.1 Ressources humaines (MVP 2 jours)

**Option 1 : Développeur full-stack solo**
- 1 développeur avec compétences :
  - React.js
  - Node.js/Express OU Python/FastAPI
  - PostgreSQL/PostGIS
  - APIs OSM/Leaflet

**Option 2 : Équipe de 2**
- 1 développeur frontend (React + Leaflet)
- 1 développeur backend (API + BDD)

### 6.2 Coûts infrastructure

#### Gratuit (phase MVP/développement)
- Hébergement frontend : Vercel/Netlify (gratuit)
- Hébergement backend : Railway/Render (tier gratuit)
- Base de données : Supabase (500MB gratuit) OU Railway
- Tiles OSM : OpenStreetMap (gratuit, limité)
- APIs : Nominatim (gratuit avec fair use)

#### Payant (production avec trafic)
- Serveur VPS : 5-10€/mois (DigitalOcean, Linode)
- Base de données : 10€/mois
- Mapbox (si choisi) : Gratuit jusqu'à 50k requêtes/mois
- Domaine : 10-15€/an
- SSL : Gratuit (Let's Encrypt)

**Budget mensuel production** : 20-30€/mois

### 6.3 Licences et conformité

#### Licences
- OpenStreetMap : ODbL (Open Database License)
  - Données librement utilisables
  - Attribution obligatoire : "© OpenStreetMap contributors"
  - Modifications doivent rester ouvertes (ODbL)
- Code source : MIT OU GPL (selon choix)

#### Conformité
- RGPD (si utilisateurs européens) :
  - Politique de confidentialité
  - Consentement cookies
  - Droit à l'oubli
- Mentions légales obligatoires
- CGU/CGV

---

## 7. RISQUES ET MITIGATION

### 7.1 Risques techniques

| Risque | Probabilité | Impact | Mitigation |
|--------|-------------|--------|------------|
| Données OSM incomplètes pour Camayenne | Élevée | Moyen | Permettre ajout manuel, contribution communautaire |
| Problèmes de performance avec PostGIS | Moyenne | Élevé | Index optimisés, cache Redis, pagination |
| Qualité GPS variable en Guinée | Élevée | Moyen | Tolérance d'erreur augmentée, validation manuelle |
| Connexion internet instable | Élevée | Élevé | Mode hors-ligne, cache local, sync différée |
| Incompatibilité navigateurs mobiles | Faible | Moyen | Tests multi-navigateurs, polyfills |

### 7.2 Risques projet

| Risque | Probabilité | Impact | Mitigation |
|--------|-------------|--------|------------|
| Dépassement délai (2 jours) | Moyenne | Élevé | Scope strict MVP, fonctionnalités post-MVP claires |
| Manque de compétences techniques | Faible | Élevé | Formation préalable, documentation claire |
| Données utilisateurs insuffisantes | Moyenne | Moyen | Campagne de lancement, incitations |
| Modération des signalements | Élevée | Moyen | Outils admin, workflow validation |

---

## 8. ÉVOLUTIONS FUTURES

### Phase 2 (1-2 semaines post-MVP)
- Authentification complète avec profils
- Système d'avis et évaluations
- Favoris et historique
- Dashboard administrateur
- Modération des signalements

### Phase 3 (1 mois)
- Application mobile native (Android)
- Mode hors-ligne complet
- Navigation guidée avec voix
- Intégration transports en commun
- Partenariats commerces

### Phase 4 (3-6 mois)
- IA pour recommandations personnalisées
- Données temps réel (trafic, affluence)
- Gamification (badges, points)
- API publique pour développeurs
- Expansion à d'autres quartiers de Conakry

---

## 9. CRITÈRES DE SUCCÈS

### Métriques techniques (MVP)
- ✅ Temps de chargement carte < 3 secondes
- ✅ Précision GPS < 10 mètres
- ✅ Taux d'erreur API < 1%
- ✅ Responsive sur 95% des appareils mobiles
- ✅ 0 bug critique

### Métriques utilisateurs (3 mois post-lancement)
- 500+ utilisateurs actifs mensuels
- 1000+ lieux répertoriés
- 100+ signalements traités
- Taux de satisfaction > 4/5
- Temps moyen session > 5 minutes

---

## 10. CONTACT ET VALIDATION

### Points de validation
- [x] Spécifications fonctionnelles validées
- [x] Spécifications techniques validées
- [x] Budget validé
- [ ] Maquettes validées (voir document séparé)
- [ ] Planning validé
- [ ] Équipe constituée

### Approbations requises
- Chef de projet : _____________________ Date : _____
- Développeur : _____________________ Date : _____
- Client/Sponsor : _____________________ Date : _____

---

**Document créé le** : 9 février 2026
**Version** : 1.0
**Statut** : Brouillon pour validation
**Prochaine révision** : Après validation maquettes

---

## ANNEXES

### Annexe A : Glossaire
- **OSM** : OpenStreetMap
- **POI** : Point of Interest (Point d'intérêt)
- **PostGIS** : Extension géospatiale pour PostgreSQL
- **PWA** : Progressive Web App
- **MVP** : Minimum Viable Product
- **OSRM** : Open Source Routing Machine
- **JWT** : JSON Web Token
- **CORS** : Cross-Origin Resource Sharing
- **RGPD** : Règlement Général sur la Protection des Données

### Annexe B : Ressources utiles
- OpenStreetMap Guinée : https://www.openstreetmap.org/relation/192778
- Overpass Turbo (test requêtes) : https://overpass-turbo.eu/
- Leaflet.js documentation : https://leafletjs.com/
- PostGIS documentation : https://postgis.net/
- OSRM demo : http://map.project-osrm.org/

### Annexe C : Coordonnées géographiques clés
- **Conakry centre** : 9.5370° N, -13.6785° W
- **Camayenne** : 9.5150° N, -13.6800° W
- **Aéroport Conakry** : 9.5770° N, -13.6120° W
