import React, { useState } from 'react';
import { X, Settings, Moon, Sun, Layers, Globe, Monitor, MapPin } from 'lucide-react';

const SettingsPanel = ({ isOpen, onClose, settings, onUpdateSettings }) => {
    const [language, setLanguage] = useState('fr');

    if (!isOpen) return null;

    const ToggleSwitch = ({ enabled, onChange, label, description, icon, activeColor = 'bg-blue-600' }) => (
        <div className="flex items-center justify-between p-4 rounded-2xl hover:bg-gray-50 transition-colors group">
            <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${enabled ? `${activeColor} text-white shadow-lg` : 'bg-gray-100 text-gray-400 group-hover:bg-gray-200'
                    }`}>
                    {icon}
                </div>
                <div>
                    <p className="font-bold text-gray-900 text-sm">{label}</p>
                    <p className="text-xs text-gray-400">{description}</p>
                </div>
            </div>
            <button
                onClick={onChange}
                className={`relative w-12 h-7 rounded-full transition-all duration-300 ${enabled ? activeColor : 'bg-gray-200'
                    }`}
            >
                <span className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow-md transition-all duration-300 ${enabled ? 'left-[22px]' : 'left-0.5'
                    }`} />
            </button>
        </div>
    );

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 z-[3000] bg-black/20 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Panel */}
            <div className="fixed top-[70px] right-4 z-[3001] w-[380px] max-h-[75vh] bg-white rounded-3xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden animate-fade-up">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-900 rounded-2xl flex items-center justify-center text-white shadow-lg">
                            <Settings size={20} />
                        </div>
                        <h2 className="font-black text-gray-900 text-lg">Paramètres</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-50 rounded-xl transition-colors text-gray-400"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Settings List */}
                <div className="flex-1 overflow-y-auto p-3 space-y-1">
                    {/* Map Settings Section */}
                    <div className="px-3 pt-3 pb-1">
                        <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.15em]">
                            Carte
                        </h3>
                    </div>

                    <ToggleSwitch
                        enabled={settings.nightMode}
                        onChange={() => onUpdateSettings({ ...settings, nightMode: !settings.nightMode })}
                        label="Mode nuit"
                        description="Assombrir la carte pour le confort visuel"
                        icon={settings.nightMode ? <Moon size={18} /> : <Sun size={18} />}
                        activeColor="bg-indigo-600"
                    />

                    <ToggleSwitch
                        enabled={settings.satelliteMode}
                        onChange={() => onUpdateSettings({ ...settings, satelliteMode: !settings.satelliteMode })}
                        label="Vue satellite"
                        description="Afficher l'imagerie satellite"
                        icon={<Layers size={18} />}
                        activeColor="bg-emerald-600"
                    />

                    {/* Language Section */}
                    <div className="px-3 pt-5 pb-1">
                        <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.15em]">
                            Préférences
                        </h3>
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-2xl hover:bg-gray-50 transition-colors group">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gray-100 text-gray-400 flex items-center justify-center group-hover:bg-gray-200 transition-colors">
                                <Globe size={18} />
                            </div>
                            <div>
                                <p className="font-bold text-gray-900 text-sm">Langue</p>
                                <p className="text-xs text-gray-400">Choisir la langue de l'interface</p>
                            </div>
                        </div>
                        <select
                            value={language}
                            onChange={(e) => setLanguage(e.target.value)}
                            className="bg-gray-100 border-none rounded-xl px-3 py-2 text-sm font-bold text-gray-700 outline-none focus:ring-2 focus:ring-blue-200 cursor-pointer"
                        >
                            <option value="fr">🇫🇷 Français</option>
                            <option value="en">🇬🇧 English</option>
                        </select>
                    </div>

                    {/* App Info */}
                    <div className="mt-4 mx-3 p-4 bg-gray-50 rounded-2xl">
                        <div className="flex items-center gap-2 mb-2">
                            <Monitor size={16} className="text-gray-400" />
                            <span className="text-xs font-bold text-gray-500">À propos</span>
                        </div>
                        <p className="text-xs text-gray-400 leading-relaxed">
                            <span className="font-black text-gray-600">CamayenneSmartMap</span> — v1.0.0
                            <br />
                            Application de cartographie interactive pour Camayenne.
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SettingsPanel;
