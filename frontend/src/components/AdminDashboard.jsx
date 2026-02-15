import React, { useState, useEffect } from 'react';
import { Shield, Check, X, AlertTriangle, Clock, MapPin, User, ChevronRight, Filter, Search } from 'lucide-react';
import api from '../services/api';

const AdminDashboard = ({ isOpen, onClose }) => {
    const [signalements, setSignalements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('tous');

    useEffect(() => {
        if (isOpen) fetchSignalements();
    }, [isOpen]);

    const fetchSignalements = async () => {
        setLoading(true);
        try {
            const response = await api.get('/signalements');
            setSignalements(response.data);
        } catch (error) {
            console.error("Erreur chargement signalements", error);
        } finally {
            setLoading(false);
        }
    };

    const updateStatut = async (id, nouveauStatut) => {
        try {
            await api.put(`/signalements/${id}`, { statut: nouveauStatut });
            setSignalements(signalements.map(s => s.id === id ? { ...s, statut: nouveauStatut } : s));
        } catch (error) {
            console.error("Erreur update", error);
            alert("Erreur lors de la mise à jour du statut.");
        }
    };

    if (!isOpen) return null;

    const filteredItems = signalements.filter(s => filter === 'tous' || s.statut === filter);

    return (
        <div className="fixed inset-0 z-[3000] flex items-center justify-center p-4 md:p-8 bg-slate-900/60 backdrop-blur-xl animate-fade-in">
            <div className="glass w-full max-w-5xl h-[85vh] rounded-[40px] shadow-2xl flex flex-col overflow-hidden animate-scale-in">
                {/* Admin Header */}
                <div className="p-8 border-b border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white/40">
                    <div className="flex items-center gap-5">
                        <div className="p-4 bg-rose-500 text-white rounded-[24px] shadow-xl shadow-rose-200">
                            <Shield className="w-7 h-7" />
                        </div>
                        <div>
                            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Modération</h2>
                            <p className="text-slate-500 font-medium">Supervisez et validez les contributions de la communauté.</p>
                        </div>
                    </div>
                    <div className="flex gap-2 self-end md:self-auto">
                        <button onClick={fetchSignalements} className="p-3 hover:bg-white rounded-2xl transition-all text-slate-400 hover:text-primary">
                            <Clock className="w-6 h-6" />
                        </button>
                        <button onClick={onClose} className="p-3 bg-slate-100 hover:bg-slate-200 rounded-2xl transition-all text-slate-600">
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                {/* Filters & Stats Bar */}
                <div className="px-8 py-4 bg-slate-50/50 border-b border-slate-100 flex items-center gap-4 overflow-x-auto whitespace-nowrap scrollbar-hide">
                    <div className="flex items-center gap-2 p-1.5 bg-white rounded-2xl border border-slate-100 shadow-sm">
                        {['tous', 'en_attente', 'valide', 'rejete'].map(f => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${filter === f ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'
                                    }`}
                            >
                                {f.replace('_', ' ')}
                            </button>
                        ))}
                    </div>
                    <span className="text-slate-300 mx-2">|</span>
                    <div className="flex items-center gap-2 text-sm font-bold text-slate-400 lowercase">
                        <AlertTriangle className="w-4 h-4 text-orange-400" />
                        <span>{signalements.filter(s => s.statut === 'en_attente').length} Urgent</span>
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto p-8 bg-slate-50/20">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center h-full gap-4">
                            <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                            <p className="text-slate-400 font-bold animate-pulse">Synchronisation des données...</p>
                        </div>
                    ) : filteredItems.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-slate-300">
                            <div className="w-24 h-24 rounded-full bg-slate-100 flex items-center justify-center mb-6">
                                <Check className="w-12 h-12" />
                            </div>
                            <p className="font-bold text-xl">Tout est en ordre !</p>
                            <p className="text-sm font-medium mt-1">Vous avez traité tous les signalements pour cette vue.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                            {filteredItems.map((sig) => (
                                <div key={sig.id} className="group glass p-6 rounded-[32px] flex flex-col gap-6 transition-all hover:scale-[1.01] hover:shadow-2xl border border-white/50 bg-white/60">
                                    <div className="flex justify-between items-start">
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center gap-2">
                                                <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter ${sig.type === 'erreur_position' ? 'bg-orange-100 text-orange-600' : 'bg-rose-100 text-rose-600'
                                                    }`}>
                                                    {sig.type.replace('_', ' ')}
                                                </span>
                                                <div className="flex items-center gap-1 text-[11px] font-bold text-slate-400">
                                                    <Clock className="w-3.5 h-3.5" /> {new Date(sig.dateCreation).toLocaleDateString()}
                                                </div>
                                            </div>
                                            <h3 className="text-lg font-bold text-slate-800 mt-2 flex items-center gap-2">
                                                Signalement #{sig.id} <ChevronRight className="w-4 h-4 text-slate-300" /> Lieu #{sig.poiId}
                                            </h3>
                                        </div>
                                        <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center">
                                            <MapPin className="w-6 h-6" />
                                        </div>
                                    </div>

                                    <div className="p-4 bg-slate-900/5 rounded-2xl border border-black/5">
                                        <p className="text-[14px] text-slate-600 font-medium leading-relaxed italic">
                                            "{sig.description || 'Aucune description fournie.'}"
                                        </p>
                                    </div>

                                    <div className="flex items-center justify-between mt-auto pt-2">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center text-[10px] font-black text-slate-500">
                                                {sig.utilisateurId}
                                            </div>
                                            <span className="text-[11px] font-bold text-slate-400 tracking-wide uppercase">Contributeur ID</span>
                                        </div>

                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => updateStatut(sig.id, 'rejete')}
                                                className={`p-3 rounded-xl transition-all ${sig.statut === 'rejete' ? 'bg-rose-500 text-white' : 'bg-slate-100 text-slate-400 hover:bg-rose-50 hover:text-rose-500'
                                                    }`}
                                                title="Rejeter"
                                            >
                                                <X className="w-5 h-5" />
                                            </button>
                                            <button
                                                onClick={() => updateStatut(sig.id, 'valide')}
                                                className={`p-3 rounded-xl transition-all ${sig.statut === 'valide' ? 'bg-emerald-500 text-white shadow-xl shadow-emerald-200/50' : 'bg-slate-100 text-slate-400 hover:bg-emerald-50 hover:text-emerald-500'
                                                    }`}
                                                title="Valider"
                                            >
                                                <Check className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
