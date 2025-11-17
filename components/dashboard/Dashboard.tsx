import React from 'react';
import { useGameStore } from '../../store/useGameStore';
import { RANK_CONFIG, CAVE_LEVELS, getRankLabel } from '../../data/constants';
import { Zap, Database, ShieldAlert, Coins, Home, ArrowUpCircle } from 'lucide-react';
import { Button, Card } from '../ui';
import { SpiritCoreVisualizer } from './SpiritCoreVisualizer';
import clsx from 'clsx';

interface Props {
  onBreakthrough: () => void;
}

export const Dashboard: React.FC<Props> = ({ onBreakthrough }) => {
  const { player, gainQi, minorBreakthrough } = useGameStore();
  
  const currentCave = CAVE_LEVELS.find(c => c.level === player.caveLevel) || CAVE_LEVELS[0];
  const rankConfig = RANK_CONFIG[player.rank];
  
  const canBreakthrough = player.qi >= player.maxQi;
  const isMaxLevel = player.level >= rankConfig.maxLevel;
  const progress = Math.min(100, (player.qi / player.maxQi) * 100);
  const displayRank = getRankLabel(player.rank, player.level);

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
        {/* Visualizer (Inner Vision) */}
        <div className="lg:col-span-2 relative group">
             <SpiritCoreVisualizer onClick={() => gainQi(10 + player.level * 2)} />
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
                        <span>{player.maxQi === Infinity ? '∞' : Math.floor(player.qi) + ' / ' + player.maxQi}</span>
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