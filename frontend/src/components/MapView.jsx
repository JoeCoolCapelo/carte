import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Plus, Minus, Navigation, Map as MapIcon, Layers, Moon, Sun, AlertTriangle } from 'lucide-react';

// Reset Leaflet assets
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const CAMAYENNE_CENTER = [9.528, -13.693];

// Helper to access Leaflet map instance
const MapController = ({ onMapClick, onCenterChange, settings }) => {
    const map = useMap();
    const locatedRef = React.useRef(false);

    useMapEvents({
        moveend: () => {
            onCenterChange(map.getCenter());
        }
    });

    // Auto-locate user on mount using native Geolocation API
    React.useEffect(() => {
        if (locatedRef.current) return;
        if (!navigator.geolocation) {
            console.warn("Géolocalisation non supportée par ce navigateur.");
            return;
        }

        locatedRef.current = true;

        const userIcon = L.divIcon({
            className: 'user-location-marker',
            html: `
                <div style="position:relative;width:28px;height:28px;">
                    <div style="position:absolute;inset:0;background:rgba(59,130,246,0.3);border-radius:50%;animation:pulse-ring 2s ease-out infinite;"></div>
                    <div style="position:absolute;top:5px;left:5px;width:18px;height:18px;background:#2563eb;border:3px solid white;border-radius:50%;box-shadow:0 2px 10px rgba(37,99,235,0.6);"></div>
                </div>
            `,
            iconSize: [28, 28],
            iconAnchor: [14, 14],
        });

        let userMarker = null;
        let accuracyCircle = null;
        let hasFlown = false;

        // Use watchPosition to get progressively better accuracy
        const watchId = navigator.geolocation.watchPosition(
            (position) => {
                const { latitude, longitude, accuracy } = position.coords;
                const latlng = L.latLng(latitude, longitude);

                console.log(`📍 Position GPS: ${latitude.toFixed(6)}, ${longitude.toFixed(6)} — Précision: ${Math.round(accuracy)}m`);

                // Remove previous marker/circle if updating
                if (userMarker) map.removeLayer(userMarker);
                if (accuracyCircle) map.removeLayer(accuracyCircle);

                // Add/update pulsing user marker
                userMarker = L.marker(latlng, { icon: userIcon, zIndexOffset: 1000 })
                    .addTo(map)
                    .bindPopup(`
                        <div style="text-align:center;">
                            <b>📍 Vous êtes ici</b><br>
                            <span style="font-size:11px;color:#666;">
                                ${latitude.toFixed(5)}, ${longitude.toFixed(5)}<br>
                                Précision: ~${Math.round(accuracy)}m
                            </span>
                        </div>
                    `)
                    .openPopup();

                // Add accuracy circle
                accuracyCircle = L.circle(latlng, {
                    radius: Math.min(accuracy, 2000),
                    color: '#3b82f6',
                    fillColor: '#3b82f6',
                    fillOpacity: 0.08,
                    weight: 1,
                    opacity: 0.3,
                }).addTo(map);

                // Only fly once when we get a decent fix
                if (!hasFlown) {
                    hasFlown = true;
                    map.flyTo(latlng, 16, { duration: 1.5 });
                }

                // If accuracy is good enough (< 100m), stop watching
                if (accuracy < 100) {
                    navigator.geolocation.clearWatch(watchId);
                }
            },
            (error) => {
                console.warn("Géolocalisation échouée:", error.code, error.message);
            },
            {
                enableHighAccuracy: true,
                timeout: 20000,
                maximumAge: 0, // Force fresh position, no cache
            }
        );

        // Safety: stop watching after 30 seconds max
        const safetyTimer = setTimeout(() => {
            navigator.geolocation.clearWatch(watchId);
        }, 30000);

        return () => {
            navigator.geolocation.clearWatch(watchId);
            clearTimeout(safetyTimer);
        };
    }, [map]);

    // Handle Night Mode and Satellite
    React.useEffect(() => {
        const container = map.getContainer();
        if (settings.nightMode) {
            container.classList.add('map-dark-mode');
        } else {
            container.classList.remove('map-dark-mode');
        }
    }, [settings.nightMode]);

    return null;
};

