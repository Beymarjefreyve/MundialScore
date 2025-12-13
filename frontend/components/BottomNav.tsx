import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Trophy, CalendarDays, ClipboardList, LogOut, LayoutDashboard } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const pathname = location.pathname;

  const isActive = (path: string) => pathname === path;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const navItems = [
    { label: 'Partidos', path: '/', icon: <LayoutDashboard size={22} /> },
    { label: 'Mis Predicciones', path: '/my-predictions', icon: <ClipboardList size={22} /> },
    { label: 'Leaderboard', path: '/leaderboard', icon: <Trophy size={22} /> },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-field-dark/95 backdrop-blur-md border-t border-white/5 pb-safe pt-2 px-6 z-50">
      <div className="flex justify-between items-center max-w-md mx-auto h-[60px]">
        {navItems.map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`flex flex-col items-center gap-1 transition-colors duration-200 ${isActive(item.path) ? 'text-field' : 'text-gray-500 hover:text-gray-300'
              }`}
          >
            <div className={`relative ${isActive(item.path) ? '-translate-y-1' : ''} transition-transform`}>
              {item.icon}
              {isActive(item.path) && (
                <span className="absolute -top-2 -right-2 w-1.5 h-1.5 bg-field rounded-full" />
              )}
            </div>
            <span className="text-[10px] font-medium">{item.label}</span>
          </button>
        ))}

        <button
          onClick={handleLogout}
          className="flex flex-col items-center gap-1 transition-colors duration-200 text-gray-500 hover:text-gray-300"
        >
          <div className="relative transition-transform">
            <LogOut size={22} className="rotate-0" />
          </div>
          <span className="text-[10px] font-medium">Cerrar Sesión</span>
        </button>
      </div>
    </div>
  );
};