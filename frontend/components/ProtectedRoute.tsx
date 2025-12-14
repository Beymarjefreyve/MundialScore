import React from "react";
import { Navigate, Outlet } from "react-router-dom";

/**
 * ProtectedRoute - Wrapper that requires authentication.
 * Redirects to /login if no token is found in localStorage.
 */
export const ProtectedRoute: React.FC = () => {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};
