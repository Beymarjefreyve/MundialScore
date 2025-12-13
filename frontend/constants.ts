import { Match, Prediction, User, Team } from './types';

// Teams
export const TEAMS: Record<string, Team> = {
  ARG: { id: 'arg', name: 'Argentina', code: 'ARG', color: 'bg-blue-400' },
  BRA: { id: 'bra', name: 'Brasil', code: 'BRA', color: 'bg-yellow-400' },
  FRA: { id: 'fra', name: 'Francia', code: 'FRA', color: 'bg-blue-600' },
  GER: { id: 'ger', name: 'Alemania', code: 'GER', color: 'bg-white text-black' },
  ESP: { id: 'esp', name: 'España', code: 'ESP', color: 'bg-red-500' },
  ITA: { id: 'ita', name: 'Italia', code: 'ITA', color: 'bg-blue-500' },
  ENG: { id: 'eng', name: 'Inglaterra', code: 'ENG', color: 'bg-white' },
};

// Matches
export const MOCK_MATCHES: Match[] = [];

// Predictions
export const MOCK_PREDICTIONS: Prediction[] = [];

// Leaderboard
export const MOCK_LEADERBOARD: User[] = [];

export const CURRENT_USER: User = {
  id: '',
  name: '',
  avatarUrl: '',
  points: 0,
  rank: 0
};