import { useState, useRef, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline, Circle } from 'react-leaflet'
import axios from 'axios'
import './App.css'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet';

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

function MapController({ onMapReady, onMapClick }) {
  const map = useMap();
  useEffect(() => { onMapReady(map); }, []);

  useEffect(() => {
    if (!onMapClick) return;
    map.on('click', onMapClick);
    return () => map.off('click', onMapClick);
  }, [onMapClick]);

  return null;
}

const getCategoryIcon = (category) => {
  const icons = {
    education: '🏫',
    health: '🏥',
    tourism: '🕌',
    commerce: '🛒',
    restaurant: '🍽️',
    government: '🏛️'
  };
  return icons[category] || '📍';
};

const createCustomIcon = (category) => {
  return L.divIcon({
    className: 'custom-div-icon',
    html: `<div class="marker-pin marker-${category}"><i>${getCategoryIcon(category)}</i></div>`,
    iconSize: [30, 42],
    iconAnchor: [15, 42],
    popupAnchor: [0, -40]
  });
};

const getDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371e3; // metres
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) *
    Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
};

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [places, setPlaces] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeTab, setActiveTab] = useState('carte'); // carte, favoris, signaler, profil

  // Routing State
  const [routingMode, setRoutingMode] = useState(false);
  const [startPoint, setStartPoint] = useState(null); // {lat, lon, name}
  const [endPoint, setEndPoint] = useState(null);
  const [routeData, setRouteData] = useState(null);
  const [incidents, setIncidents] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [userStats, setUserStats] = useState({ reports: 0, favorites: 0, memberSince: '...' });
  const [userLocation, setUserLocation] = useState(null); // {latitude, longitude, accuracy}
  const [geoStatus, setGeoStatus] = useState('searching'); // searching, active, error, blocked, manual
  const [isSettingManualLocation, setIsSettingManualLocation] = useState(false);
  const [lastRoutedLocation, setLastRoutedLocation] = useState(null);
  const [isNavigating, setIsNavigating] = useState(false);

  const mapRef = useRef(null);
  const position = [9.5370, -13.6785]; // Camayenne

  useEffect(() => {
    if (!routingMode) {
      fetchPlaces();
      fetchIncidents();
      fetchFavorites();
      fetchStats();
    }
  }, [activeCategory, routingMode]);

  useEffect(() => {
    if ("geolocation" in navigator) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude, accuracy } = position.coords;
          setUserLocation({ latitude, longitude, accuracy });
          setGeoStatus('active');
        },
        (error) => {
          let msg = "Erreur de géolocalisation: ";
          switch (error.code) {
            case 1:
              msg += "Permission refusée.";
              setGeoStatus('blocked');
              break;
            case 2:
              msg += "Position non disponible.";
              setGeoStatus('error');
              break;
            case 3:
              msg += "Délai d'attente dépassé.";
              setGeoStatus('error');
              break;
            default:
              msg += "Erreur inconnue.";
              setGeoStatus('error');
          }
          console.error(msg, error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
      return () => navigator.geolocation.clearWatch(watchId);
    } else {
      console.error("La géolocalisation n'est pas supportée par ce navigateur.");
    }
  }, []);

  // Manual/Initial Routing Effect
  useEffect(() => {
    if (routingMode && startPoint && endPoint) {
      if (startPoint.name !== "Ma position") {
        calculateRoute();
      } else if (!lastRoutedLocation && userLocation) {
        calculateRoute();
        setLastRoutedLocation(userLocation);
      }
    }
  }, [startPoint, endPoint, routingMode]);

  // Dynamic Movement Effect
  useEffect(() => {
    if (routingMode && userLocation && lastRoutedLocation && endPoint && startPoint?.name === "Ma position") {
      const dist = getDistance(
        userLocation.latitude, userLocation.longitude,
        lastRoutedLocation.latitude, lastRoutedLocation.longitude
      );
      if (dist > 20) { // Recalculate if moved > 20m
        const newStart = {
          ...startPoint,
          latitude: userLocation.latitude,
          longitude: userLocation.longitude
        };
        setStartPoint(newStart);
        calculateRoute(newStart);
        setLastRoutedLocation(userLocation);

        // Follow user if navigating
        if (isNavigating && mapRef.current) {
          mapRef.current.setView([userLocation.latitude, userLocation.longitude], 18);
        }
      } else if (isNavigating && mapRef.current) {
        // Just center without recalculating if distance is small
        mapRef.current.setView([userLocation.latitude, userLocation.longitude]);
      }
    }
  }, [userLocation]);

  const fetchStats = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/stats/me');
      setUserStats(response.data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const fetchIncidents = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/incidents');
      setIncidents(response.data);
    } catch (error) {
      console.error("Error fetching incidents:", error);
    }
  };

  const fetchFavorites = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/favorites');
      setFavorites(response.data);
    } catch (error) {
      console.error("Error fetching favorites:", error);
    }
  };

  const fetchPlaces = async () => {
    setLoading(true);
    try {
      let url = 'http://localhost:5000/api/places';
      if (activeCategory) {
        url += `?category=${activeCategory}`;
      }
      const response = await axios.get(url);
      setPlaces(response.data);
    } catch (error) {
      console.error("Error fetching places:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = async (e) => {
    const q = e.target.value;
    setSearchQuery(q);
    if (q.length > 1) {
      try {
        const response = await axios.get(`http://localhost:5000/api/search?q=${q}`);
        setSearchResults(response.data);
        setShowSuggestions(true);
      } catch (error) {
        console.error("Search failed:", error);
      }
    } else {
      setShowSuggestions(false);
    }
  };

  const selectPlace = (place) => {
    if (routingMode) {
      if (!startPoint) setStartPoint(place);
      else setEndPoint(place);
      setShowSuggestions(false);
      setSearchQuery('');
    } else {
      setPlaces([place]);
      mapRef.current.setView([place.latitude, place.longitude], 17);
      setSearchQuery(place.name);
      setShowSuggestions(false);
      setSidebarOpen(true);
      setActiveCategory(null);
    }
  };

  const calculateRoute = async (overrideStart = null) => {
    const startObj = overrideStart || startPoint;
    if (!startObj || !endPoint) return;
    setLoading(true);
    try {
      const start = `${startObj.longitude},${startObj.latitude}`;
      const end = `${endPoint.longitude},${endPoint.latitude}`;
      const response = await axios.get(`http://localhost:5000/api/routes?start=${start}&end=${end}`);
      setRouteData(response.data);

      // Fitting map to route
      if (mapRef.current && response.data.geometry) {
        const coords = response.data.geometry.coordinates.map(c => [c[1], c[0]]);
        mapRef.current.fitBounds(coords);
      }
    } catch (error) {
      console.error("Routing failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const startNavigation = () => {
    if (!userLocation) {
      alert("Attente du signal GPS...");
      return;
    }
    setIsNavigating(!isNavigating);
    if (!isNavigating) {
      mapRef.current.setView([userLocation.latitude, userLocation.longitude], 18);
      setSidebarOpen(false); // Close sidebar for better view
      alert("Navigation démarrée ! La carte suivra votre position.");
    }
  };

  useEffect(() => {
    if (routingMode && startPoint && endPoint) {
      calculateRoute();
    }
  }, [startPoint, endPoint]);

  const toggleRoutingMode = () => {
    const nextMode = !routingMode;
    setRoutingMode(nextMode);
    setRouteData(null);
    setStartPoint(null);
    setEndPoint(null);
    setSearchQuery('');

    // Auto-set start point to user location if available
    if (nextMode && userLocation) {
      setStartPoint({
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        name: "Ma position"
      });
    }

    if (activeTab !== 'carte') setActiveTab('carte');
    if (routingMode) setSidebarOpen(true);
    if (!nextMode) {
      setLastRoutedLocation(null);
      setIsNavigating(false);
    }
  };

  const handleZoomIn = () => {
    if (mapRef.current) mapRef.current.zoomIn();
  };

  const handleZoomOut = () => {
    if (mapRef.current) mapRef.current.zoomOut();
  };

  const handleLocate = () => {
    if (userLocation && mapRef.current) {
      mapRef.current.setView([userLocation.latitude, userLocation.longitude], 17);
    } else if (mapRef.current) {
      mapRef.current.locate({ setView: true, maxZoom: 17 });
    }
  };

  const handleResetOrientation = () => {
    if (mapRef.current) {
      mapRef.current.setView(position, 15);
      setActiveCategory(null);
      setSearchQuery('');
      setRoutingMode(false);
      setRouteData(null);
      fetchPlaces();
    }
  };

  const handleCategoryClick = (category) => {
    if (activeCategory === category) setActiveCategory(null);
    else setActiveCategory(category);
    setActiveTab('carte');
  };

  const handleReportSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    // Geometry needs to be added to formData
    formData.append('latitude', mapRef.current.getCenter().lat);
    formData.append('longitude', mapRef.current.getCenter().lng);
    formData.append('address', "Camayenne, Conakry");

    try {
      // POSTing as Multipart/Form-Data
      await axios.post('http://localhost:5000/api/incidents', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert("Signalement envoyé avec succès !");
      fetchIncidents();
      fetchStats();
      setActiveTab('carte');
    } catch (error) {
      console.error("Error reporting incident:", error);
      alert("Erreur lors de l'envoi du signalement.");
    }
  };

  const toggleFavorite = async (place) => {
    const isFav = favorites.find(f => f.place_id === place.id);
    try {
      if (isFav) {
        await axios.delete(`http://localhost:5000/api/favorites/${isFav.favorite_id}`);
      } else {
        await axios.post('http://localhost:5000/api/favorites', { place_id: place.id });
      }
      fetchFavorites();
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  const handleManualLocationClick = (e) => {
    if (!isSettingManualLocation) return;
    const { lat, lng } = e.latlng;
    setUserLocation({ latitude: lat, longitude: lng, accuracy: 10 }); // 10m precision for manual
    setGeoStatus('manual');
    setIsSettingManualLocation(false);
    alert("Position définie manuellement !");
  };

  return (
    <>
      <div className="search-container">
        {!routingMode ? (
          <div className="search-bar">
            <span className="menu-icon" onClick={() => setSidebarOpen(!sidebarOpen)}>☰</span>
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Rechercher Camayenne..."
              value={searchQuery}
              onChange={handleSearchChange}
              onFocus={() => searchQuery.length > 1 && setShowSuggestions(true)}
            />
            <span className="mic-icon" title="Itinéraire" onClick={toggleRoutingMode}>🧭</span>
            <span className="user-icon">👤</span>
          </div>
        ) : (
          <div className="routing-header">
            <div className="routing-controls">
              <button className="back-btn" onClick={toggleRoutingMode}>←</button>
              <div className="routing-inputs">
                <input
                  placeholder="Lieu de départ"
                  value={startPoint?.name || searchQuery}
                  onChange={handleSearchChange}
                />
                <input
                  placeholder="Lieu d'arrivée"
                  value={endPoint?.name || ''}
                  readOnly
                />
              </div>
              <button className="swap-btn" onClick={() => {
                setStartPoint(endPoint);
                setEndPoint(startPoint);
              }}>⇅</button>
            </div>
          </div>
        )}

        {showSuggestions && searchResults.length > 0 && (
          <div className="search-suggestions">
            {searchResults.map(res => (
              <div key={res.id} className="suggestion-item" onClick={() => selectPlace(res)}>
                <span className="suggestion-icon">📍</span>
                <div className="suggestion-text">
                  <div className="suggestion-name">{res.name}</div>
                  <div className="suggestion-sub">{res.subcategory || res.category}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className={`sidebar ${sidebarOpen || activeTab !== 'carte' ? '' : 'closed'}`}>
        <div className="sidebar-content">
          {activeTab === 'carte' && !routingMode && (
            <>
              <h3>Explorer Camayenne</h3>
              {loading && <p style={{ fontSize: '12px', color: '#666' }}>Chargement...</p>}
              <div className="category-grid">
                <div className={`category-item ${activeCategory === 'education' ? 'active' : ''}`} onClick={() => handleCategoryClick('education')}>
                  <span className="category-icon">🏫</span> Écoles
                </div>
                <div className={`category-item ${activeCategory === 'health' ? 'active' : ''}`} onClick={() => handleCategoryClick('health')}>
                  <span className="category-icon">🏥</span> Hôpitaux
                </div>
                <div className={`category-item ${activeCategory === 'tourism' ? 'active' : ''}`} onClick={() => handleCategoryClick('tourism')}>
                  <span className="category-icon">🕌</span> Tourisme
                </div>
                <div className={`category-item ${activeCategory === 'government' ? 'active' : ''}`} onClick={() => handleCategoryClick('government')}>
                  <span className="category-icon">🏛️</span> Admin
                </div>
              </div>
              <div style={{ marginTop: '20px' }}>
                <h4>Résultats ({places.length})</h4>
                <ul className="places-list">
                  {places.slice(0, 10).map(place => (
                    <li key={place.id} onClick={() => mapRef.current.setView([place.latitude, place.longitude], 17)}>
                      <strong>{place.name}</strong><br />
                      <small>{place.subcategory || place.category}</small>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}

          {activeTab === 'carte' && routingMode && (
            <div className="routing-panel">
              <h3>Votre itinéraire</h3>
              {routeData ? (
                <div className="route-info">
                  <div className="info-main">
                    <span className="time">{Math.round(routeData.duration / 60)} min</span>
                    <span className="dist">({(routeData.distance / 1000).toFixed(1)} km)</span>
                  </div>
                  <p className="summary">Via le trajet le plus court</p>
                  <button
                    className={`start-nav ${isNavigating ? 'active' : ''}`}
                    onClick={startNavigation}
                  >
                    {isNavigating ? 'ARRÊTER' : 'DÉMARRER'}
                  </button>

                  <div className="steps-list">
                    {routeData.steps.map((step, i) => (
                      <div key={i} className="step">
                        <span className="step-icon">↪️</span>
                        <span className="step-text">{step.instruction}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="no-route">Choisissez deux points pour calculer l'itinéraire.</p>
              )}
            </div>
          )}

          {activeTab === 'favoris' && (
            <div className="favorites-panel">
              <h3>Mes Favoris</h3>
              {favorites.length > 0 ? (
                <ul className="places-list">
                  {favorites.map(fav => (
                    <li key={fav.id} onClick={() => {
                      mapRef.current.setView([fav.latitude, fav.longitude], 17);
                      setActiveTab('carte');
                    }}>
                      <strong>{fav.name}</strong><br />
                      <small>{fav.subcategory || fav.category}</small>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="placeholder-msg">
                  <span style={{ fontSize: '48px' }}>⭐</span>
                  <p>Retrouvez ici vos lieux enregistrés.</p>
                  <button className="btn-primary" onClick={() => setActiveTab('carte')}>Explorer la carte</button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'signaler' && (
            <div className="report-panel">
              <h3>Signaler un problème</h3>
              <form className="report-form" onSubmit={handleReportSubmit}>
                <label>Catégorie *</label>
                <select name="category">
                  <option value="road">🚧 Problème de voirie</option>
                  <option value="lighting">💡 Éclairage public</option>
                  <option value="waste">🗑️ Déchets</option>
                </select>

                <label>Titre *</label>
                <input name="title" placeholder="Ex: Nid-de-poule avenue..." required />

                <label>Description *</label>
                <textarea name="description" placeholder="Décrivez le problème..." required></textarea>

                <label>Photos (Optionnel)</label>
                <input type="file" name="photos" multiple accept="image/*" />

                <button type="submit" className="btn-primary">ENVOYER LE SIGNALEMENT</button>
              </form>
            </div>
          )}

          {activeTab === 'profil' && (
            <div className="profile-panel">
              <div className="profile-header">
                <div className="profile-avatar">👤</div>
                <h4>Utilisateur Camayenne</h4>
                <p>Membre depuis {userStats.memberSince}</p>
              </div>

              <div className="stats-dashboard">
                <div className="stat-card">
                  <span className="stat-value">{userStats.reports}</span>
                  <span className="stat-label">Signalements</span>
                </div>
                <div className="stat-card">
                  <span className="stat-value">{userStats.favorites}</span>
                  <span className="stat-label">Favoris</span>
                </div>
              </div>

              <div className={`geo-status-badge ${geoStatus}`}>
                {geoStatus === 'searching' && '🔍 Recherche de GPS...'}
                {geoStatus === 'active' && `✅ GPS Actif (Précision: ${Math.round(userLocation?.accuracy || 0)}m)`}
                {geoStatus === 'error' && '❌ Erreur de signal'}
                {geoStatus === 'blocked' && '🔒 Position bloquée'}
                {geoStatus === 'manual' && '📍 Position manuelle'}
              </div>

              <button
                className={`btn-primary ${isSettingManualLocation ? 'active' : ''}`}
                onClick={() => setIsSettingManualLocation(!isSettingManualLocation)}
                style={{ margin: '10px', width: 'calc(100% - 20px)' }}
              >
                {isSettingManualLocation ? 'CLIQUEZ SUR LA CARTE' : 'MA POSITION EST FAUSSE ?'}
              </button>

              <ul className="profile-menu">
                <li>📊 Détail de mes contributions</li>
                <li>⚙️ Paramètres du compte</li>
                <li>🚪 Déconnexion</li>
              </ul>
            </div>
          )}
        </div>
      </div>

      <div className="map-container">
        <MapContainer
          center={position}
          zoom={15}
          scrollWheelZoom={true}
          zoomControl={false}
          style={{ height: "100%", width: "100%" }}
        >
          <MapController
            onMapReady={(map) => { mapRef.current = map; }}
            onMapClick={handleManualLocationClick}
          />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {!routingMode && places.map(place => (
            <Marker
              key={place.id}
              position={[place.latitude, place.longitude]}
              icon={createCustomIcon(place.category)}
            >
              <Popup>
                <div className="poi-popup">
                  <strong>{place.name}</strong><br />
                  <span>{place.subcategory || place.category}</span><br />
                  <div className="popup-actions">
                    <button className="btn-small" onClick={() => {
                      if (userLocation) {
                        setStartPoint({
                          latitude: userLocation.latitude,
                          longitude: userLocation.longitude,
                          name: "Ma position"
                        });
                      }
                      setEndPoint(place);
                      setRoutingMode(true);
                      setActiveTab('carte');
                    }}>Itinéraire</button>
                    <button className={`btn-small ${favorites.some(f => f.place_id === place.id) ? 'active' : ''}`} onClick={() => toggleFavorite(place)}>
                      {favorites.some(f => f.place_id === place.id) ? '⭐ Enregistré' : '☆ Enregistrer'}
                    </button>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}

          {!routingMode && incidents.map(incident => (
            <Marker
              key={incident.id}
              position={[incident.latitude, incident.longitude]}
              icon={L.divIcon({
                className: 'marker-incident',
                html: `<div class="marker-pin incident-pin"><i>⚠️</i></div>`,
                iconSize: [30, 42],
                iconAnchor: [15, 42],
                popupAnchor: [0, -40]
              })}
            >
              <Popup>
                <strong>{incident.title}</strong><br />
                <span>{incident.description}</span><br />
                {incident.photos && incident.photos.length > 0 && (
                  <div className="popup-photos">
                    {incident.photos.map((p, idx) => (
                      <img key={idx} src={`http://localhost:5000${p}`} alt="Incident" className="popup-img" />
                    ))}
                  </div>
                )}
              </Popup>
            </Marker>
          ))}

          {routingMode && startPoint && <Marker position={[startPoint.latitude, startPoint.longitude]} icon={L.divIcon({ className: 'marker-a', html: 'A' })} />}
          {routingMode && endPoint && <Marker position={[endPoint.latitude, endPoint.longitude]} icon={L.divIcon({ className: 'marker-b', html: 'B' })} />}

          {routeData && routeData.geometry && (
            <Polyline
              positions={routeData.geometry.coordinates.map(c => [c[1], c[0]])}
              color="#4285F4"
              weight={6}
              opacity={0.8}
            />
          )}

          {userLocation && (
            <>
              <Marker
                position={[userLocation.latitude, userLocation.longitude]}
                icon={L.divIcon({
                  className: 'user-location-marker',
                  html: '<div class="pulsing-dot"></div>',
                  iconSize: [20, 20],
                  iconAnchor: [10, 10]
                })}
              />
              <Circle
                center={[userLocation.latitude, userLocation.longitude]}
                radius={userLocation.accuracy || 100}
                pathOptions={{
                  color: '#4285F4',
                  fillColor: '#4285F4',
                  fillOpacity: 0.1,
                  weight: 1
                }}
              />
            </>
          )}
        </MapContainer>

        <div className="map-controls">
          <button className="control-btn" onClick={handleZoomIn} title="Zoom In">➕</button>
          <button className="control-btn" onClick={handleZoomOut} title="Zoom Out">➖</button>
          <button className="control-btn" onClick={handleLocate} title="Ma position">📍</button>
          <button className="control-btn" onClick={handleResetOrientation} title="Reset">🧭</button>
        </div>
      </div>

      <nav className="bottom-nav">
        <div className={`nav-item ${activeTab === 'carte' ? 'active' : ''}`} onClick={() => setActiveTab('carte')}>
          <span className="nav-icon">🧭</span>
          <span>Carte</span>
        </div>
        <div className={`nav-item ${activeTab === 'favoris' ? 'active' : ''}`} onClick={() => setActiveTab('favoris')}>
          <span className="nav-icon">⭐</span>
          <span>Favoris</span>
        </div>
        <div className={`nav-item ${activeTab === 'signaler' ? 'active' : ''}`} onClick={() => setActiveTab('signaler')}>
          <span className="nav-icon">🚨</span>
          <span>Signaler</span>
        </div>
        <div className={`nav-item ${activeTab === 'profil' ? 'active' : ''}`} onClick={() => setActiveTab('profil')}>
          <span className="nav-icon">👤</span>
          <span>Profil</span>
        </div>
      </nav>
    </>
  )
}

export default App
