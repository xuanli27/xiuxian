import React from 'react';
import { useGameStore } from '../../store/useGameStore';
import { CAVE_LEVELS, MATERIALS } from '../../data/constants';
import { ArrowUpCircle, Hammer, Home } from 'lucide-react';
import { Button, Card } from '../ui';
import clsx from 'clsx';

export const CaveManager: React.FC = () => {
  const { player, upgradeCave } = useGameStore();
  const currentLevelConfig = CAVE_LEVELS.find(c => c.level === player.caveLevel) || CAVE_LEVELS[0];
  const nextLevelConfig = CAVE_LEVELS.find(c => c.level === player.caveLevel + 1);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="relative h-56 bg-surface-800 rounded-3xl border border-border-base mb-8 overflow-hidden group shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-surface-800 via-surface-900 to-surface-950 z-0" />
        {/* Ambient Light */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
        
        <div className="absolute inset-0 flex items-center justify-center opacity-10 text-[10rem] select-none grayscale group-hover:grayscale-0 transition-all duration-1000 transform group-hover:scale-110">🏠</div>
        
        <div className="absolute bottom-8 left-8 z-10">
          <h2 className="text-4xl font-xianxia text-primary-400 mb-1">{currentLevelConfig.name}</h2>
          <div className="flex items-center gap-3">
             <span className="px-3 py-1 bg-primary-900/30 border border-primary-500/30 rounded-full text-primary-300 text-xs font-bold">Lv.{player.caveLevel}</span>
             <p className="text-content-400 text-sm font-serif italic">“斯是陋室，惟吾德馨”</p>
          </div>
        </div>
        
        <div className="absolute top-6 right-6 z-10 bg-surface-900/90 backdrop-blur-md px-5 py-3 rounded-2xl border border-border-base text-sm font-mono text-primary-400 shadow-lg flex flex-col items-end">
             <span className="text-[10px] text-content-400 uppercase tracking-wider">Qi Multiplier</span>
             <span className="text-xl font-bold">x{currentLevelConfig.qiMultiplier}</span>
        </div>
      </div>

      <Card>
        <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-secondary-500/10 rounded-lg text-secondary-400"><ArrowUpCircle size={20} /></div>
            <h3 className="font-bold text-xl text-content-100">洞府升级</h3>
        </div>

        {nextLevelConfig ? (
          <>
            <div className="flex justify-between items-center mb-8 text-sm bg-surface-900/50 p-4 rounded-2xl border border-white/5">
               <div className="space-y-3">
                    <div className="text-content-400">当前加成 <span className="text-content-100 text-lg ml-2 font-bold">{currentLevelConfig.qiMultiplier}x</span></div>
                    <div className="text-content-400">最大任务 <span className="text-content-100 text-lg ml-2 font-bold">{currentLevelConfig.maxTasks}</span></div>
               </div>
               <div className="text-2xl text-secondary-400 animate-pulse px-4">➜</div>
               <div className="space-y-3 text-right">
                    <div className="text-primary-400 font-bold text-lg">{nextLevelConfig.qiMultiplier}x</div>
                    <div className="text-primary-400 font-bold text-lg">{nextLevelConfig.maxTasks}</div>
               </div>
            </div>

            <div className="bg-surface-800 p-5 rounded-2xl mb-6 border border-border-base">
               <div className="text-xs text-content-400 mb-3 uppercase tracking-wider font-bold flex items-center gap-2">
                   <Hammer size={12} /> 装修材料
               </div>
               <div className="space-y-3">
                  <CostItem name="灵石" current={player.spiritStones} cost={nextLevelConfig.upgradeCost.stones} icon="💎" />
                  {nextLevelConfig.upgradeCost.materials && Object.entries(nextLevelConfig.upgradeCost.materials).map(([matId, cost]) => {
                    const mat = MATERIALS.find(m => m.id === matId);
                    return <CostItem key={matId} name={mat?.name || matId} current={player.materials[matId] || 0} cost={cost} icon={mat?.icon || '📦'} />;
                  })}
               </div>
            </div>

            <Button onClick={upgradeCave} variant="secondary" size="lg" className="w-full" icon={<Hammer size={18} />}>开始装修工程</Button>
          </>
        ) : (
          <div className="text-center py-12 text-content-400 bg-surface-800/50 rounded-2xl border border-dashed border-border-base">
              <Home size={48} className="mx-auto mb-4 opacity-50 text-primary-400" />
              <p className="text-lg">已达到目前装修风格的极致</p>
              <p className="text-sm opacity-60 mt-1">“可谓是五星级工位”</p>
          </div>
        )}
      </Card>
    </div>
  );
};

const CostItem = ({ name, current, cost, icon }: { name: string, current: number, cost: number, icon: string }) => {
  const canAfford = current >= cost;
  return (
    <div className="flex justify-between items-center text-sm p-2 rounded-lg hover:bg-white/5 transition-colors">
      <div className="flex items-center gap-3 text-content-200">
          <span className="text-lg">{icon}</span> 
          <span className="font-medium">{name}</span>
      </div>
      <div className={clsx("font-mono font-bold", canAfford ? "text-primary-400" : "text-danger-400")}>
          {current} <span className="text-content-400 mx-1">/</span> {cost}
      </div>
    </div>
  );
};