const MapView = ({ pois, onMapClick, settings, onUpdateSettings, onReportPoi, onShowDetail, onCenterChange }) => {
    const [mapInstance, setMapInstance] = React.useState(null);

    const handleZoomIn = () => {
        if (mapInstance) mapInstance.zoomIn();
    };

    const handleZoomOut = () => {
        if (mapInstance) mapInstance.zoomOut();
    };

    const handleLocate = () => {
        if (!mapInstance || !navigator.geolocation) return;
        const userIcon = L.divIcon({
            className: 'user-location-marker',
            html: `
                <div style="position:relative;width:28px;height:28px;">
                    <div style="position:absolute;inset:0;background:rgba(59,130,246,0.3);border-radius:50%;animation:pulse-ring 2s ease-out infinite;"></div>
                    <div style="position:absolute;top:5px;left:5px;width:18px;height:18px;background:#2563eb;border:3px solid white;border-radius:50%;box-shadow:0 2px 10px rgba(37,99,235,0.6);"></div>
                </div>
            `,
            iconSize: [28, 28],
            iconAnchor: [14, 14],
        });
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude, accuracy } = position.coords;
                const latlng = L.latLng(latitude, longitude);
                mapInstance.flyTo(latlng, 17, { duration: 1.5 });
                L.marker(latlng, { icon: userIcon, zIndexOffset: 1000 })
                    .addTo(mapInstance)
                    .bindPopup(`<b>📍 Vous êtes ici</b><br><span style="font-size:11px;color:#666;">Précision: ~${Math.round(accuracy)}m</span>`)
                    .openPopup();
            },
            (err) => console.warn("Localisation échouée:", err.message),
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 60000 }
        );
    };

    return (
        <div className="relative w-full h-full bg-slate-100 overflow-hidden">
            <style>
                {`
                .map-dark-mode .leaflet-tile-pane {
                    filter: invert(100%) hue-rotate(180deg) brightness(95%) contrast(90%);
                }
                .map-dark-mode .leaflet-container {
                    background: #191a1a !important;
                }
                @keyframes pulse-ring {
                    0% { transform: scale(1); opacity: 1; }
                    100% { transform: scale(2.5); opacity: 0; }
                }
                .user-location-marker { background: transparent !important; border: none !important; }
                `}
            </style>

            <MapContainer
                center={CAMAYENNE_CENTER}
                zoom={15}
                className="w-full h-full"
                zoomControl={false}
                ref={setMapInstance}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url={settings.satelliteMode
                        ? "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                        : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    }
                />

                <MapController onMapClick={onMapClick} onCenterChange={onCenterChange} settings={settings} />

                {pois.map((poi) => (
                    <Marker key={poi.id} position={[poi.latitude, poi.longitude]}>
                        <Popup className="premium-popup">
                            <div className="w-64 p-2">
                                {poi.photo && (
                                    <img src={poi.photo} alt={poi.nom} className="w-full h-32 object-cover rounded-xl mb-3" />
                                )}
                                <h3 className="text-lg font-black text-gray-900 leading-tight mb-1">{poi.nom}</h3>
                                <p className="text-xs text-blue-600 font-bold uppercase mb-2">ID: {poi.id}</p>
                                <p className="text-sm text-gray-500 leading-relaxed mb-4">{poi.description}</p>
                                <div className="flex gap-2">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onShowDetail(poi);
                                        }}
                                        className="flex-1 bg-blue-600 text-white py-2.5 rounded-xl font-bold text-xs shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95"
                                    >
                                        Voir les détails
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onReportPoi(poi);
                                        }}
                                        className="p-2.5 bg-rose-50 text-rose-500 rounded-xl hover:bg-rose-100 transition-colors"
                                        title="Signaler un problème"
                                    >
                                        <AlertTriangle size={18} />
                                    </button>
                                </div>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>

            {/* Custom Map Controls */}
            <div className="absolute right-6 top-6 z-[1000] flex flex-col gap-3">
                <div className="flex flex-col bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                    <button
                        onClick={handleZoomIn}
                        className="p-3 hover:bg-gray-50 text-gray-600 border-b border-gray-100 transition-colors"
                    >
                        <Plus size={20} />
                    </button>
                    <button
                        onClick={handleZoomOut}
                        className="p-3 hover:bg-gray-50 text-gray-600 transition-colors"
                    >
                        <Minus size={20} />
                    </button>
                </div>

                <button
                    onClick={handleLocate}
                    className="p-4 bg-white text-blue-600 rounded-2xl shadow-xl border border-gray-100 hover:bg-blue-50 transition-all hover:scale-105 active:scale-95"
                >
                    <Navigation size={22} fill="currentColor" />
                </button>
            </div>

            <div className="absolute bottom-6 left-6 z-[1000] flex gap-3">
                <button
                    onClick={() => onUpdateSettings({ ...settings, satelliteMode: !settings.satelliteMode })}
                    className={`flex items-center gap-2 px-4 py-3 rounded-2xl shadow-xl border border-gray-100 font-bold text-xs transition-all ${settings.satelliteMode ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
                        }`}
                >
                    <Layers size={18} className={settings.satelliteMode ? 'text-white' : 'text-blue-600'} />
                    {settings.satelliteMode ? 'Vue Satellite' : 'Vue Plan'}
                </button>
                <button
                    onClick={() => onUpdateSettings({ ...settings, nightMode: !settings.nightMode })}
                    className={`p-3 rounded-2xl shadow-xl transition-all ${settings.nightMode ? 'bg-blue-600 text-white' : 'bg-gray-900 text-white hover:bg-black'
                        }`}
                >
                    {settings.nightMode ? <Sun size={18} /> : <Moon size={18} />}
                </button>
            </div>
        </div>
    );
};

export default MapView;
