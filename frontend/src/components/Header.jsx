import React from 'react';
import { Search, Bell, Settings, User, Map as MapIcon, Menu } from 'lucide-react';

const Header = ({ user, onOpenAuth, onLogout, searchTerm, onSearchChange, toggleSidebar, onToggleNotifications, onToggleSettings, unreadCount = 0 }) => {
    const [showUserMenu, setShowUserMenu] = React.useState(false);

    return (
        <header className="fixed top-0 left-0 right-0 h-[70px] bg-white border-b border-gray-100 flex items-center justify-between px-6 z-[2000] shadow-sm glass-effect">
            <div className="flex items-center gap-3 min-w-[280px]">
                <button
                    onClick={toggleSidebar}
                    className="p-2 hover:bg-gray-50 rounded-xl transition-all text-gray-500 hidden md:block"
                >
                    <Menu size={24} />
                </button>
                <div className="bg-blue-600 p-2 rounded-xl text-white">
                    <MapIcon size={24} strokeWidth={2.5} />
                </div>
                <h1 className="text-xl font-black text-gray-900 tracking-tight">
                    Camayenne<span className="text-blue-600">Smart</span>Map
                </h1>
            </div>

            <div className="flex-1 max-w-2xl px-8 hidden md:block">
                <div className="relative group">
                    <Search className="absolute left-4 top-3 text-gray-400 group-focus-within:text-blue-600 transition-colors" size={20} />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                        placeholder="Rechercher à Camayenne (ex: Pharmacie, Place du Port...)"
                        className="w-full bg-gray-50 border border-gray-100 py-3 pl-12 pr-4 rounded-2xl outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-200 transition-all font-medium text-sm"
                    />
                </div>
            </div>

            <div className="flex items-center gap-2">
                <button
                    onClick={onToggleNotifications}
                    className="p-2.5 text-gray-500 hover:bg-gray-50 rounded-xl transition-colors relative active:scale-95"
                >
                    <Bell size={22} />
                    {unreadCount > 0 && (
                        <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-red-500 rounded-full border-2 border-white flex items-center justify-center text-[9px] font-black text-white px-1">
                            {unreadCount}
                        </span>
                    )}
                </button>
                <button
                    onClick={onToggleSettings}
                    className="p-2.5 text-gray-500 hover:bg-gray-50 rounded-xl transition-colors hidden sm:block active:scale-95"
                >
                    <Settings size={22} />
                </button>

                <div className="h-8 w-[1px] bg-gray-100 mx-2"></div>

                {user ? (
                    <div className="relative">
                        <button
                            onClick={() => setShowUserMenu(!showUserMenu)}
                            className="flex items-center gap-3 pl-2 group"
                        >
                            <div className="flex flex-col items-end hidden lg:flex">
                                <span className="text-sm font-bold text-gray-900 leading-none">{user.nom}</span>
                                <span className="text-[10px] text-blue-600 font-bold uppercase tracking-wider">{user.role}</span>
                            </div>
                            <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-lg shadow-blue-200 cursor-pointer hover:scale-105 transition-transform">
                                {user.nom?.charAt(0).toUpperCase() || 'U'}
                            </div>
                        </button>

                        {showUserMenu && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 animate-fade-up overflow-hidden">
                                <button
                                    onClick={() => {
                                        onLogout();
                                        setShowUserMenu(false);
                                    }}
                                    className="w-full text-left px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-50 transition-colors"
                                >
                                    Déconnexion
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <button
                        onClick={onOpenAuth}
                        className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95"
                    >
                        <User size={18} />
                        Se connecter
                    </button>
                )}
            </div>
        </header>
    );
};

export default Header;
