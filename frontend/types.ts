export interface Team {
  id: string;
  name: string;
  code: string;
  flagUrl?: string; // We will use emojis or placeholders
  color?: string;
}

export interface Match {
  id: string;
  homeTeam: Team;
  awayTeam: Team;
  date: string; // ISO string
  stadium: string;
  league: string;
  status: 'scheduled' | 'live' | 'finished';
  homeScore?: number;
  awayScore?: number;
  minute?: number;
}

export interface Prediction {
  id: string;
  matchId: string;
  homeScore: number;
  awayScore: number;
  status: 'pending' | 'correct' | 'incorrect';
  pointsEarned?: number;
  match: Match;
}

export interface User {
  id: string;
  name: string;
  avatarUrl: string;
  points: number;
  rank: number;
}

export enum NavigationTab {
  MATCHES = 'matches',
  PREDICTIONS = 'predictions',
  LEADERBOARD = 'leaderboard',
  PROFILE = 'profile', // Used for Logout/Admin in this demo
}