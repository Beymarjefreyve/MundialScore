import React, { useState, useEffect } from 'react';
import { Filter, RefreshCw } from 'lucide-react';
import { Card, Badge, Button } from '../components/ui';
import { useNavigate } from 'react-router-dom';
import { obtenerMisPronosticos, Prediction, Match } from '../src/api/endpoints'; // Assuming endpoints exports these types or inferred
// NOTE: I might need to update endpoints to export types if not already. 
// I defined Match and Prediction interfaces in endpoints.ts.
// But prediction from API might need enrichment with Match data if the API just returns what I defined (id, matchId, ...).
// The mock had `pred.match.homeTeam...`.
// If the backend returns relations, good. If not, I need to fetch matches too?
// The user constraint: "Reemplazar uso de mocks por llamadas".
// I'll assume the API returns populated data or I need to handle it.
// Given "Simple API", maybe it returns a DTO with everything.
// I'll cast it to `any` for now to avoid strict type hell if the API shape isn't fully defined by backend yet (since I'm prepping FOR backend).

export const MyPredictions: React.FC = () => {
   const [activeTab, setActiveTab] = useState('Todos');
   const navigate = useNavigate();

   const tabs = ['Todos', 'Pendientes', 'Finalizados'];

   const [predictions, setPredictions] = useState<any[]>([]);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      obtenerMisPronosticos()
         .then(data => setPredictions(data))
         .catch(console.error)
         .finally(() => setLoading(false));
   }, []);

   const filteredPredictions = predictions.filter(pred => {
      const partido = pred.partido || {};
      const hasResult = partido.golesLocal !== null && partido.golesLocal !== undefined &&
                        partido.golesVisitante !== null && partido.golesVisitante !== undefined;
      
      if (activeTab === 'Pendientes') return !hasResult;
      if (activeTab === 'Finalizados') return hasResult;
      return true;
   });

   const hasPredictions = filteredPredictions.length > 0;

   // Check if user has ANY predictions at all to decide message vs empty filter
   const hasAnyPredictions = predictions.length > 0;

   if (loading) return <div className="p-10 flex justify-center"><RefreshCw className="animate-spin text-field" /></div>;

   return (
      <div className="p-6">
         <header className="flex justify-between items-center mb-8">
            <h1 className="text-xl font-bold">Mis Predicciones</h1>
            <button className="text-gray-400 hover:text-white">
               <Filter size={20} />
            </button>
         </header>

         <div className="flex p-1 bg-field-card rounded-xl mb-8">
            {tabs.map(tab => (
               <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${activeTab === tab ? 'bg-field text-white shadow-lg' : 'text-gray-400 hover:text-white'
                     }`}
               >
                  {tab}
               </button>
            ))}
         </div>

         {!hasPredictions ? (
            <div className="border-2 border-dashed border-white/5 rounded-3xl p-10 flex flex-col items-center justify-center text-center mt-10">
               <div className="w-20 h-20 bg-field-input rounded-full flex items-center justify-center mb-6">
                  <span className="text-3xl">⚽</span>
               </div>
               <h3 className="text-xl font-bold mb-2">
                  {hasAnyPredictions ? 'No hay predicciones en esta categoría' : 'No tienes predicciones'}
               </h3>
               <p className="text-gray-400 text-sm mb-8">
                  {hasAnyPredictions 
                     ? 'Prueba cambiando el filtro o realiza nuevas predicciones.' 
                     : 'Parece que aún no has hecho predicciones para los partidos del mundial. ¡Juega ahora!'
                  }
               </p>
               <Button onClick={() => hasAnyPredictions ? setActiveTab('Todos') : navigate('/')}>
                  {hasAnyPredictions ? 'Limpiar Filtros' : 'Ver Partidos Disponibles'}
               </Button>
            </div>
         ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {filteredPredictions.map(pred => {
                  // Map backend field names to frontend expectations
                  // Backend returns: partido (with equipoLocal, equipoVisitante, fechaHora, estadio, golesLocal, golesVisitante)
                  //                  golesLocalPronosticados, golesVisitantePronosticados, puntosObtenidos
                  const partido = pred.partido || {};
                  const equipoLocal = partido.equipoLocal || '?';
                  const equipoVisitante = partido.equipoVisitante || '?';
                  const fechaHora = partido.fechaHora;
                  
                  // Create team display objects
                  const homeTeam = { 
                     name: equipoLocal, 
                     code: equipoLocal.substring(0, 3).toUpperCase(), 
                     color: '' 
                  };
                  const awayTeam = { 
                     name: equipoVisitante, 
                     code: equipoVisitante.substring(0, 3).toUpperCase(), 
                     color: '' 
                  };

                  // Check if match has result (partido has golesLocal and golesVisitante set)
                  const hasResult = partido.golesLocal !== null && partido.golesLocal !== undefined &&
                                   partido.golesVisitante !== null && partido.golesVisitante !== undefined;
                  const isPending = !hasResult;
                  
                  // If has result, check if prediction was correct (puntosObtenidos > 0)
                  const puntosObtenidos = pred.puntosObtenidos || 0;
                  const isCorrect = hasResult && puntosObtenidos > 0;

                  return (
                     <Card key={pred.id} className="p-0 overflow-hidden">
                        <div className="p-5 border-b border-white/5 flex items-center justify-between">
                           <div className="flex items-center gap-3">
                              <div className="flex -space-x-2">
                                 <div className={`w-8 h-8 rounded-full border border-field-card flex items-center justify-center text-[10px] font-bold ${homeTeam.color}`}>
                                    {homeTeam.code}
                                 </div>
                                 <div className={`w-8 h-8 rounded-full border border-field-card flex items-center justify-center text-[10px] font-bold ${awayTeam.color} text-black`}>
                                    {awayTeam.code}
                                 </div>
                              </div>
                              <div>
                                 <h4 className="font-bold text-sm">{homeTeam.name} vs {awayTeam.name}</h4>
                                 <p className="text-[10px] text-gray-400 flex items-center gap-1">
                                    {fechaHora ? new Date(fechaHora).toLocaleDateString() : '-'} • {fechaHora ? new Date(fechaHora).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-'}
                                 </p>
                              </div>
                           </div>

                           {isPending ? (
                              <Badge className="bg-white/10 text-gray-300">Pendiente</Badge>
                           ) : (
                              <Badge color={isCorrect ? 'bg-field' : 'bg-red-500/20 text-red-500'}>
                                 {isCorrect ? `+${puntosObtenidos} Pts` : '0 Pts'}
                              </Badge>
                           )}
                        </div>

                        <div className="p-4 bg-black/20 flex items-center justify-between">
                           <div className="flex flex-col">
                              <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-1">Resultado</span>
                              <span className="text-lg font-mono font-bold">
                                 {isPending ? '- -' : `${partido.golesLocal} - ${partido.golesVisitante}`}
                              </span>
                           </div>

                           <div className="flex flex-col items-end">
                              <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-1">Tu Predicción</span>
                              <span className={`text-lg font-mono font-bold flex gap-3 ${!isPending && !isCorrect ? 'text-gray-400 line-through decoration-red-500' : 'text-field'}`}>
                                 <span>{pred.golesLocalPronosticados}</span>
                                 <span>-</span>
                                 <span>{pred.golesVisitantePronosticados}</span>
                              </span>
                           </div>
                        </div>
                     </Card>
                  );
               })}
            </div>
         )}
      </div>
   );
};