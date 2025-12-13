import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Trophy, CalendarDays, ClipboardList, LogOut, LayoutDashboard, Dribbble } from 'lucide-react';

export const Sidebar: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const pathname = location.pathname;

    const isActive = (path: string) => pathname === path || (path !== '/' && pathname.startsWith(path));

    const navItems = [
        { label: 'Partidos', path: '/', icon: <LayoutDashboard size={20} /> },
        { label: 'Mis Predicciones', path: '/my-predictions', icon: <ClipboardList size={20} /> },
        { label: 'Leaderboard', path: '/leaderboard', icon: <Trophy size={20} /> },
        { label: 'Admin', path: '/admin', icon: <LogOut size={20} className="rotate-180" /> },
    ];

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    // Check if user is admin (simple check against localStorage object)
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;
    const isAdmin = user?.role === 'ADMIN';

    return (
        <div className="hidden md:flex flex-col w-64 border-r border-white/5 bg-field-card/50 h-screen sticky top-0 p-6">
            <div className="flex items-center gap-3 mb-10 px-2 cursor-pointer" onClick={() => navigate('/')}>
                <div className="w-10 h-10 bg-field rounded-xl flex items-center justify-center shadow-lg shadow-field/20">
                    <Dribbble size={24} className="text-white" />
                </div>
                <div>
                    <h1 className="font-bold text-lg leading-none">Mundial<br />Score</h1>
                </div>
            </div>

            <nav className="flex flex-col gap-2 flex-1">
                {navItems.filter(item => item.path !== '/admin').map((item) => (
                    <button
                        key={item.path}
                        onClick={() => navigate(item.path)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium text-sm text-left ${isActive(item.path)
                            ? 'bg-field text-white shadow-lg shadow-field/20'
                            : 'text-gray-400 hover:bg-white/5 hover:text-white'
                            }`}
                    >
                        {item.icon}
                        {item.label}
                    </button>
                ))}

                {isAdmin && (
                    <button
                        onClick={() => navigate('/admin')}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium text-sm text-left ${isActive('/admin')
                            ? 'bg-field text-white shadow-lg shadow-field/20'
                            : 'text-gray-400 hover:bg-white/5 hover:text-white'
                            }`}
                    >
                        <LogOut size={20} className="rotate-180" />
                        Admin
                    </button>
                )}
            </nav>

            <div className="mt-auto">
                <div className="p-4 rounded-xl bg-white/5 border border-white/5 flex items-center gap-3 cursor-pointer hover:bg-white/10 transition-colors group relative">
                    <div className="w-8 h-8 rounded-full bg-gray-700 overflow-hidden">
                        <img src="https://picsum.photos/seed/me/200" alt="Profile" className="w-full h-full object-cover" />
                    </div>
                    <div className="text-xs flex-1">
                        <div className="font-bold">Mi Cuenta</div>
                        <div className="text-gray-400">Ver Perfil</div>
                    </div>

                    <button onClick={(e) => { e.stopPropagation(); handleLogout(); }} className="p-2 hover:bg-white/10 rounded-full text-gray-400 hover:text-red-400 transition-colors" title="Cerrar Sesión">
                        <LogOut size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
};
