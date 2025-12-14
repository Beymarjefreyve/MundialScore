import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, UserCircle, Calendar, RefreshCw, AlertCircle } from 'lucide-react';
import { Button, Badge, Card } from '../components/ui';
import { TEAMS } from '../constants';
import { obtenerPartidos, Match } from '../src/api/endpoints';

const MatchItem: React.FC<{ match: Match; onPredict: () => void }> = ({ match, onPredict }) => {
  const isLive = match.status === 'live';

  // Basic parsing of team names to TEAMS constants if needed for colors, or fallback
  // Assuming match.homeTeam is a string name or object. API definition in endpoints says string.
  // But existing code expects an object with color/code. 
  // I must adapt the API response or the component.
  // The API interface I defined has homeTeam as string. The existing code uses match.homeTeam.name, match.homeTeam.color.
  // I should probably update the API interface to match expected structure OR map it here.
  // Given I created the API interface, I can assume the backend returns what we need or I map it.
  // Let's assume the backend returns objects matching the frontend expectation for now, OR I use a helper to find team props.

  const getTeamProps = (teamName: string) => {
    const found = Object.values(TEAMS).find(t => t.name === teamName);
    return found || { name: teamName, code: teamName.substring(0, 3).toUpperCase(), color: 'border-white' };
  };

  // Use backend field names (equipoLocal, equipoVisitante)
  const home = getTeamProps(match.equipoLocal || '');
  const away = getTeamProps(match.equipoVisitante || '');

  return (
    <Card className="mb-4 overflow-hidden relative group">
      {/* Background Image Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-field-card to-field-card/80 z-0"></div>
      <div className="absolute inset-0 bg-[url('https://upload.wikimedia.org/wikipedia/commons/b/b9/Wembley_Stadium_Full.jpg')] bg-cover opacity-10 mix-blend-overlay z-0"></div>

      <div className="relative z-10">
        {match.status && (
          <Badge className="mb-3 inline-block" color={isLive ? 'bg-red-500 animate-pulse' : 'bg-white/10'}>
            {isLive ? `● EN VIVO` : 'Programado'}
          </Badge>
        )}

        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-bold">{home.name}</h3>
            <span className="text-gray-400 text-sm">vs</span>
            <h3 className="text-xl font-bold">{away.name}</h3>
          </div>
          <button className="text-gray-400 hover:text-white">
            <span className="sr-only">Favorite</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" /></svg>
          </button>
        </div>

        <div className="flex items-center text-xs text-gray-400 mb-6 gap-3">
          <span className="flex items-center gap-1">
            <Calendar size={12} />
            {isLive ? match.estadio : (match.fechaHora ? new Date(match.fechaHora).toLocaleString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'TBD')}
          </span>
          <span>•</span>
          <span>{match.estadio}</span>
        </div>

        <div className="flex items-center justify-between mt-4">
          <div className="flex -space-x-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold border-2 border-field-card ${home.color}`}>
              {home.code}
            </div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold border-2 border-field-card ${away.color}`}>
              {away.code}
            </div>
          </div>

          {isLive ? (
            <span className="font-mono text-xl font-bold">{match.golesLocal} - {match.golesVisitante}</span>
          ) : (
            <Button size="sm" className="py-2 px-4 text-xs" onClick={onPredict}>
              Hacer Predicción
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};

export const Matches: React.FC = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('Todos');
  const filters = ['Todos', 'Hoy'];

  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMatches = async () => {
    setLoading(true);
    try {
      const data = await obtenerPartidos();
      setMatches(data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Error al cargar partidos.');
      // Provide empty list on error as per "mantener estados vacíos cuando la API devuelva listas vacías" or similar behavior
      setMatches([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  // Filter matches based on active filter and status
  const filteredMatches = matches.filter(match => {
    // 1. Global Filter: Exclude matches that have a result/are finished
    // Based on user request "unicamente deben aparecer partidos que aun no se han jugado"
    const hasResult = match.golesLocal !== null && match.golesLocal !== undefined;
    if (hasResult) return false;

    // 2. Tab Filter
    if (filter === 'Hoy') {
      if (!match.fechaHora) return false;
      const matchDate = new Date(match.fechaHora);
      const today = new Date();
      return matchDate.getDate() === today.getDate() &&
        matchDate.getMonth() === today.getMonth() &&
        matchDate.getFullYear() === today.getFullYear();
    }
    // 'Todos' includes all pending matches
    return true;
  });

  const hasMatches = filteredMatches.length > 0;

  return (
    <div className="p-6">
      <header className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-field rounded-full flex items-center justify-center text-white shadow-lg shadow-field/30">
            <UserCircle size={24} />
          </div>
          <h1 className="text-xl font-bold">MundialScore</h1>
        </div>
        <button className="bg-field-card p-2 rounded-full border border-white/10 relative hover:bg-white/5 transition-colors">
          <Bell size={20} />
          <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-field-dark"></span>
        </button>
      </header>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar mb-6 pb-2">
        {filters.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${filter === f
              ? 'bg-field text-white shadow-lg shadow-green-900/20'
              : 'bg-field-card text-gray-400 hover:text-white border border-white/5'
              }`}
          >
            {f}
          </button>
        ))}
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-2 text-red-500 text-sm">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center p-10">
          <RefreshCw className="animate-spin text-field" />
        </div>
      ) : !hasMatches ? (
        <div className="flex flex-col items-center justify-center mt-20 text-center">
          <div className="relative mb-6">
            <div className="w-64 h-40 bg-field-card rounded-2xl overflow-hidden opacity-50 relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <RefreshCw size={40} className="text-gray-500" />
              </div>
            </div>
          </div>
          <h2 className="text-xl font-bold mb-2">No hay partidos disponibles aún</h2>
          <p className="text-gray-400 text-sm max-w-xs mb-8">
            El calendario de selecciones se está actualizando. Vuelve más tarde.
          </p>
          <Button variant="outline" className="gap-2" onClick={fetchMatches}>
            <RefreshCw size={18} /> Actualizar
          </Button>
        </div>
      ) : (
        <>
          <h2 className="text-lg font-bold mb-4 flex items-center justify-between">
            <span>Próximos Encuentros</span>
            <span className="text-xs text-field cursor-pointer hover:underline">Ver todos</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-24">
            {filteredMatches.map(match => (
              <MatchItem key={match.id} match={match} onPredict={() => navigate(`/predict/${match.id}`)} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};