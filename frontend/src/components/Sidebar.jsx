import React from 'react';
import {
    Home,
    Compass,
    PlusSquare,
    BarChart3,
    Settings,
    HeartPulse,
    Utensils,
    GraduationCap,
    Landmark,
    Church,
    ChevronRight,
    AlertTriangle
} from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab, isOpen, userRole }) => {
    const categories = [
        { id: 'health', icon: <HeartPulse size={20} />, label: 'Santé', color: 'text-red-500' },
        { id: 'food', icon: <Utensils size={20} />, label: 'Restaurants', color: 'text-orange-500' },
        { id: 'school', icon: <GraduationCap size={20} />, label: 'Écoles', color: 'text-blue-500' },
        { id: 'bank', icon: <Landmark size={20} />, label: 'Banques', color: 'text-emerald-500' },
        { id: 'religion', icon: <Church size={20} />, label: 'Lieux religieux', color: 'text-purple-500' },
    ];

    const MenuItem = ({ id, icon, label, badge }) => (
        <button
            onClick={() => setActiveTab(id)}
            className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all duration-200 group ${activeTab === id
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 translate-x-1'
                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                }`}
        >
            <div className="flex items-center gap-3">
                <span className={activeTab === id ? 'text-white' : 'text-gray-400 group-hover:text-blue-600'}>
                    {icon}
                </span>
                <span className="font-bold text-[15px]">{label}</span>
            </div>
            {badge && (
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-black ${activeTab === id ? 'bg-white/20 text-white' : 'bg-blue-100 text-blue-600'
                    }`}>
                    {badge}
                </span>
            )}
        </button>
    );

    return (
        <aside className={`fixed left-0 top-[70px] bottom-0 w-[280px] bg-white border-r border-gray-100 p-6 flex flex-col hidden md:flex z-[1000] transition-all duration-300 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
            <div className="space-y-2 mb-8">
                <MenuItem id="home" icon={<Home size={20} />} label="Accueil" />
                <MenuItem id="explore" icon={<Compass size={20} />} label="Explorer" badge="NEW" />
            </div>

            <div className="mb-8 overflow-y-auto flex-1 h-0 scrollbar-hide">
                <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.15em] mb-4 px-4">
                    Catégories
                </h3>
                <div className="space-y-1">
                    {categories.map((cat) => {
                        const isActive = activeTab === cat.id;
                        return (
                            <button
                                key={cat.id}
                                onClick={() => setActiveTab(cat.id)}
                                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all group ${isActive ? 'bg-blue-50' : 'hover:bg-gray-50'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <span className={`${isActive ? cat.color : 'text-gray-400 opacity-80 group-hover:opacity-100 group-hover:' + cat.color} transition-all`}>
                                        {cat.icon}
                                    </span>
                                    <span className={`text-[14px] font-semibold transition-colors ${isActive ? 'text-blue-700' : 'text-gray-600 group-hover:text-gray-900'
                                        }`}>
                                        {cat.label}
                                    </span>
                                </div>
                                <ChevronRight size={16} className={`transition-all ${isActive ? 'text-blue-400 translate-x-0.5' : 'text-gray-300 group-hover:text-gray-500'
                                    }`} />
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="mt-auto space-y-2 pt-6 border-t border-gray-50">
                <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.15em] mb-4 px-4">
                    Outils
                </h3>
                {userRole === 'admin' && (
                    <MenuItem id="add" icon={<PlusSquare size={20} />} label="Ajouter un lieu" />
                )}
                <MenuItem id="report" icon={<AlertTriangle size={20} />} label="Signaler un problème" />
                <MenuItem id="stats" icon={<BarChart3 size={20} />} label="Statistiques" />
            </div>
        </aside>
    );
};

export default Sidebar;
