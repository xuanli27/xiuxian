import React, { useEffect, useRef } from 'react';
import { useGameStore } from '../store/useGameStore';
import { RANK_THRESHOLDS } from '../types';
import { Zap, Database, ShieldAlert, Coffee, Coins } from 'lucide-react';
import clsx from 'clsx';

interface Props {
  onBreakthrough: () => void;
}

export const Dashboard: React.FC<Props> = ({ onBreakthrough }) => {
  const { player, gainQi } = useGameStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Qi Particle System (Updated for theme colors)
  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Get theme colors from CSS vars
    const styles = getComputedStyle(document.documentElement);
    const primaryColor = styles.getPropertyValue('--accent-main').trim() || '#10B981';
    
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
      // Use computed style for dynamic theme update
      const currentStyles = getComputedStyle(document.documentElement);
      const pColor = currentStyles.getPropertyValue('--accent-main').trim() || '#10B981';

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      if (Math.random() < 0.3) {
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

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        const dx = centerX - p.x;
        const dy = centerY - p.y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        
        p.x += (dx / dist) * 3; 
        p.y += (dy / dist) * 3;
        p.life -= 0.015;

        ctx.fillStyle = pColor;
        ctx.globalAlpha = p.life;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
        ctx.fill();

        if (dist < 15 || p.life <= 0) {
          particles.splice(i, 1);
        }
      }
      
      ctx.globalAlpha = 1;
      ctx.shadowBlur = 30;
      ctx.shadowColor = pColor;
      ctx.fillStyle = pColor;
      ctx.beginPath();
      ctx.arc(centerX, centerY, 25 + Math.sin(Date.now() / 300) * 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      animationId = requestAnimationFrame(render);
    };
    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
    };
  }, [player.theme]); // Re-init on theme change

  const progress = Math.min(100, (player.qi / RANK_THRESHOLDS[player.rank]) * 100);
  const canBreakthrough = player.qi >= RANK_THRESHOLDS[player.rank];

  return (
    <div className="p-4 w-full max-w-4xl mx-auto pb-24">
      {/* 3D Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 perspective-1000">
        <StatCard icon={<Database size={18} />} label="职位(境界)" value={player.rank} color="text-blue-400" delay={0} />
        <StatCard icon={<ShieldAlert size={18} />} label="压力(心魔)" value={`${player.innerDemon}%`} color="text-danger-400" delay={100} />
        <StatCard icon={<Coffee size={18} />} label="心性" value={player.mindState} color="text-secondary-400" delay={200} />
        <StatCard icon={<Coins size={18} />} label="贡献" value={player.contribution} color="text-primary-400" delay={300} />
      </div>

      {/* Main Cultivation Area */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Visualizer */}
        <div 
            ref={containerRef} 
            className="relative h-80 bg-surface-800/50 rounded-3xl border border-border-base overflow-hidden flex items-center justify-center cursor-pointer group transition-all hover:shadow-2xl hover:shadow-primary-500/20 hover:scale-[1.01] backdrop-blur-sm"
            onClick={() => gainQi(10)}
        >
            <canvas ref={canvasRef} className="absolute inset-0" />
            <div className="z-10 text-center pointer-events-none select-none">
                <h2 className="text-4xl font-xianxia text-content-100 drop-shadow-lg animate-pulse">摸鱼聚气</h2>
                <p className="text-primary-400/80 text-sm mt-2">点击汲取天地精华</p>
            </div>
             <div className="absolute bottom-4 left-0 right-0 flex justify-center pointer-events-none">
                 <span className="bg-surface-950/80 px-4 py-1 rounded-full text-sm text-primary-400 border border-primary-600/50 font-mono">
                     Qi: {Math.floor(player.qi)}
                 </span>
             </div>
        </div>

        {/* Controls & Progress */}
        <div className="flex flex-col justify-center space-y-6">
            <div className="bg-surface-800 p-6 rounded-2xl border border-border-base shadow-lg">
                <div className="flex justify-between mb-2 text-sm font-bold">
                    <span className="text-content-400">绩效考核进度</span>
                    <span className="text-primary-400">{progress.toFixed(1)}%</span>
                </div>
                <div className="h-6 bg-surface-900 rounded-full overflow-hidden border border-border-base relative">
                    <div 
                        className="h-full bg-gradient-to-r from-primary-600 via-primary-500 to-primary-400 transition-all duration-1000 ease-out relative overflow-hidden"
                        style={{ width: `${progress}%` }}
                    >
                        <div className="absolute inset-0 bg-white/20 animate-[shimmer_2s_infinite]"></div>
                    </div>
                </div>
                <p className="text-xs text-content-400 mt-2 text-right font-mono">
                    {Math.floor(player.qi)} / {RANK_THRESHOLDS[player.rank] === Infinity ? '∞' : RANK_THRESHOLDS[player.rank]}
                </p>
            </div>

            <button
                disabled={!canBreakthrough}
                onClick={onBreakthrough}
                className={clsx(
                  "w-full py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all duration-300 transform",
                  canBreakthrough 
                    ? 'bg-secondary-600 hover:bg-secondary-400 hover:-translate-y-1 text-white shadow-lg shadow-secondary-600/30 animate-[bounce_2s_infinite]' 
                    : 'bg-surface-700 text-content-400 cursor-not-allowed border border-border-base'
                )}
            >
                <Zap className={canBreakthrough ? "animate-pulse" : ""} />
                {canBreakthrough ? "申请升职 (突破)" : "资历不足"}
            </button>

            <div className="bg-surface-800/50 p-4 rounded-xl text-sm text-content-400 italic border border-border-base text-center">
                "工作不突出，腰间盘突出。修仙不努力，万魂幡里做兄弟。"
            </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value, color, delay }: any) => {
  return (
    <div 
      className="bg-surface-800 p-3 rounded-xl border border-border-base flex items-center gap-3 hover:bg-surface-700 transition-all hover:-translate-y-1 hover:shadow-lg duration-300"
      style={{ animation: `fadeIn 0.5s ease-out ${delay}ms backwards` }}
    >
      <div className={`p-2 rounded-full bg-surface-900 ${color} shadow-inner`}>{icon}</div>
      <div className="overflow-hidden">
        <div className="text-xs text-content-400 truncate">{label}</div>
        <div className="font-bold text-content-100 truncate">{value}</div>
      </div>
    </div>
  );
};