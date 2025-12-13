import React from 'react';
import { BrowserRouter as Router, Routes, Route, HashRouter } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Matches } from './pages/Matches';
import { PredictionPage } from './pages/Prediction';
import { MyPredictions } from './pages/MyPredictions';
import { Leaderboard } from './pages/Leaderboard';

import { Admin } from './pages/Admin';
import { Dashboard } from './pages/Dashboard';


const App: React.FC = () => {
  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/" element={<Matches />} />
          <Route path="/matches" element={<Matches />} />
          <Route path="/prediction" element={<Matches />} /> {/* Alias prediction to matches list if no id provided */}
          <Route path="/predict/:id" element={<PredictionPage />} />
          <Route path="/my-predictions" element={<MyPredictions />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/admin" element={<Admin />} />

        </Routes>
      </Layout>
    </HashRouter>
  );
};

export default App;