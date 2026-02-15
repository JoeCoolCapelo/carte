import React, { useState } from 'react';
import { X, MapPin, Tag, FileText, Send, Camera, Info, Navigation, Mountain, CheckCircle2 } from 'lucide-react';
import api from '../services/api';

const AddPoiModal = ({ isOpen, onClose, latlng, onPoiAdded }) => {
    const [formData, setFormData] = useState({
        nom: '',
        description: '',
        adresse: '',
        altitude: 0,
        photo: '',
        statut: 'ouvert',
        categorieId: 8,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const CATEGORIES = [
        { id: 1, nom: 'Restaurant', color: 'orange' },
        { id: 2, nom: 'Pharmacie', color: 'rose' },
        { id: 3, nom: 'Banque', color: 'blue' },
        { id: 4, nom: 'Supermarché', color: 'emerald' },
        { id: 5, nom: 'Santé', color: 'red' },
        { id: 6, nom: 'Éducation', color: 'indigo' },
        { id: 7, nom: 'Hôtel', color: 'amber' },
        { id: 8, nom: 'Autre', color: 'slate' }
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await api.post('/pois', {
                ...formData,
                longitude: latlng.lng,
                latitude: latlng.lat
            });
            onPoiAdded();
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || 'Une erreur système est survenue.');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[2000] flex items-end md:items-center justify-center p-4 md:p-6 bg-slate-900/40 backdrop-blur-md animate-fade-in">
            <div className="glass w-full max-w-xl rounded-[40px] shadow-2xl animate-slide-up flex flex-col max-h-[90vh] overflow-hidden border-white/40">

                {/* Header Prof */}
                <div className="p-8 border-b border-white/10 bg-white/30 backdrop-blur-lg flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-primary text-white rounded-2xl shadow-lg shadow-primary/30">
                            <MapPin className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Nouveau Lieu</h2>
                            <p className="text-slate-500 font-bold text-[11px] uppercase tracking-widest mt-0.5">
                                Coordonnées : {latlng.lat.toFixed(4)}, {latlng.lng.toFixed(4)}
                            </p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-3 hover:bg-white rounded-2xl transition-all text-slate-400 hover:text-slate-600">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                    <form onSubmit={handleSubmit} className="space-y-6">

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[13px] font-black text-slate-400 uppercase tracking-widest px-1">Nom du lieu</label>
                                <div className="group relative">
                                    <Tag className="absolute left-4 top-4 w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                                    <input
                                        type="text"
                                        placeholder="Ex: Marché de Camayenne"
                                        className="w-full bg-white/50 border border-slate-100 pl-12 pr-4 py-4 rounded-2xl outline-none focus:ring-4 focus:ring-primary/10 transition-all font-bold text-[15px]"
                                        value={formData.nom}
                                        onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[13px] font-black text-slate-400 uppercase tracking-widest px-1">Catégorie</label>
                                <select
                                    className="w-full bg-white/50 border border-slate-100 px-4 py-4 rounded-2xl outline-none focus:ring-4 focus:ring-primary/10 transition-all font-bold text-[15px] appearance-none"
                                    value={formData.categorieId}
                                    onChange={(e) => setFormData({ ...formData, categorieId: parseInt(e.target.value) })}
                                >
                                    {CATEGORIES.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.nom}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[13px] font-black text-slate-400 uppercase tracking-widest px-1">Adresse physique</label>
                            <div className="group relative">
                                <Navigation className="absolute left-4 top-4 w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Quartier, Rue, près de..."
                                    className="w-full bg-white/50 border border-slate-100 pl-12 pr-4 py-4 rounded-2xl outline-none focus:ring-4 focus:ring-primary/10 transition-all font-bold text-[15px]"
                                    value={formData.adresse}
                                    onChange={(e) => setFormData({ ...formData, adresse: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[13px] font-black text-slate-400 uppercase tracking-widest px-1">Altitude (mètres)</label>
                                <div className="group relative">
                                    <Mountain className="absolute left-4 top-4 w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                                    <input
                                        type="number"
                                        className="w-full bg-white/50 border border-slate-100 pl-12 pr-4 py-4 rounded-2xl outline-none focus:ring-4 focus:ring-primary/10 transition-all font-bold text-[15px]"
                                        value={formData.altitude}
                                        onChange={(e) => setFormData({ ...formData, altitude: parseFloat(e.target.value) })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[13px] font-black text-slate-400 uppercase tracking-widest px-1">Statut opérationnel</label>
                                <div className="flex bg-slate-100 p-1 rounded-2xl gap-1">
                                    {['ouvert', 'ferme', 'en_attente'].map(s => (
                                        <button
                                            key={s}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, statut: s })}
                                            className={`flex-1 py-3 px-1 rounded-xl text-[10px] font-black uppercase tracking-tighter transition-all ${formData.statut === s ? 'bg-white shadow-lg text-slate-900 border border-slate-200' : 'text-slate-400 hover:text-slate-600'
                                                }`}
                                        >
                                            {s.replace('_', ' ')}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[13px] font-black text-slate-400 uppercase tracking-widest px-1">Lien de la photo</label>
                            <div className="group relative">
                                <Camera className="absolute left-4 top-4 w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                                <input
                                    type="text"
                                    placeholder="URL vers l'image du bâtiment..."
                                    className="w-full bg-white/50 border border-slate-100 pl-12 pr-4 py-4 rounded-2xl outline-none focus:ring-4 focus:ring-primary/10 transition-all font-bold text-[15px]"
                                    value={formData.photo}
                                    onChange={(e) => setFormData({ ...formData, photo: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[13px] font-black text-slate-400 uppercase tracking-widest px-1">Description détaillée</label>
                            <div className="group relative">
                                <FileText className="absolute left-4 top-4 w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                                <textarea
                                    placeholder="Précisez les horaires, spécialités, ou services particuliers..."
                                    className="w-full bg-white/50 border border-slate-100 pl-12 pr-4 py-4 rounded-2xl outline-none focus:ring-4 focus:ring-primary/10 transition-all font-medium text-[15px] min-h-[120px]"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="bg-rose-50 border border-rose-100 p-4 rounded-2xl flex items-center gap-3 text-rose-600 font-bold text-sm">
                                <AlertTriangle className="w-5 h-5" /> {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-slate-900 text-white py-5 rounded-[24px] font-black shadow-2xl transition-all shadow-slate-200 hover:bg-black active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3 text-lg"
                        >
                            {loading ? (
                                <div className="w-6 h-6 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    <CheckCircle2 className="w-6 h-6" />
                                    Publier sur Camayenne
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddPoiModal;
