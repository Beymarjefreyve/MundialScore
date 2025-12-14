import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

/**
 * AdminRoute - Wrapper that requires authentication AND admin role.
 * Redirects to /login if no token, or to /matches if not admin.
 */
export const AdminRoute: React.FC = () => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  
  if (!user || user.role !== 'ADMIN') {
    return <Navigate to="/matches" replace />;
  }
  
  return <Outlet />;
};
