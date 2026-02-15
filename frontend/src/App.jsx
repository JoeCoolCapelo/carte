import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import MapView from './components/MapView';
import ChatbotAI from './components/ChatbotAI';
import AuthModal from './components/AuthModal';
import AddPoiModal from './components/AddPoiModal';
import AdminDashboard from './components/AdminDashboard';
import ReportModal from './components/ReportModal';
import PlaceDetailSheet from './components/PlaceDetailSheet';
import NotificationPanel from './components/NotificationPanel';
import SettingsPanel from './components/SettingsPanel';
import { Home, Compass, Plus, MessageCircle, User as UserIcon } from 'lucide-react';
import api from './services/api';

function App() {
    const [pois, setPois] = useState([]);
    const [filteredPois, setFilteredPois] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('home');
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
    const [mapSettings, setMapSettings] = useState({
        nightMode: false,
        satelliteMode: false
    });

    // Modal states
    const [isAuthOpen, setAuthOpen] = useState(false);
    const [isAddPoiOpen, setAddPoiOpen] = useState(false);
    const [isAdminOpen, setAdminOpen] = useState(false);
    const [isReportOpen, setReportOpen] = useState(false);
    const [isDetailOpen, setDetailOpen] = useState(false);
    const [isNotifOpen, setNotifOpen] = useState(false);
    const [isSettingsOpen, setSettingsOpen] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [selectedPoi, setSelectedPoi] = useState(null);
    const [mapCenter, setMapCenter] = useState({ lat: 9.528, lng: -13.693 });

    useEffect(() => {
        fetchPois();
    }, []);

    useEffect(() => {
        handleFilter();
    }, [pois, searchTerm, selectedCategory]);

    const fetchPois = async () => {
        try {
            const response = await api.get('/pois');
            setPois(response.data);
        } catch (error) {
            console.error("Erreur chargement POIs", error);
        }
    };

    const handleFilter = () => {
        let result = [...pois];

        // Filter by Category
        if (selectedCategory !== 'all' && selectedCategory !== 'home' && selectedCategory !== 'explore') {
            const categoryMapping = {
                health: 5, // Mapping based on categorical IDs defined in AddPoiModal
                food: 1,
                school: 6,
                bank: 3,
                religion: 8 // Autre/Religion
            };
            const catId = categoryMapping[selectedCategory];
            if (catId) {
                result = result.filter(p => p.categorieId === catId);
            }
        }

        // Filter by Search Term
        if (searchTerm.trim()) {
            const term = searchTerm.toLowerCase();
            result = result.filter(p =>
                p.nom.toLowerCase().includes(term) ||
                p.description?.toLowerCase().includes(term) ||
                p.adresse?.toLowerCase().includes(term)
            );
        }

        setFilteredPois(result);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

    const handleMapClick = (latlng) => {
        // Ajout via clic désactivé à la demande de l'utilisateur
        // On garde uniquement la logique si on veut plus tard ouvrir les détails d'un clic vide (non utilisé ici)
    };

    const handleAddPoiFromButton = () => {
        if (user?.role === 'admin') {
            setSelectedLocation(mapCenter);
            setAddPoiOpen(true);
        } else {
            alert("Accès réservé aux administrateurs.");
        }
    };

    return (
        <div className="h-screen w-full flex flex-col bg-white">
            {/* 1. Header Area */}
            <Header
                user={user}
                onOpenAuth={() => setAuthOpen(true)}
                onLogout={handleLogout}
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
                onToggleNotifications={() => { setNotifOpen(!isNotifOpen); setSettingsOpen(false); }}
                onToggleSettings={() => { setSettingsOpen(!isSettingsOpen); setNotifOpen(false); }}
                unreadCount={3}
            />

            <div className={`flex-1 flex overflow-hidden pt-[70px] ${!user ? 'filter blur-sm pointer-events-none select-none' : ''}`}>
                {/* 2. Sidebar (Desktop) */}
                <Sidebar
                    activeTab={selectedCategory}
                    isOpen={sidebarOpen}
                    userRole={user?.role}
                    setActiveTab={(tab) => {
                        if (tab === 'add') {
                            handleAddPoiFromButton();
                        } else {
                            setSelectedCategory(tab);
                            if (tab === 'report') {
                                setSelectedPoi(null);
                                setReportOpen(true);
                            } else if (tab === 'stats') {
                                if (user?.role === 'admin') setAdminOpen(true);
                                else alert("Accès réservé aux administrateurs.");
                            }
                        }
                    }}
                />

                {/* 3. Main Content (Map) */}
                <main className={`flex-1 relative flex flex-col h-full transition-all duration-300 ${sidebarOpen ? 'md:ml-[280px]' : 'md:ml-0'}`}>
                    <MapView
                        pois={filteredPois}
                        onMapClick={handleMapClick}
                        settings={mapSettings}
                        onUpdateSettings={setMapSettings}
                        onCenterChange={setMapCenter}
                        onReportPoi={(poi) => {
                            setSelectedPoi(poi);
                            setReportOpen(true);
                        }}
                        onShowDetail={(poi) => {
                            setSelectedPoi(poi);
                            setDetailOpen(true);
                        }}
                    />

                    {/* Chatbot module */}
                    <ChatbotAI />
                </main>
            </div>

            {/* 4. Mobile Navigation Bar (Bottom) */}
            {user && (
                <nav className="md:hidden fixed bottom-0 left-0 right-0 h-[70px] bg-white border-t border-gray-100 flex items-center justify-around px-2 z-[2500]">
                    {[
                        { id: 'home', icon: <Home size={22} />, label: 'Accueil' },
                        { id: 'explore', icon: <Compass size={22} />, label: 'Explorer' },
                        { id: 'add', icon: <Plus size={24} />, label: 'Ajouter', primary: true, adminOnly: true },
                        { id: 'ia', icon: <MessageCircle size={22} />, label: 'IA' },
                        { id: 'profile', icon: <UserIcon size={22} />, label: 'Profil' },
                    ].filter(item => !item.adminOnly || user?.role === 'admin').map((item) => (
                        <button
                            key={item.id}
                            onClick={() => {
                                if (item.id === 'add') {
                                    handleAddPoiFromButton();
                                } else if (item.id === 'ia') {
                                    // Trigger Chat IA
                                } else {
                                    setSelectedCategory(item.id);
                                }
                            }}
                            className={`flex flex-col items-center justify-center transition-all ${item.primary
                                ? 'bg-blue-600 text-white w-14 h-14 rounded-2xl -mt-10 shadow-xl shadow-blue-200 border-4 border-white'
                                : selectedCategory === item.id ? 'text-blue-600 font-bold' : 'text-gray-400'
                                }`}
                        >
                            {item.icon}
                            {!item.primary && <span className="text-[10px] mt-1 uppercase font-black tracking-tighter">{item.label}</span>}
                        </button>
                    ))}
                </nav>
            )}

            {/* Auth Wall - Force login if no user */}
            {!user && (
                <div className="fixed inset-0 z-[5000] flex items-center justify-center bg-slate-900/40 backdrop-blur-xl">
                    <div className="max-w-md w-full p-8 text-center bg-white rounded-[40px] shadow-2xl space-y-8 animate-slide-up">
                        <div className="w-20 h-20 bg-blue-600 rounded-3xl mx-auto flex items-center justify-center text-white shadow-xl shadow-blue-200">
                            <Home size={40} />
                        </div>
                        <div className="space-y-4">
                            <h2 className="text-3xl font-black text-slate-900">Bienvenue sur Camayenne Smart Map</h2>
                            <p className="text-slate-500 font-medium">Veuillez vous authentifier pour accéder à la carte et aux services.</p>
                        </div>
                        <button
                            onClick={() => setAuthOpen(true)}
                            className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all active:scale-[0.98]"
                        >
                            Commencer l'expérience
                        </button>
                    </div>
                </div>
            )}

            {/* 5. Modals */}
            <AuthModal
                isOpen={isAuthOpen}
                onClose={() => setAuthOpen(false)}
                onAuthSuccess={(u) => setUser(u)}
            />
            <AddPoiModal
                isOpen={isAddPoiOpen}
                onClose={() => setAddPoiOpen(false)}
                latlng={selectedLocation}
                onPoiAdded={fetchPois}
            />
            {user?.role === 'admin' && (
                <AdminDashboard isOpen={isAdminOpen} onClose={() => setAdminOpen(false)} />
            )}
            <ReportModal
                isOpen={isReportOpen}
                onClose={() => setReportOpen(false)}
                poi={selectedPoi}
                pois={pois}
            />
            <PlaceDetailSheet
                isOpen={isDetailOpen}
                onClose={() => setDetailOpen(false)}
                poi={selectedPoi}
                onReport={(poi) => {
                    setDetailOpen(false);
                    setReportOpen(true);
                }}
            />
            <NotificationPanel
                isOpen={isNotifOpen}
                onClose={() => setNotifOpen(false)}
            />
            <SettingsPanel
                isOpen={isSettingsOpen}
                onClose={() => setSettingsOpen(false)}
                settings={mapSettings}
                onUpdateSettings={setMapSettings}
            />
        </div>
    );
}

export default App;
