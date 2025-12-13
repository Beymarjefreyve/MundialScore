import React from 'react';
import { BottomNav } from './BottomNav';
import { Sidebar } from './Sidebar';
import { useLocation } from 'react-router-dom';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  return (
    <div className="min-h-screen bg-field-dark text-white font-sans selection:bg-field selection:text-white flex flex-col md:flex-row">
      {/* Sidebar only on Desktop, hidden on auth pages */}
      {!isAuthPage && <Sidebar />}

      {/* Main Content Area */}
      <div className={`flex-1 relative flex flex-col min-h-screen ${!isAuthPage ? 'pb-24' : ''} md:pb-0 overflow-x-hidden`}>
        <div className={`mx-auto w-full ${isAuthPage ? 'max-w-md' : 'max-w-md md:max-w-5xl lg:max-w-7xl'} h-full p-0 md:p-6 lg:p-8 transition-all duration-300`}>
          {children}
        </div>
      </div>

      {/* BottomNav only on Mobile, hidden on auth pages */}
      {!isAuthPage && <div className="md:hidden"><BottomNav /></div>}
    </div>
  );
};