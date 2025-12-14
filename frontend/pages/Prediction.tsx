import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, MapPin, AlertCircle } from 'lucide-react';
import { Button } from '../components/ui';
import { TEAMS } from '../constants';
import { obtenerPartido, crearPronostico, Match } from '../src/api/endpoints';

export const PredictionPage: React.FC = () => {
   const { id } = useParams();
   const navigate = useNavigate();
   const [homeScore, setHomeScore] = useState('');
   const [awayScore, setAwayScore] = useState('');

   const [match, setMatch] = useState<Match | null>(null);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);

   useEffect(() => {
      if (id) {
         obtenerPartido(id)
            .then(setMatch)
            .catch(err => {
               console.error(err);
               setError('Error al cargar datos del partido');
            })
            .finally(() => setLoading(false));
      }
   }, [id]);

   const handleSubmit = async () => {
      if (!match || !homeScore || !awayScore) return;
      try {
         // Send with backend expected field names
         await crearPronostico({
            partidoId: match.id,
            golesLocal: parseInt(homeScore),
            golesVisitante: parseInt(awayScore)
         });
         navigate('/my-predictions');
      } catch (err) {
         console.error(err);
         // Simple visual error
         alert('Error al enviar pronóstico');
      }
   };

   const getTeamProps = (teamName: string) => {
      const found = Object.values(TEAMS).find(t => t.name === teamName);
      return found || { name: teamName, code: teamName.substring(0, 3).toUpperCase(), color: 'border-white' };
   };

   if (loading) return <div className="p-6 text-center">Cargando...</div>;
   if (error || !match) return <div className="p-6 text-center text-red-500">{error || 'Partido no encontrado'}</div>;

   // Map backend field names to frontend names
   const homeTeamName = (match as any).equipoLocal || match.homeTeam;
   const awayTeamName = (match as any).equipoVisitante || match.awayTeam;
   const matchDate = (match as any).fechaHora || match.date;
   const matchStadium = (match as any).estadio || match.stadium;

   // Validate that the match has required data
   if (!homeTeamName || !awayTeamName) {
      return <div className="p-6 text-center text-red-500">Este partido tiene datos incompletos</div>;
   }

   const homeTeam = typeof homeTeamName === 'string' ? getTeamProps(homeTeamName) : homeTeamName as any;
   const awayTeam = typeof awayTeamName === 'string' ? getTeamProps(awayTeamName) : awayTeamName as any;

   // Check if match is finished (backend returns null if not played, or we check if values exist)
   // Backend Partido: golesLocal, golesVisitante are null if not played.
   const hasResult = (match as any).golesLocal !== null && (match as any).golesLocal !== undefined;
   const isStarted = new Date() >= new Date(matchDate);
   const isLocked = hasResult || isStarted;

   return (
      <div className="min-h-screen flex flex-col w-full max-w-xl mx-auto">
         <header className="p-6 flex items-center justify-between sticky top-0 bg-field-dark/95 backdrop-blur z-20">
            <button onClick={() => navigate(-1)} className="p-2 -ml-2 hover:bg-white/5 rounded-full transition-colors">
               <ArrowLeft size={24} />
            </button>
            <h1 className="font-bold text-lg">Hacer Predicción</h1>
            <div className="w-8" />
         </header>

         <div className="flex-1 p-6 flex flex-col items-center w-full">

            {/* Match Header Card */}
            <div className="w-full bg-field-card rounded-3xl p-8 mb-8 border border-white/5 shadow-2xl relative overflow-hidden">
               <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none"></div>

               <div className="flex items-center justify-between relative z-10 w-full">
                  <div className="flex flex-col items-center gap-3 w-1/3">
                     <div className={`w-20 h-20 rounded-full border-4 border-field-input ${homeTeam.color} shadow-lg flex items-center justify-center text-xl font-bold`}>
                        {homeTeam.code}
                     </div>
                     <span className="font-bold text-center">{homeTeam.name}</span>
                  </div>

                  <div className="flex flex-col items-center justify-center w-1/3">
                     <span className="text-4xl font-black italic text-field transform -skew-x-12">VS</span>
                  </div>

                  <div className="flex flex-col items-center gap-3 w-1/3">
                     <div className={`w-20 h-20 rounded-full border-4 border-field-input ${awayTeam.color} shadow-lg flex items-center justify-center text-xl font-bold text-black`}>
                        {awayTeam.code}
                     </div>
                     <span className="font-bold text-center">{awayTeam.name}</span>
                  </div>
               </div>

               <div className="mt-8 pt-6 border-t border-white/10 flex flex-col items-center gap-2 text-sm text-gray-400">
                  <div className="flex items-center gap-2">
                     <Calendar size={14} />
                     <span>{new Date(matchDate).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                     <MapPin size={14} />
                     <span>{matchStadium}</span>
                  </div>
               </div>
            </div>

            <div className="w-full max-w-xs mb-4">
               <div className="bg-field/10 border border-field/20 rounded-full py-2 px-6 text-center text-field text-sm font-bold uppercase tracking-widest">
                  Tu Pronóstico
               </div>
            </div>

            <div className="flex items-center justify-between w-full max-w-sm gap-4 mb-12">
               <div className="flex flex-col items-center gap-2 w-full">
                  <span className="text-sm text-gray-400">{homeTeam.name}</span>
                  <input
                     type="number"
                     value={homeScore}
                     onChange={(e) => setHomeScore(e.target.value)}
                     disabled={isLocked}
                     className={`w-full aspect-square bg-field-input border border-white/10 rounded-3xl text-center text-5xl font-bold focus:border-field focus:ring-1 focus:ring-field outline-none transition-all ${isLocked ? 'opacity-50 cursor-not-allowed' : ''}`}
                     placeholder="-"
                  />
               </div>

               <span className="text-2xl text-gray-600 font-bold mb-6">:</span>

               <div className="flex flex-col items-center gap-2 w-full">
                  <span className="text-sm text-gray-400">{awayTeam.name}</span>
                  <input
                     type="number"
                     value={awayScore}
                     onChange={(e) => setAwayScore(e.target.value)}
                     disabled={isLocked}
                     className={`w-full aspect-square bg-field-input border border-white/10 rounded-3xl text-center text-5xl font-bold focus:border-field focus:ring-1 focus:ring-field outline-none transition-all ${isLocked ? 'opacity-50 cursor-not-allowed' : ''}`}
                     placeholder="-"
                  />
               </div>
            </div>

            <div className="mt-auto w-full">
               {isLocked ? (
                  <div className="w-full bg-red-500/20 border border-red-500/50 rounded-xl p-4 flex items-center gap-3 justify-center mb-4">
                     <AlertCircle className="text-red-500" />
                     <span className="text-red-200 font-medium">
                        {hasResult ? 'El partido ha finalizado' : 'El partido ya ha comenzado'}
                     </span>
                  </div>
               ) : (
                  <Button fullWidth className="text-lg py-4 shadow-xl shadow-green-900/30" onClick={handleSubmit}>
                     ENVIAR PREDICCIÓN
                  </Button>
               )}
               <p className="text-center text-[10px] text-gray-500 mt-4">
                  Las predicciones se cierran 5 minutos antes del inicio.
               </p>
            </div>

         </div>
      </div>
   );
};