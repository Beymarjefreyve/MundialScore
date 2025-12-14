import React, { useState, useEffect } from 'react';
import { Search, Plus, ArrowRight, CheckCircle, Bell, Calendar as CalendarIcon, ClipboardList as ClipboardListIcon, RefreshCw } from 'lucide-react';
import { Button, Input, Card, Badge } from '../components/ui';
import { TEAMS } from '../constants';
import { obtenerPartidos, crearPartido, registrarResultadoPartido, Match } from '../src/api/endpoints';

export const Admin: React.FC = () => {
   const [matches, setMatches] = useState<Match[]>([]);
   const [loading, setLoading] = useState(true);
   const [showCreateForm, setShowCreateForm] = useState(false);

   // Create Form State
   const [newMatch, setNewMatch] = useState({ homeTeam: '', awayTeam: '', date: '', stadium: '' });

   // Score Input State (simplified: one active match to edit)
   const [editingMatchId, setEditingMatchId] = useState<number | null>(null);
   const [scoreInput, setScoreInput] = useState({ home: '', away: '' });

   const fetchMatches = () => {
      setLoading(true);
      obtenerPartidos()
         .then(setMatches)
         .catch(console.error)
         .finally(() => setLoading(false));
   };

   useEffect(() => {
      fetchMatches();
   }, []);

   const handleCreateMatch = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
         // Map frontend fields to backend DTO field names
         const partidoData = {
            equipoLocal: newMatch.homeTeam,
            equipoVisitante: newMatch.awayTeam,
            fechaHora: newMatch.date,
            estadio: newMatch.stadium
         };
         await crearPartido(partidoData);
         setShowCreateForm(false);
         setNewMatch({ homeTeam: '', awayTeam: '', date: '', stadium: '' });
         fetchMatches();
         alert('Partido creado');
      } catch (err) {
         console.error(err);
         alert('Error al crear partido');
      }
   };

   const handleSetResult = async (matchId: number) => {
      try {
         // Map frontend fields to backend DTO field names
         await registrarResultadoPartido(matchId, {
            golesLocal: parseInt(scoreInput.home),
            golesVisitante: parseInt(scoreInput.away)
         });
         setEditingMatchId(null);
         setScoreInput({ home: '', away: '' });
         fetchMatches();
         alert('Resultado registrado');
      } catch (err) {
         console.error(err);
         alert('Error al registrar resultado');
      }
   };

   const getTeamProps = (teamName: string) => {
      const found = Object.values(TEAMS).find(t => t.name === teamName);
      return found || { name: teamName, code: teamName.substring(0, 3).toUpperCase(), color: 'border-white' };
   };

   if (loading) return <div className="p-10 flex justify-center"><RefreshCw className="animate-spin text-field" /></div>;

   return (
      <div className="p-6">
         <header className="flex justify-between items-center mb-6">
            <div>
               <h1 className="text-xl font-bold">MundialScore</h1>
               <p className="text-[10px] text-gray-400 uppercase tracking-widest">Panel de Administrador</p>
            </div>
            <div className="flex gap-2">
               <button className="bg-field-card p-2 rounded-full border border-white/10 hover:bg-white/5">
                  <Bell size={20} />
               </button>
               <div className="w-10 h-10 rounded-full bg-field flex items-center justify-center font-bold text-sm">
                  A
               </div>
            </div>
         </header>

         <div className="mb-6">
            <Input
               icon={<Search size={18} />}
               placeholder="Buscar selección, grupo o fase..."
               className="rounded-full"
            />
         </div>

         <Button fullWidth className="mb-8 rounded-full flex items-center justify-between px-6 py-4 shadow-lg shadow-green-900/20 group" onClick={() => setShowCreateForm(!showCreateForm)}>
            <div className="flex items-center gap-2">
               <div className="bg-white/20 p-1 rounded-md">
                  <Plus size={18} />
               </div>
               <span>{showCreateForm ? 'Cancelar' : 'Añadir nuevo partido'}</span>
            </div>
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
         </Button>

         {showCreateForm && (
            <Card className="mb-8 p-4 bg-field-card border-field">
               <h3 className="font-bold mb-4">Nuevo Partido</h3>
               <form onSubmit={handleCreateMatch} className="flex flex-col gap-3">
                  <Input placeholder="Equipo Local (Nombre)" value={newMatch.homeTeam} onChange={(e: any) => setNewMatch({ ...newMatch, homeTeam: e.target.value })} />
                  <Input placeholder="Equipo Visitante (Nombre)" value={newMatch.awayTeam} onChange={(e: any) => setNewMatch({ ...newMatch, awayTeam: e.target.value })} />
                  <Input type="datetime-local" placeholder="Fecha" value={newMatch.date} onChange={(e: any) => setNewMatch({ ...newMatch, date: e.target.value })} />
                  <Input placeholder="Estadio" value={newMatch.stadium} onChange={(e: any) => setNewMatch({ ...newMatch, stadium: e.target.value })} />
                  <Button type="submit">Guardar</Button>
               </form>
            </Card>
         )}

         <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
               <div className="w-2 h-2 rounded-full bg-orange-500"></div>
               <h2 className="font-bold">Próximos Encuentros</h2>
               <button className="ml-auto text-xs text-field hover:underline">Ver todo</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {matches.filter(m => m.golesLocal === null || m.golesLocal === undefined).map(match => { // filter for 'upcoming' matches with no score
                  const home = getTeamProps(match.equipoLocal || '');
                  const away = getTeamProps(match.equipoVisitante || '');

                  return (
                     <Card key={match.id} className="p-0 overflow-hidden">
                        <div className="h-24 bg-[url('https://picsum.photos/seed/stadium2/600/200')] bg-cover relative">
                           <div className="absolute inset-0 bg-gradient-to-t from-field-card to-transparent"></div>
                           <div className="absolute bottom-3 left-4">
                              <Badge className="bg-black/50 backdrop-blur text-white border border-white/10">Mundial</Badge>
                           </div>
                        </div>
                        <div className="p-4">
                           <div className="flex items-center gap-3 mb-1">
                              <span className="font-bold text-lg">{home.name}</span>
                              <span className="text-gray-500 text-sm">vs</span>
                              <span className="font-bold text-lg">{away.name}</span>
                           </div>
                           <div className="flex items-center gap-4 text-xs text-gray-400 mb-4">
                              <span className="flex items-center gap-1"><CalendarIcon size={12} /> {match.fechaHora ? new Date(match.fechaHora).toLocaleString() : 'TBD'}</span>
                              <span>•</span>
                              <span>{match.estadio}</span>
                           </div>

                           <div className="flex items-center justify-between">
                              <div className="flex -space-x-2">
                                 <div className={`w-6 h-6 rounded-full border border-field-card ${home.color} flex items-center justify-center text-[8px] font-bold`}>{home.code}</div>
                                 <div className={`w-6 h-6 rounded-full border border-field-card ${away.color} flex items-center justify-center text-[8px] font-bold`}>{away.code}</div>
                              </div>

                              {editingMatchId === match.id ? (
                                 <div className="flex items-center gap-2">
                                    <input className="w-10 bg-field-input border border-white/10 rounded p-1 text-center" placeholder="H" value={scoreInput.home} onChange={(e) => setScoreInput({ ...scoreInput, home: e.target.value })} type="number" />
                                    <span>-</span>
                                    <input className="w-10 bg-field-input border border-white/10 rounded p-1 text-center" placeholder="A" value={scoreInput.away} onChange={(e) => setScoreInput({ ...scoreInput, away: e.target.value })} type="number" />
                                    <Button size="sm" onClick={() => handleSetResult(match.id)}>OK</Button>
                                    <Button size="sm" variant="outline" onClick={() => setEditingMatchId(null)}>X</Button>
                                 </div>
                              ) : (
                                 <button onClick={() => setEditingMatchId(match.id)} className="flex items-center gap-2 bg-field-input hover:bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg text-xs transition-colors">
                                    <ClipboardListIcon size={14} />
                                    Introducir resultado
                                 </button>
                              )}
                           </div>
                        </div>
                     </Card>
                  );
               })}
            </div>
         </div>

         <div>
            <div className="flex items-center gap-2 mb-4">
               <CheckCircle size={16} className="text-gray-500" />
               <h2 className="font-bold text-gray-300">Partidos Finalizados</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
               {matches.filter(m => m.golesLocal !== null && m.golesLocal !== undefined).map(match => {
                  const home = getTeamProps(match.equipoLocal || '');
                  const away = getTeamProps(match.equipoVisitante || '');
                  return (
                     <div key={match.id} className="bg-field-input/50 rounded-xl p-3 flex items-center gap-4 border border-white/5">
                        <div className="w-16 h-12 bg-gray-700 rounded-lg overflow-hidden">
                           <img src="https://picsum.photos/seed/stadium3/100/100" className="w-full h-full object-cover grayscale opacity-50" />
                        </div>
                        <div className="flex-1">
                           <div className="text-[10px] text-gray-500 uppercase font-bold">Finalizado</div>
                           <div className="font-bold text-sm">{home.name} vs {away.name}</div>
                           <div className="text-xs text-gray-500">{match.estadio}</div>
                        </div>
                        <div className="px-3 py-1 bg-black/40 rounded-lg font-mono font-bold border border-white/5">
                           {match.golesLocal} - {match.golesVisitante}
                        </div>
                     </div>
                  );
               })}
            </div>
         </div>
      </div>
   );
};
