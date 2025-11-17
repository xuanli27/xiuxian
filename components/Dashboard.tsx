import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { PlayerStats, Rank, RANK_THRESHOLDS } from '../types';
import { Wind, Zap, Database, ShieldAlert, Coffee } from 'lucide-react';

interface Props {
  stats: PlayerStats;
  onClickQi: () => void;
  onBreakthrough: () => void;
}

export const Dashboard: React.FC<Props> = ({ stats, onClickQi, onBreakthrough }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Qi Particle System
  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    const particles: { x: number; y: number; vx: number; vy: number; life: number }[] = [];
    
    const resize = () => {
        canvas.width = containerRef.current?.clientWidth || 300;
        canvas.height = containerRef.current?.clientHeight || 300;
    };
    window.addEventListener('resize', resize);
    resize();

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Spawn new particle based on Qi level (more Qi = more particles)
      if (Math.random() < 0.2) {
        const angle = Math.random() * Math.PI * 2;
        const r = Math.min(canvas.width, canvas.height) / 2;
        particles.push({
          x: centerX + Math.cos(angle) * r,
          y: centerY + Math.sin(angle) * r,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          life: 1.0
        });
      }

      // Update & Draw
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        // Move towards center
        const dx = centerX - p.x;
        const dy = centerY - p.y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        
        p.x += (dx / dist) * 2;
        p.y += (dy / dist) * 2;
        p.life -= 0.01;

        ctx.fillStyle = `rgba(167, 243, 208, ${p.life})`; // Emerald 200
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
        ctx.fill();

        if (dist < 10 || p.life <= 0) {
          particles.splice(i, 1);
        }
      }
      
      // Draw Core
      ctx.shadowBlur = 20;
      ctx.shadowColor = '#10B981';
      ctx.fillStyle = '#059669';
      ctx.beginPath();
      ctx.arc(centerX, centerY, 20 + Math.sin(Date.now() / 500) * 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      animationId = requestAnimationFrame(render);
    };
    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  const progress = Math.min(100, (stats.qi / RANK_THRESHOLDS[stats.rank]) * 100);
  const canBreakthrough = stats.qi >= RANK_THRESHOLDS[stats.rank];

  return (
    <div className="p-4 w-full max-w-4xl mx-auto">
      {/* Top Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard icon={<Database size={18} />} label="境界" value={`${stats.rank} Lv.${stats.level}`} color="text-indigo-400" />
        <StatCard icon={<ShieldAlert size={18} />} label="心魔" value={`${stats.innerDemon}%`} color="text-rose-400" />
        <StatCard icon={<Coffee size={18} />} label="心性" value={stats.mindState} color="text-amber-400" />
        <StatCard icon={<Wind size={18} />} label="灵石" value={stats.coins} color="text-emerald-400" />
      </div>

      {/* Main Cultivation Area */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Visualizer */}
        <div 
            ref={containerRef} 
            className="relative h-80 bg-slate-800/50 rounded-2xl border border-slate-700 overflow-hidden flex items-center justify-center cursor-pointer group"
            onClick={onClickQi}
        >
            <canvas ref={canvasRef} className="absolute inset-0" />
            <div className="z-10 text-center pointer-events-none select-none">
                <h2 className="text-3xl font-xianxia text-emerald-100 drop-shadow-lg">运气调息</h2>
                <p className="text-emerald-400/80 text-sm mt-2">点击加速汲取灵气</p>
            </div>
             <div className="absolute bottom-4 left-0 right-0 flex justify-center pointer-events-none">
                 <span className="bg-slate-900/80 px-3 py-1 rounded-full text-xs text-emerald-300 border border-emerald-900">
                     当前灵气: {Math.floor(stats.qi)}
                 </span>
             </div>
        </div>

        {/* Controls & Progress */}
        <div className="flex flex-col justify-center space-y-6">
            <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                <div className="flex justify-between mb-2 text-sm">
                    <span className="text-slate-400">修仙进度</span>
                    <span className="text-emerald-400">{progress.toFixed(1)}%</span>
                </div>
                <div className="h-4 bg-slate-900 rounded-full overflow-hidden border border-slate-700">
                    <div 
                        className="h-full bg-gradient-to-r from-emerald-900 to-emerald-500 transition-all duration-1000 ease-out"
                        style={{ width: `${progress}%` }}
                    />
                </div>
                <p className="text-xs text-slate-500 mt-2 text-right">
                    {Math.floor(stats.qi)} / {RANK_THRESHOLDS[stats.rank] === Infinity ? '∞' : RANK_THRESHOLDS[stats.rank]}
                </p>
            </div>

            <button
                disabled={!canBreakthrough}
                onClick={onBreakthrough}
                className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all ${
                    canBreakthrough 
                    ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/30 animate-pulse' 
                    : 'bg-slate-700 text-slate-500 cursor-not-allowed'
                }`}
            >
                <Zap className={canBreakthrough ? "animate-bounce" : ""} />
                {canBreakthrough ? "境界突破" : "灵气不足"}
            </button>

            <div className="bg-slate-800/50 p-4 rounded-lg text-sm text-slate-400 italic border border-slate-700/50">
                "修仙不努力，万魂幡里做兄弟。"
            </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value, color }: any) => (
  <div className="bg-slate-800 p-3 rounded-lg border border-slate-700 flex items-center gap-3">
    <div className={`p-2 rounded-full bg-slate-900 ${color}`}>{icon}</div>
    <div>
      <div className="text-xs text-slate-500">{label}</div>
      <div className="font-bold text-slate-200">{value}</div>
    </div>
  </div>
);