
import React, { useEffect, useRef } from 'react';
import { useGameStore } from '../../store/useGameStore';
import { RANK_CONFIG, CAVE_LEVELS, getRankLabel } from '../../data/constants';
import { Zap, Database, ShieldAlert, Coins, Home, ArrowUpCircle, Activity } from 'lucide-react';
import { Button, Card, Badge } from '../ui/Shared';
import clsx from 'clsx';

interface Props {
  onBreakthrough: () => void;
}

export const Dashboard: React.FC<Props> = ({ onBreakthrough }) => {
  const { player, gainQi, minorBreakthrough } = useGameStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const currentCave = CAVE_LEVELS.find(c => c.level === player.caveLevel) || CAVE_LEVELS[0];
  const rankConfig = RANK_CONFIG[player.rank];
  
  const canBreakthrough = player.qi >= player.maxQi;
  const isMaxLevel = player.level >= rankConfig.maxLevel;
  const progress = Math.min(100, (player.qi / player.maxQi) * 100);
  const displayRank = getRankLabel(player.rank, player.level);

  // Visualizer Logic (Simplified for brevity, similar to original but refined)
  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
        canvas.width = containerRef.current?.clientWidth || 300;
        canvas.height = containerRef.current?.clientHeight || 300;
    };
    window.addEventListener('resize', resize);
    resize();

    let animationId: number;
    let particles: any[] = [];
    
    const render = () => {
      const styles = getComputedStyle(document.documentElement);
      const pColor = styles.getPropertyValue('--accent-main').trim() || '#10B981';
      const w = canvas.width;
      const h = canvas.height;
      
      ctx.clearRect(0, 0, w, h);
      
      // Draw Center Pulse
      const pulseSize = 50 + Math.sin(Date.now() / 500) * 5 + (progress / 5);
      const gradient = ctx.createRadialGradient(w/2, h/2, 0, w/2, h/2, pulseSize * 2);
      gradient.addColorStop(0, `${pColor}40`);
      gradient.addColorStop(1, 'transparent');
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(w/2, h/2, pulseSize * 2, 0, Math.PI*2);
      ctx.fill();

      ctx.beginPath();
      ctx.strokeStyle = pColor;
      ctx.lineWidth = 2;
      ctx.arc(w/2, h/2, pulseSize, 0, Math.PI*2);
      ctx.stroke();

      // Particles
      if (particles.length < 20 + (progress/2)) {
          const angle = Math.random() * Math.PI * 2;
          const dist = 50 + Math.random() * 100;
          particles.push({
              x: w/2 + Math.cos(angle) * dist,
              y: h/2 + Math.sin(angle) * dist,
              vx: (Math.random() - 0.5) * 0.5,
              vy: (Math.random() - 0.5) * 0.5,
              size: Math.random() * 3,
              life: 1
          });
      }

      particles.forEach((p, i) => {
          p.x += p.vx + (w/2 - p.x) * 0.02; // Attract to center
          p.y += p.vy + (h/2 - p.y) * 0.02;
          p.life -= 0.01;
          
          ctx.fillStyle = `rgba(255, 255, 255, ${p.life})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI*2);
          ctx.fill();

          if (p.life <= 0 || Math.abs(p.x - w/2) < 5) particles.splice(i, 1);
      });

      animationId = requestAnimationFrame(render);
    };
    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
    };
  }, [player.theme, progress]);

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 perspective-1000">
        <StatCard icon={<Database size={16} />} label="境界" value={displayRank} color="bg-blue-500/20 text-blue-400" delay={0} />
        <StatCard icon={<ShieldAlert size={16} />} label="心魔" value={`${player.innerDemon}%`} color={player.innerDemon > 80 ? "bg-red-500/20 text-red-500 animate-pulse" : "bg-danger-500/20 text-danger-400"} delay={100} />
        <StatCard icon={<Coins size={16} />} label="灵石" value={player.spiritStones} color="bg-amber-500/20 text-secondary-400" delay={200} />
        <StatCard icon={<Home size={16} />} label="洞府" value={`${currentCave.qiMultiplier}x`} color="bg-emerald-500/20 text-primary-400" delay={300} />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Visualizer (Inner Vision) - Takes up 2 cols on large screens */}
        <div className="lg:col-span-2 relative group">
             <div 
                ref={containerRef} 
                className="relative h-[400px] bg-surface-900 rounded-3xl border border-border-base overflow-hidden flex items-center justify-center cursor-pointer shadow-2xl shadow-black/50 transition-all hover:border-primary-500/30"
                onClick={() => gainQi(10 + player.level * 2)}
            >
                {/* Grid Background */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />
                
                <canvas ref={canvasRef} className="absolute inset-0" />
                
                <div className="absolute top-6 left-6">
                    <div className="flex items-center gap-2 mb-1">
                        <Activity size={16} className="text-primary-400 animate-pulse" />
                        <span className="text-primary-400/70 font-mono text-xs tracking-widest">SPIRIT_CORE_MONITOR</span>
                    </div>
                    <h2 className="text-2xl font-xianxia text-content-100">内视运气图</h2>
                </div>

                <div className="z-10 text-center pointer-events-none select-none mt-48 group-hover:scale-110 transition-transform duration-500">
                    <p className="text-primary-200/50 text-sm font-mono tracking-[0.2em] animate-pulse">CLICK_TO_CULTIVATE</p>
                </div>
                
                {/* Floating Gain Text Effect could go here */}
            </div>
        </div>

        {/* Controls Panel */}
        <div className="flex flex-col gap-4">
            <Card className="flex-1 flex flex-col justify-center shadow-xl">
                <div className="mb-6">
                    <div className="flex justify-between mb-2 text-sm font-bold items-end">
                        <span className="text-content-200 text-lg font-xianxia">{rankConfig.title}考核</span>
                        <span className="text-primary-400 font-mono text-xl">{progress.toFixed(1)}%</span>
                    </div>
                    
                    {/* Advanced Progress Bar */}
                    <div className="h-4 bg-surface-950 rounded-full overflow-hidden border border-white/10 relative p-0.5 shadow-inner">
                        <div 
                            className="h-full bg-gradient-to-r from-primary-800 via-primary-500 to-primary-400 rounded-full relative overflow-hidden transition-all duration-1000 ease-out shadow-[0_0_10px_var(--color-primary-500)]"
                            style={{ width: `${progress}%` }}
                        >
                            <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.3)_50%,transparent_75%)] bg-[size:20px_20px] animate-[shimmer_1s_infinite_linear]" />
                        </div>
                    </div>
                    
                    <div className="flex justify-between mt-2 text-xs text-content-400 font-mono">
                        <span>0</span>
                        <span>{Math.floor(player.qi)} / {player.maxQi === Infinity ? '∞' : player.maxQi}</span>
                    </div>
                </div>
                
                <Button
                    size="lg"
                    disabled={!canBreakthrough}
                    onClick={isMaxLevel ? onBreakthrough : minorBreakthrough}
                    variant={isMaxLevel ? 'danger' : 'secondary'}
                    className={clsx("w-full h-16 text-lg relative overflow-hidden", canBreakthrough && "animate-pulse")}
                    icon={isMaxLevel ? <Zap size={24} /> : <ArrowUpCircle size={24} />}
                >
                     {canBreakthrough 
                        ? (isMaxLevel ? `渡劫 (晋升${RANK_CONFIG[player.rank].title})` : "突破小境界")
                        : (isMaxLevel ? "灵气不足以渡劫" : "闭关积累中")}
                </Button>

                {player.innerDemon > 50 && (
                  <div className="mt-4 bg-danger-900/20 border border-danger-500/30 p-3 rounded-xl flex items-start gap-3 text-danger-400 text-xs animate-pulse">
                     <ShieldAlert size={16} className="shrink-0 mt-0.5" />
                     <span>警告：心魔指数过高！建议立即前往功德阁购买解压道具，或进行娱乐活动。</span>
                  </div>
                )}
            </Card>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value, color, delay }: any) => (
  <div 
    className="bg-surface-800/80 backdrop-blur-sm p-4 rounded-2xl border border-border-base flex flex-col justify-between hover:bg-surface-800 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg group"
    style={{ animation: `fadeIn 0.5s ease-out ${delay}ms backwards` }}
  >
    <div className="flex justify-between items-start mb-2">
        <div className="text-content-400 text-xs font-bold uppercase tracking-wider">{label}</div>
        <div className={`p-1.5 rounded-lg ${color} shadow-sm`}>{icon}</div>
    </div>
    <div className="font-bold text-xl text-content-100 truncate font-mono group-hover:scale-105 transition-transform origin-left">{value}</div>
  </div>
);
