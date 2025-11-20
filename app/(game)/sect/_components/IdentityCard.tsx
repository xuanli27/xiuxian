'use client'

import React, { useState } from 'react';
import { Crown } from 'lucide-react';
import type { Player } from '@/types/enums';
import { formatSectRank } from '@/lib/utils/format';

interface Props {
  player: Player
}

export const IdentityCard: React.FC<Props> = ({ player }) => {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    setTilt({ x: ((e.clientY - rect.top) / (rect.height/2) - 1) * -10, y: ((e.clientX - rect.left) / (rect.width/2) - 1) * 10 });
  };

  return (
    <div className="flex justify-center mb-12 perspective-1000 py-6">
      <div 
          onMouseMove={handleMouseMove} 
          onMouseLeave={() => setTilt({x:0, y:0})} 
          style={{transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`, transition: 'transform 0.1s ease-out'}} 
          className="relative w-80 h-[420px] rounded-3xl shadow-[0_0_50px_rgba(217,119,6,0.15)] preserve-3d cursor-pointer group select-none transition-all duration-500"
      >
         {/* Card Front */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-surface-800 to-surface-950 border border-secondary-500/30 overflow-hidden">
            {/* Holographic effect */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{transform: `translate(${tilt.y * 2}px, ${tilt.x * 2}px)`}} />
            
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-secondary-900/20 to-transparent" />
            
            <div className="flex flex-col items-center h-full p-6 relative z-10">
                  <div className="text-secondary-400/40 font-xianxia text-3xl tracking-[0.5em] mb-6 drop-shadow-md">仙欲宗令</div>
                  
                  <div className="relative w-28 h-28 mb-6">
                      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-secondary-600 to-primary-600 animate-spin-slow opacity-50 blur-md" />
                      <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-surface-950 bg-surface-800 shadow-xl">
                          {player.avatar && <img src={player.avatar} className="w-full h-full object-cover" alt="avatar" />}
                      </div>
                      <div className="absolute -bottom-2 -right-2 bg-surface-900 rounded-full p-1.5 border border-secondary-500 shadow-lg">
                          <Crown size={16} className="text-secondary-400" />
                      </div>
                  </div>

                  <h2 className="text-3xl font-xianxia text-content-100 mb-1 drop-shadow-md">{player.name}</h2>
                  <div className="px-4 py-1 bg-surface-900 rounded-full border border-secondary-500/30 text-secondary-400 text-xs font-bold tracking-wider shadow-inner mb-8">
                      {formatSectRank(player.sectRank)}
                  </div>

                  <div className="w-full mt-auto">
                      <div className="flex justify-between text-[10px] text-content-400 font-bold mb-2 font-mono tracking-widest">
                          <span>CONTRIBUTION_POINTS</span>
                          <span className="text-secondary-400">{player.contribution}</span>
                      </div>
                      <div className="h-1.5 bg-surface-950 rounded-full overflow-hidden border border-white/5">
                          <div className="h-full bg-gradient-to-r from-secondary-600 via-white to-secondary-600 w-full animate-[shimmer_2s_infinite]" />
                      </div>
                  </div>
            </div>
        </div>
      </div>
    </div>
  );
};