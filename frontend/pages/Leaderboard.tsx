import React, { useState, useEffect } from 'react';
import { Trophy, RefreshCw } from 'lucide-react';

import { obtenerLeaderboard } from '../src/api/endpoints';

const RankAvatar: React.FC<{ user: any; rank: number }> = ({ user, rank }) => {
   const isFirst = rank === 1;
   const isSecond = rank === 2;
   const isThird = rank === 3;

   const size = isFirst ? 'w-24 h-24' : 'w-16 h-16';
   const borderColor = isFirst ? 'border-yellow-400' : isSecond ? 'border-gray-300' : 'border-amber-700';
   const badgeColor = isFirst ? 'bg-yellow-400 text-black' : isSecond ? 'bg-gray-300 text-black' : 'bg-amber-700 text-white';
   const label = isFirst ? 'Campeón' : isSecond ? 'Plata' : 'Bronce';
   const glow = isFirst ? 'shadow-[0_0_30px_rgba(250,204,21,0.3)]' : '';

   return (
      <div className={`flex flex-col items-center ${isFirst ? '-mt-8 z-10' : ''}`}>
         <div className="text-field font-bold text-xl mb-2">{rank}°</div>
         <div className={`relative rounded-full border-4 ${borderColor} ${size} ${glow} overflow-hidden bg-field-card`}>
            <img src={user.avatarUrl || 'https://via.placeholder.com/150'} alt={user.name} className="w-full h-full object-cover" />
         </div>
         <div className={`${badgeColor} px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide -mt-3 relative z-20 shadow-lg`}>
            {label}
         </div>
         <div className="mt-2 text-center">
            <div className="font-bold text-sm truncate max-w-[100px]">{user.name}</div>
            <div className="text-field font-bold text-sm">{user.points} pts</div>
         </div>
      </div>
   );
};

export const Leaderboard: React.FC = () => {
   const [leaaderboardData, setLeaderboardData] = useState<any[]>([]);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      obtenerLeaderboard()
         .then(setLeaderboardData)
         .catch(console.error)
         .finally(() => setLoading(false));
   }, []);

   if (loading) return <div className="p-10 flex justify-center"><RefreshCw className="animate-spin text-field" /></div>;

   const top3 = leaaderboardData.slice(0, 3).sort((a, b) => a.rank - b.rank); // Sort just in case? Or assume API returns sorted.
   // Actually if API returns list, I should assign ranks? 
   // "mantener mocks vacios con listas vacias".
   // If API returns [], map returns [].

   // If API data does not have rank, I should map index+1.
   const dataWithRank = leaaderboardData.map((u, i) => ({ ...u, rank: i + 1 }));
   const top3WithRank = dataWithRank.slice(0, 3);
   const rest = dataWithRank.slice(3);

   // Reorder for visual podium: 2nd, 1st, 3rd
   // Need to be careful if less than 3 items
   const podium = [];
   if (top3WithRank[1]) podium.push(top3WithRank[1]);
   if (top3WithRank[0]) podium.push(top3WithRank[0]);
   if (top3WithRank[2]) podium.push(top3WithRank[2]);

   return (
      <div className="flex flex-col min-h-screen max-w-3xl mx-auto w-full">
         <h1 className="text-2xl font-bold text-center mb-10">Tabla de Clasificación</h1>

         {/* Podium */}
         {podium.length > 0 && (
            <div className="flex items-end justify-center gap-4 mb-10">
               {podium.map((user) => <RankAvatar key={user.id} user={user} rank={user.rank} />)}
            </div>
         )}

         <div className="flex items-center justify-between text-xs text-gray-500 font-bold uppercase tracking-widest px-4 mb-2">
            <span>Pos • Usuario</span>
            <span>Puntos Totales</span>
         </div>

         <div className="flex-1 flex flex-col gap-3 pb-24 md:pb-0">
            {rest.map((user) => (
               <div key={user.id} className="bg-field-card rounded-2xl p-3 flex items-center justify-between border border-white/5">
                  <div className="flex items-center gap-4">
                     <span className="font-bold text-gray-500 w-6 text-center">{user.rank}</span>
                     <div className="w-10 h-10 rounded-full bg-field-input overflow-hidden">
                        <img src={user.avatarUrl || 'https://via.placeholder.com/150'} alt={user.name} className="w-full h-full object-cover" />
                     </div>
                     <span className="font-bold text-sm">{user.name}</span>
                  </div>
                  <span className="font-bold text-white">{user.points} pts</span>
               </div>
            ))}
         </div>

      </div>
   );
};