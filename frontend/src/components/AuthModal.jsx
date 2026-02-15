import React, { useState } from 'react';
import { X, Mail, Lock, User, LogIn, ChevronRight } from 'lucide-react';
import api from '../services/api';

const AuthModal = ({ isOpen, onClose, onAuthSuccess }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({ nom: '', email: '', motDePasse: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const endpoint = isLogin ? '/auth/login' : '/auth/register';
            const response = await api.post(endpoint, formData);

            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));

            onAuthSuccess(response.data.user);
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || 'Une erreur est survenue');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[6000] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-fade-in">
            <div className="glass w-full max-w-md rounded-[32px] overflow-hidden shadow-2xl animate-scale-in">
                <div className="relative p-10">
                    <button onClick={onClose} className="absolute top-6 right-6 p-2.5 hover:bg-slate-100 rounded-full transition-all text-slate-400 hover:text-slate-600">
                        <X className="w-5 h-5" />
                    </button>

                    <div className="text-center mb-10">
                        <div className="inline-flex p-4 bg-blue-50 text-blue-600 rounded-2xl mb-6">
                            <LogIn className="w-8 h-8" />
                        </div>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                            {isLogin ? 'Bon retour !' : 'Bienvenue'}
                        </h2>
                        <p className="text-slate-500 font-medium mt-2 text-sm px-6">
                            {isLogin ? 'Connectez-vous pour continuer votre exploration de Camayenne.' : 'Créez votre compte pour contribuer à la carte et utiliser l\'IA.'}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {!isLogin && (
                            <div className="group relative">
                                <User className="absolute left-4 top-4 w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Nom complet"
                                    className="w-full bg-slate-50 border border-slate-100 pl-12 pr-4 py-4 rounded-2xl outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-medium text-[15px]"
                                    value={formData.nom}
                                    onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                                    required
                                />
                            </div>
                        )}
                        <div className="group relative">
                            <Mail className="absolute left-4 top-4 w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                            <input
                                type="email"
                                placeholder="Email professionnel ou perso"
                                className="w-full bg-slate-50 border border-slate-100 pl-12 pr-4 py-4 rounded-2xl outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-medium text-[15px]"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                            />
                        </div>
                        <div className="group relative">
                            <Lock className="absolute left-4 top-4 w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                            <input
                                type="password"
                                placeholder="Mot de passe sécurisé"
                                className="w-full bg-slate-50 border border-slate-100 pl-12 pr-4 py-4 rounded-2xl outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-medium text-[15px]"
                                value={formData.motDePasse}
                                onChange={(e) => setFormData({ ...formData, motDePasse: e.target.value })}
                                required
                            />
                        </div>

                        {error && (
                            <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl flex items-center gap-2 text-rose-600 text-[13px] font-bold">
                                <X className="w-4 h-4" /> {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all disabled:opacity-50 active:scale-[0.98] flex items-center justify-center gap-2 mt-4"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    {isLogin ? 'Se connecter' : "Créer mon compte"}
                                    <ChevronRight className="w-5 h-5" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 pt-8 border-t border-slate-100 text-center">
                        <p className="text-[14px] text-slate-500 font-medium">
                            {isLogin ? "Vous n'avez pas encore de compte ?" : "Vous possédez déjà un compte ?"}
                        </p>
                        <button
                            onClick={() => setIsLogin(!isLogin)}
                            className="mt-2 text-primary font-bold hover:text-black transition-colors"
                        >
                            {isLogin ? "S'inscrire gratuitement" : "Aller à la page de connexion"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthModal;
