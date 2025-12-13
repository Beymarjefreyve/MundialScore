import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { obtenerMisPronosticos, obtenerLeaderboard } from '../src/api/endpoints'; // Note: path might need adjustment based on where endpoints is. 
// Actually pages are in Frontend/pages. endpoints in Frontend/src/api.
// Path from pages/Dashboard.tsx to src/api/endpoints.ts is ../src/api/endpoints

import { Card, Button } from '../components/ui';

export const Dashboard: React.FC = () => {
    // Simple Dashboard showing summary
    const navigate = useNavigate();
    const [stats, setStats] = useState<any>({ predictions: 0, points: 0 });

    useEffect(() => {
        // Fetch summary data if available, or just fetch predictions to count count
        obtenerMisPronosticos().then(preds => {
            const points = preds.reduce((acc: number, cur: any) => acc + (cur.pointsEarned || 0), 0);
            setStats({ predictions: preds.length, points });
        }).catch(console.error);
    }, []);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

            <div className="grid grid-cols-2 gap-4 mb-4">
                <Card className="p-4 bg-field-card border-white/10">
                    <h3 className="text-sm text-gray-400">Puntos</h3>
                    <p className="text-2xl font-bold text-field">{stats.points}</p>
                </Card>
                <Card className="p-4 bg-field-card border-white/10">
                    <h3 className="text-sm text-gray-400">Predicciones</h3>
                    <p className="text-2xl font-bold text-white">{stats.predictions}</p>
                </Card>
            </div>

            <div className="flex flex-col md:flex-row gap-3">
                <Button className="flex-1" onClick={() => navigate('/')}>Ver Partidos</Button>
                <Button className="flex-1" variant="outline" onClick={() => navigate('/leaderboard')}>Ver Tabla</Button>
            </div>
        </div>
    );
};
