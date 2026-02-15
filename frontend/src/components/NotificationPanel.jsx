import React, { useState } from 'react';
import { X, Bell, CheckCheck, Info, AlertTriangle, MapPin, Star } from 'lucide-react';

const initialNotifications = [
    {
        id: 1,
        type: 'info',
        icon: <Star size={18} />,
        title: 'Bienvenue sur CamayenneSmartMap !',
        message: 'Explorez les lieux, signalez des incidents et contribuez à la communauté.',
        time: 'Maintenant',
        read: false
    },
    {
        id: 2,
        type: 'alert',
        icon: <AlertTriangle size={18} />,
        title: 'Route bloquée signalée',
        message: 'Un utilisateur a signalé un obstacle sur la route principale de Camayenne.',
        time: 'Il y a 15 min',
        read: false
    },
    {
        id: 3,
        type: 'update',
        icon: <MapPin size={18} />,
        title: 'Nouveau lieu ajouté',
        message: 'La Pharmacie Centrale a été ajoutée à la carte.',
        time: 'Il y a 1h',
        read: false
    },
    {
        id: 4,
        type: 'info',
        icon: <Info size={18} />,
        title: 'Mise à jour de la carte',
        message: 'Les données des points d\'intérêt ont été actualisées.',
        time: 'Il y a 3h',
        read: true
    },
];

const typeStyles = {
    info: 'bg-blue-50 text-blue-600',
    alert: 'bg-rose-50 text-rose-500',
    update: 'bg-emerald-50 text-emerald-600',
};

const NotificationPanel = ({ isOpen, onClose }) => {
    const [notifications, setNotifications] = useState(initialNotifications);

    const unreadCount = notifications.filter(n => !n.read).length;

    const markAllAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    };

    const markAsRead = (id) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    };

    if (!isOpen) return null;

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
                        <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
                            <Bell size={20} />
                        </div>
                        <div>
                            <h2 className="font-black text-gray-900 text-lg leading-none">Notifications</h2>
                            {unreadCount > 0 && (
                                <p className="text-xs text-blue-600 font-bold mt-0.5">{unreadCount} non lue{unreadCount > 1 ? 's' : ''}</p>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {unreadCount > 0 && (
                            <button
                                onClick={markAllAsRead}
                                className="flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-xl transition-colors"
                            >
                                <CheckCheck size={14} />
                                Tout lire
                            </button>
                        )}
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-50 rounded-xl transition-colors text-gray-400"
                        >
                            <X size={18} />
                        </button>
                    </div>
                </div>

                {/* Notification List */}
                <div className="flex-1 overflow-y-auto p-3 space-y-2">
                    {notifications.length === 0 ? (
                        <div className="text-center py-12 text-gray-400">
                            <Bell size={40} className="mx-auto mb-3 opacity-30" />
                            <p className="font-bold">Aucune notification</p>
                        </div>
                    ) : (
                        notifications.map((notif) => (
                            <button
                                key={notif.id}
                                onClick={() => markAsRead(notif.id)}
                                className={`w-full text-left flex items-start gap-3 p-4 rounded-2xl transition-all duration-200 group ${notif.read
                                        ? 'bg-gray-50/50 hover:bg-gray-50'
                                        : 'bg-blue-50/50 hover:bg-blue-50 border border-blue-100/50'
                                    }`}
                            >
                                <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${typeStyles[notif.type] || typeStyles.info}`}>
                                    {notif.icon}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-0.5">
                                        <h4 className={`text-sm font-bold truncate ${notif.read ? 'text-gray-600' : 'text-gray-900'}`}>
                                            {notif.title}
                                        </h4>
                                        {!notif.read && (
                                            <span className="w-2.5 h-2.5 bg-blue-600 rounded-full flex-shrink-0 ml-2" />
                                        )}
                                    </div>
                                    <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{notif.message}</p>
                                    <span className="text-[10px] text-gray-400 font-bold mt-1 block">{notif.time}</span>
                                </div>
                            </button>
                        ))
                    )}
                </div>
            </div>
        </>
    );
};

export default NotificationPanel;
