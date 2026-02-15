import React from 'react';
import { X, MapPin, Navigation, Info, Clock, Globe, Phone, Heart, Share2, AlertTriangle } from 'lucide-react';

const PlaceDetailSheet = ({ isOpen, onClose, poi, onReport }) => {
    if (!isOpen || !poi) return null;

    return (
        <div className={`fixed inset-y-0 right-0 w-full md:w-[400px] bg-white shadow-2xl z-[3500] transform transition-transform duration-500 ease-out flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>

            {/* Image Header */}
            <div className="relative h-[250px] w-full bg-slate-100">
                {poi.photo ? (
                    <img src={poi.photo} alt={poi.nom} className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-blue-50 text-blue-200">
                        <MapPin size={80} />
                    </div>
                )}
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 p-2 bg-black/20 backdrop-blur-md text-white rounded-full hover:bg-black/40 transition-all"
                >
                    <X size={20} />
                </button>
                <div className="absolute bottom-6 left-6 right-6">
                    <span className="px-3 py-1 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-lg shadow-lg">
                        {poi.categorieId === 1 ? 'Restaurant' : poi.categorieId === 2 ? 'Pharmacie' : 'Lieu Public'}
                    </span>
                    <h2 className="text-2xl font-black text-white mt-2 drop-shadow-md">{poi.nom}</h2>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
                <div className="flex gap-4 mb-8">
                    <button className="flex-1 bg-blue-600 text-white py-4 rounded-2xl font-black shadow-xl shadow-blue-100 flex items-center justify-center gap-2 hover:bg-blue-700 transition-all">
                        <Navigation size={18} fill="currentColor" />
                        S'y rendre
                    </button>
                    <button className="p-4 bg-gray-50 text-gray-400 rounded-2xl hover:text-blue-600 hover:bg-blue-50 transition-all">
                        <Heart size={20} />
                    </button>
                    <button className="p-4 bg-gray-50 text-gray-400 rounded-2xl hover:text-blue-600 hover:bg-blue-50 transition-all">
                        <Share2 size={20} />
                    </button>
                </div>

                <div className="space-y-8">
                    {/* Description */}
                    <div className="space-y-3">
                        <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                            <Info size={14} /> À propos
                        </h3>
                        <p className="text-gray-600 leading-relaxed font-medium">
                            {poi.description || "Aucune description détaillée n'est disponible pour ce lieu pour le moment."}
                        </p>
                    </div>

                    {/* Info List */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
                            <MapPin className="text-blue-600" size={20} />
                            <div>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-tight">Adresse</p>
                                <p className="text-sm font-bold text-gray-700">{poi.adresse || 'Camayenne, Conakry'}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
                            <Clock className="text-blue-600" size={20} />
                            <div>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-tight">Horaires</p>
                                <p className="text-sm font-bold text-gray-700">Ouvert • Ferme à 19:00</p>
                            </div>
                        </div>
                    </div>

                    {/* Actions secondaires */}
                    <button
                        onClick={() => onReport(poi)}
                        className="w-full flex items-center justify-center gap-2 py-4 border-2 border-dashed border-gray-100 rounded-2xl text-gray-400 font-bold text-sm hover:border-rose-200 hover:text-rose-500 transition-all"
                    >
                        <AlertTriangle size={18} />
                        Signaler une erreur sur ce lieu
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PlaceDetailSheet;
