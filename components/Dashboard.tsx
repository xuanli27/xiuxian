
import React, { useEffect, useRef } from 'react';
import { useGameStore } from '../store/useGameStore';
import { RANK_CONFIG, CAVE_LEVELS, getRankLabel } from '../data/constants';
import { Zap, Database, ShieldAlert, Coins, Home, ArrowUpCircle } from 'lucide-react';
import { Button, Card } from './ui/Shared';
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
    let particles: { x: number; y: number; speed: number; pathOffset: number; pathId: number }[] = [];
    
    // Silhouette Path Points (Simplified Meditating Figure)
    // Normalized coordinates 0-1
    const silhouettePoints = [
        [0.5, 0.1], // Head top
        [0.6, 0.2], // Right Shoulder
        [0.8, 0.4], // Right Elbow
        [0.6, 0.6], // Right Hand (Lap)
        [0.5, 0.65], // Lap center
        [0.4, 0.6], // Left Hand (Lap)
        [0.2, 0.4], // Left Elbow
        [0.4, 0.2], // Left Shoulder
        [0.5, 0.1]  // Close
    ];
    
    // Internal Meridian Paths (Chakras flow)
    const meridians = [
        // Central Channel (Microcosmic Orbit)
        [[0.5, 0.65], [0.5, 0.5], [0.5, 0.3], [0.5, 0.15]], 
        // Arms flow
        [[0.5, 0.3], [0.6, 0.2], [0.8, 0.4], [0.6, 0.6]],
        [[0.5, 0.3], [0.4, 0.2], [0.2, 0.4], [0.4, 0.6]]
    ];

    const render = () => {
      const styles = getComputedStyle(document.documentElement);
      const pColor = styles.getPropertyValue('--accent-main').trim() || '#10B981';
      const w = canvas.width;
      const h = canvas.height;
      const scale = Math.min(w, h) * 0.8;
      const offsetX = (w - scale) / 2;
      const offsetY = (h - scale) / 2;

      ctx.clearRect(0, 0, w, h);
      
      // Draw Silhouette Background
      ctx.beginPath();
      ctx.strokeStyle = pColor;
      ctx.lineWidth = 2;
      ctx.globalAlpha = 0.2;
      
      // Draw approximate body shape (Head)
      ctx.arc(w/2, offsetY + scale*0.15, scale*0.1, 0, Math.PI*2);
      
      // Body
      ctx.moveTo(w/2, offsetY + scale*0.25);
      ctx.lineTo(w/2 + scale*0.2, offsetY + scale*0.3); // R Shoulder
      ctx.lineTo(w/2 + scale*0.3, offsetY + scale*0.6); // R Knee
      ctx.lineTo(w/2 - scale*0.3, offsetY + scale*0.6); // L Knee
      ctx.lineTo(w/2 - scale*0.2, offsetY + scale*0.3); // L Shoulder
      ctx.closePath();
      ctx.stroke();
      ctx.fillStyle = pColor;
      ctx.fill();

      // Spawn Particles flowing along meridians
      if (particles.length < 30) {
          const pathId = Math.floor(Math.random() * meridians.length);
          particles.push({
              pathId,
              pathOffset: 0,
              x: 0, y: 0,
              speed: 0.005 + Math.random() * 0.01
          });
      }

      // Update and Draw Particles
      ctx.globalAlpha = 1;
      ctx.fillStyle = '#ffffff';
      ctx.shadowBlur = 10;
      ctx.shadowColor = pColor;

      for (let i = particles.length - 1; i >= 0; i--) {
          const p = particles[i];
          const path = meridians[p.pathId];
          
          // Calculate position based on pathOffset (0 to 1)
          const totalPoints = path.length - 1;
          const segmentIndex = Math.floor(p.pathOffset * totalPoints);
          const nextSegmentIndex = Math.min(segmentIndex + 1, totalPoints);
          const segmentProgress = (p.pathOffset * totalPoints) - segmentIndex;

          const p1 = path[segmentIndex];
          const p2 = path[nextSegmentIndex];

          if (p1 && p2) {
              const realX = offsetX + (p1[0] + (p2[0] - p1[0]) * segmentProgress) * scale;
              const realY = offsetY + (p1[1] + (p2[1] - p1[1]) * segmentProgress) * scale;
              
              ctx.beginPath();
              ctx.arc(realX, realY, 2 + Math.random() * 2, 0, Math.PI*2);
              ctx.fill();
          }

          p.pathOffset += p.speed;
          if (p.pathOffset >= 1) {
              particles.splice(i, 1);
          }
      }
      
      // Dantian (Center) Glow
      ctx.shadowBlur = 30;
      ctx.fillStyle = pColor;
      ctx.beginPath();
      const dantianSize = 10 + Math.sin(Date.now() / 500) * 3 + (progress / 10);
      ctx.arc(w/2, offsetY + scale*0.6, dantianSize, 0, Math.PI*2);
      ctx.fill();

      animationId = requestAnimationFrame(render);
    };
    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
    };
  }, [player.theme, player.qi, player.maxQi]);

  return (
    <div className="p-4 w-full max-w-4xl mx-auto pb-24">
      {/* 3D Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 perspective-1000">
        <StatCard icon={<Database size={18} />} label="职位(境界)" value={displayRank} color="text-blue-400" delay={0} />
        <StatCard icon={<ShieldAlert size={18} />} label="压力(心魔)" value={`${player.innerDemon}%`} color={player.innerDemon > 80 ? "text-red-500 animate-pulse" : "text-danger-400"} delay={100} />
        <StatCard icon={<Coins size={18} />} label="灵石" value={player.spiritStones} color="text-secondary-400" delay={200} />
        <StatCard icon={<Home size={18} />} label="洞府加成" value={`${currentCave.qiMultiplier}x`} color="text-primary-400" delay={300} />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Visualizer (Inner Vision) */}
        <div 
            ref={containerRef} 
            className="relative h-96 bg-surface-800/50 rounded-3xl border border-border-base overflow-hidden flex items-center justify-center cursor-pointer group transition-all hover:shadow-2xl hover:shadow-primary-500/20 backdrop-blur-sm"
            onClick={() => gainQi(10)}
        >
            <canvas ref={canvasRef} className="absolute inset-0" />
            <div className="absolute top-4 left-4 text-primary-400/50 font-xianxia text-2xl select-none">内视运气图</div>
            
            <div className="z-10 text-center pointer-events-none select-none mt-32 group-hover:scale-110 transition-transform duration-300">
                <p className="text-primary-200/50 text-sm animate-pulse">点击丹田 吐纳灵气</p>
            </div>
             <div className="absolute bottom-4 left-0 right-0 flex justify-center pointer-events-none">
                 <span className="bg-surface-900/80 px-4 py-1 rounded-full text-sm text-primary-400 border border-primary-600/50 font-mono">
                     Current Qi: {Math.floor(player.qi)}
                 </span>
             </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col justify-center space-y-6">
            <Card className="shadow-lg">
                <div className="flex justify-between mb-2 text-sm font-bold">
                    <span className="text-content-400">{rankConfig.title}考核进度</span>
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
                    {Math.floor(player.qi)} / {player.maxQi === Infinity ? '∞' : player.maxQi}
                </p>
            </Card>
            
            <Button
                size="lg"
                disabled={!canBreakthrough}
                onClick={isMaxLevel ? onBreakthrough : minorBreakthrough}
                variant={isMaxLevel ? 'danger' : 'secondary'}
                className={canBreakthrough ? "animate-pulse h-16 text-lg" : "h-16"}
                icon={isMaxLevel ? <Zap size={24} /> : <ArrowUpCircle size={24} />}
            >
                 {canBreakthrough 
                    ? (isMaxLevel ? `渡劫 (晋升${RANK_CONFIG[player.rank].title})` : "小境界突破")
                    : (isMaxLevel ? "灵气不足以渡劫" : "闭关积累中...")}
            </Button>

            {player.innerDemon > 50 && (
              <div className="bg-danger-900/30 border border-danger-500/30 p-3 rounded-xl flex items-center gap-2 text-danger-400 text-sm animate-pulse">
                 <ShieldAlert size={16} />
                 <span>警告：心魔过重，经脉运行受阻！请速去功德阁购买减压道具。</span>
              </div>
            )}
            
            <div className="text-xs text-content-400 text-center italic">
                "呼吸之间，天地灵气为我所用... (点击左侧人物加速)"
            </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value, color, delay }: any) => (
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
