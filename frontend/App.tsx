import React from 'react';
import { Routes, Route, Navigate, HashRouter } from 'react-router-dom';
import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AdminRoute } from './components/AdminRoute';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Matches } from './pages/Matches';
import { PredictionPage } from './pages/Prediction';
import { MyPredictions } from './pages/MyPredictions';
import { Leaderboard } from './pages/Leaderboard';
import { Admin } from './pages/Admin';
import { Dashboard } from './pages/Dashboard';

/**
 * Smart redirect component for root path.
 * Redirects to /matches if authenticated, /login otherwise.
 */
const RootRedirect: React.FC = () => {
  const token = localStorage.getItem('token');
  return <Navigate to={token ? '/matches' : '/login'} replace />;
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <Layout>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Smart root redirect */}
          <Route path="/" element={<RootRedirect />} />
          
          {/* Protected routes (require authentication) */}
          <Route element={<ProtectedRoute />}>
            <Route path="/matches" element={<Matches />} />
            <Route path="/prediction" element={<Matches />} />
            <Route path="/predict/:id" element={<PredictionPage />} />
            <Route path="/my-predictions" element={<MyPredictions />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>
          
          {/* Admin routes (require authentication + ADMIN role) */}
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<Admin />} />
          </Route>
        </Routes>
      </Layout>
    </HashRouter>
  );
};

export default App;
