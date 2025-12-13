import { request } from './client';

// Define types broadly for now to match backend expectations or mocks
export interface User {
    id: number;
    email: string;
    name: string;
}

export interface Match {
    id: number;
    homeTeam: string;
    awayTeam: string;
    date: string;
    stadium: string;
    homeScore?: number;
    awayScore?: number;
    status?: string; // e.g. 'scheduled', 'live', 'finished'
}

export interface Prediction {
    id?: number;
    matchId: number;
    userId: number;
    homeScore: number;
    awayScore: number;
}

export const login = (credentials: any) => request<any>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
});

export const register = (userData: any) => request<any>('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
});

export const obtenerPartidos = () => request<Match[]>('/api/partidos');

export const obtenerPartido = (id: string) => request<Match>(`/api/partidos/${id}`);


export const crearPronostico = (prediction: Prediction) => request<Prediction>('/api/pronosticos', {
    method: 'POST',
    body: JSON.stringify(prediction),
});

export const obtenerMisPronosticos = () => request<Prediction[]>('/api/pronosticos/mis');

export const obtenerLeaderboard = () => request<any[]>('/api/leaderboard');

export const registrarResultadoPartido = (matchId: number, result: any) => request<any>(`/api/admin/partidos/${matchId}/resultado`, {
    method: 'PUT',
    body: JSON.stringify(result),
});

export const crearPartido = (matchData: any) => request<Match>('/api/admin/partidos', {
    method: 'POST',
    body: JSON.stringify(matchData),
});
