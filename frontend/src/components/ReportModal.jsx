import React, { useState } from 'react';
import { X, AlertCircle, Send, CheckCircle2 } from 'lucide-react';
import api from '../services/api';

const ReportModal = ({ isOpen, onClose, poi, pois }) => {
    const [selectedPoiId, setSelectedPoiId] = useState(poi?.id || '');
    const [formData, setFormData] = useState({
        type: 'erreur_position',
        description: ''
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    // Mettre à jour selectedPoiId si poi change
    React.useEffect(() => {
        if (poi) setSelectedPoiId(poi.id);
    }, [poi]);

    const TYPES = [
        { id: 'erreur_position', label: 'Position incorrecte', color: 'orange' },
        { id: 'lieu_ferme', label: 'Ce lieu est fermé', color: 'rose' },
        { id: 'nom_incorrect', label: 'Nom incorrect', color: 'blue' },
        { id: 'autre', label: 'Autre problème', color: 'slate' }
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedPoiId) {
            alert("Veuillez sélectionner un lieu.");
            return;
        }
        setLoading(true);
        try {
            await api.post('/signalements', {
                ...formData,
                poiId: parseInt(selectedPoiId)
            });
            setSuccess(true);
            setTimeout(() => {
                onClose();
                setSuccess(false);
                setFormData({ type: 'erreur_position', description: '' });
                if (!poi) setSelectedPoiId('');
            }, 2000);
        } catch (error) {
            console.error("Erreur signalement", error);
            alert("Erreur lors de l'envoi du signalement.");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    const currentPoi = poi || pois?.find(p => p.id === parseInt(selectedPoiId));

    return (
        <div className="fixed inset-0 z-[4000] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-fade-in">
            <div className="glass w-full max-w-md rounded-[32px] shadow-2xl overflow-hidden border-white/40 animate-slide-up">

                {/* Header */}
                <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/20">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-rose-500 text-white rounded-xl shadow-lg shadow-rose-200">
                            <AlertCircle size={20} />
                        </div>
                        <h2 className="text-xl font-black text-slate-900">Signaler un problème</h2>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white rounded-xl transition-all text-slate-400">
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 text-left">
                    {success ? (
                        <div className="py-8 flex flex-col items-center gap-4 text-center">
                            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center animate-bounce">
                                <CheckCircle2 size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900">Merci !</h3>
                            <p className="text-slate-500 font-medium">Votre signalement a été transmis aux modérateurs.</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-4">
                                {!poi ? (
                                    <div className="space-y-2">
                                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-1">Quel lieu souhaitez-vous signaler ?</label>
                                        <select
                                            value={selectedPoiId}
                                            onChange={(e) => setSelectedPoiId(e.target.value)}
                                            className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl outline-none focus:ring-4 focus:ring-blue-100 transition-all font-bold text-sm"
                                        >
                                            <option value="">Sélectionnez un lieu...</option>
                                            {pois?.map(p => (
                                                <option key={p.id} value={p.id}>{p.nom}</option>
                                            ))}
                                        </select>
                                    </div>
                                ) : (
                                    <p className="text-sm font-bold text-slate-600 mb-4 px-1">
                                        Signaler une erreur pour : <span className="text-blue-600">"{poi.nom}"</span>
                                    </p>
                                )}

                                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-1">Type de problème</label>
                                <div className="grid grid-cols-2 gap-3">
                                    {TYPES.map(type => (
                                        <button
                                            key={type.id}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, type: type.id })}
                                            className={`p-3 rounded-2xl text-[11px] font-black uppercase tracking-tighter transition-all border ${formData.type === type.id
                                                ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-100'
                                                : 'bg-white text-slate-500 border-slate-100 hover:border-blue-200'
                                                }`}
                                        >
                                            {type.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-1">Description (Optionnel)</label>
                                <textarea
                                    className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl outline-none focus:ring-4 focus:ring-blue-100 transition-all font-medium text-sm min-h-[100px]"
                                    placeholder="Précisez le problème..."
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black shadow-xl hover:bg-black active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3"
                            >
                                {loading ? (
                                    <div className="w-5 h-5 border-3 border-white/20 border-t-white rounded-full animate-spin"></div>
                                ) : (
                                    <>
                                        <Send size={18} />
                                        Envoyer le signalement
                                    </>
                                )}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ReportModal;
