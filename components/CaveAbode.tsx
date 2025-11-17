
import React, { useState } from 'react';
import { useGameStore } from '../store/useGameStore';
import { CAVE_LEVELS, RECIPES, MATERIALS } from '../types';
import { Home, Hammer, ArrowUpCircle, Lock, FlaskConical, Info } from 'lucide-react';
import clsx from 'clsx';

export const CaveAbode: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'CAVE' | 'CRAFT'>('CAVE');

  return (
    <div className="p-4 pb-24 max-w-4xl mx-auto">
       {/* Header Navigation */}
       <div className="flex justify-center mb-6">
        <div className="bg-surface-900/80 p-1 rounded-xl flex gap-2 border border-border-base">
          <button 
            onClick={() => setActiveTab('CAVE')}
            className={clsx("px-6 py-2 rounded-lg font-bold transition-all flex items-center gap-2", activeTab === 'CAVE' ? "bg-primary-600 text-white shadow-md" : "text-content-400 hover:text-content-200")}
          >
            <Home size={16} /> 洞府管理
          </button>
          <button 
            onClick={() => setActiveTab('CRAFT')}
            className={clsx("px-6 py-2 rounded-lg font-bold transition-all flex items-center gap-2", activeTab === 'CRAFT' ? "bg-secondary-600 text-white shadow-md" : "text-content-400 hover:text-content-200")}
          >
            <FlaskConical size={16} /> 炼丹炼器
          </button>
        </div>
      </div>

      {activeTab === 'CAVE' ? <CaveManager /> : <CraftingStation />}
    </div>
  );
};

const CaveManager: React.FC = () => {
  const { player, upgradeCave } = useGameStore();
  
  const currentLevelConfig = CAVE_LEVELS.find(c => c.level === player.caveLevel) || CAVE_LEVELS[0];
  const nextLevelConfig = CAVE_LEVELS.find(c => c.level === player.caveLevel + 1);

  const handleUpgrade = () => {
    if (upgradeCave()) {
      // Animation or toast could go here
    }
  };

  return (
    <div className="animate-in fade-in duration-300">
      {/* Visual Representation */}
      <div className="relative h-48 bg-surface-800 rounded-3xl border border-border-base mb-6 overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-surface-800 to-surface-950 z-0" />
        {/* ASCII Art or Simple Icon Scene */}
        <div className="absolute inset-0 flex items-center justify-center opacity-20 text-9xl select-none grayscale group-hover:grayscale-0 transition-all duration-700">
          🏠
        </div>
        <div className="absolute bottom-6 left-6 z-10">
          <h2 className="text-3xl font-xianxia text-primary-400">{currentLevelConfig.name}</h2>
          <p className="text-content-400 text-sm">Lv.{player.caveLevel} 洞府</p>
        </div>
        <div className="absolute top-6 right-6 z-10 bg-surface-900/80 backdrop-blur px-4 py-2 rounded-full border border-border-base text-xs font-mono text-primary-400">
          修炼加成: x{currentLevelConfig.qiMultiplier}
        </div>
      </div>

      {/* Upgrade Stats */}
      <div className="bg-surface-800 rounded-2xl p-6 border border-border-base shadow-lg">
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
          <ArrowUpCircle className="text-secondary-400" /> 洞府升级
        </h3>

        {nextLevelConfig ? (
          <>
            <div className="flex justify-between items-center mb-6 text-sm">
               <div className="space-y-2">
                 <div className="text-content-400">当前加成: <span className="text-content-100">{currentLevelConfig.qiMultiplier}x</span></div>
                 <div className="text-content-400">任务上限: <span className="text-content-100">{currentLevelConfig.maxTasks}</span></div>
               </div>
               <div className="text-2xl text-secondary-400 animate-pulse">➜</div>
               <div className="space-y-2 text-right">
                 <div className="text-primary-400 font-bold">{nextLevelConfig.qiMultiplier}x</div>
                 <div className="text-primary-400 font-bold">{nextLevelConfig.maxTasks}</div>
               </div>
            </div>

            <div className="bg-surface-900 p-4 rounded-xl mb-6 border border-border-base">
               <div className="text-xs text-content-400 mb-2 uppercase tracking-wider">所需资源</div>
               <div className="space-y-2">
                  <CostItem 
                    name="灵石" 
                    current={player.spiritStones} 
                    cost={nextLevelConfig.upgradeCost.stones} 
                    icon="💎" 
                  />
                  {nextLevelConfig.upgradeCost.materials && Object.entries(nextLevelConfig.upgradeCost.materials).map(([matId, cost]) => {
                    const mat = MATERIALS.find(m => m.id === matId);
                    return (
                      <CostItem 
                        key={matId} 
                        name={mat?.name || matId} 
                        current={player.materials[matId] || 0} 
                        cost={cost} 
                        icon={mat?.icon || '📦'} 
                      />
                    );
                  })}
               </div>
            </div>

            <button 
              onClick={handleUpgrade}
              className="w-full py-4 rounded-xl font-bold bg-secondary-600 hover:bg-secondary-500 text-white shadow-lg shadow-secondary-600/20 transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <Hammer size={18} /> 立即装修
            </button>
          </>
        ) : (
          <div className="text-center py-8 text-content-400">
            <Home size={48} className="mx-auto mb-2 opacity-50" />
            <p>已达到目前装修风格的极致，可谓“五星级工位”。</p>
          </div>
        )}
      </div>
    </div>
  );
};

const CostItem = ({ name, current, cost, icon }: { name: string, current: number, cost: number, icon: string }) => {
  const canAfford = current >= cost;
  return (
    <div className="flex justify-between items-center text-sm">
      <div className="flex items-center gap-2 text-content-200">
        <span>{icon}</span> {name}
      </div>
      <div className={clsx("font-mono", canAfford ? "text-primary-400" : "text-danger-400")}>
        {current} / {cost}
      </div>
    </div>
  );
};

const CraftingStation: React.FC = () => {
  const { player, craftItem } = useGameStore();
  const [craftingId, setCraftingId] = useState<string | null>(null);
  const [result, setResult] = useState<'SUCCESS' | 'FAIL' | null>(null);

  const handleCraft = (recipeId: string) => {
    setCraftingId(recipeId);
    setResult(null);
    
    setTimeout(() => {
      const res = craftItem(recipeId);
      if (res !== 'NO_RES') {
        setResult(res);
      }
      setCraftingId(null);
      
      // Clear result msg after delay
      setTimeout(() => setResult(null), 2000);
    }, 1000);
  };

  return (
    <div className="animate-in fade-in duration-300">
      <div className="mb-4 flex items-center gap-2 text-content-400 text-sm">
         <Info size={14} /> 
         <span>成功率受洞府风水与心性影响</span>
      </div>

      <div className="grid gap-4">
        {RECIPES.map(recipe => {
          const canAffordStones = player.spiritStones >= recipe.baseCost;
          let canAffordMats = true;
          for (const [id, count] of Object.entries(recipe.materials)) {
            if ((player.materials[id] || 0) < count) canAffordMats = false;
          }
          const canCraft = canAffordStones && canAffordMats;

          return (
            <div key={recipe.id} className="bg-surface-800 p-4 rounded-2xl border border-border-base relative overflow-hidden">
              {/* Result Overlay */}
              {result && craftingId === null && (
                 <div className="absolute inset-0 z-20 flex items-center justify-center bg-surface-900/80 backdrop-blur-sm animate-in fade-in">
                    <div className={clsx("text-3xl font-xianxia font-bold", result === 'SUCCESS' ? "text-primary-400" : "text-danger-400")}>
                       {result === 'SUCCESS' ? "炼制成功!" : "炸炉了..."}
                    </div>
                 </div>
              )}

              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-bold text-content-100">{recipe.name}</h3>
                  <div className="text-xs text-content-400 mt-1">成功率: {recipe.successRate * 100}%</div>
                </div>
                <button
                  disabled={!canCraft || craftingId === recipe.id}
                  onClick={() => handleCraft(recipe.id)}
                  className={clsx(
                    "px-4 py-2 rounded-lg font-bold text-sm transition-all",
                    canCraft 
                      ? "bg-primary-600 hover:bg-primary-500 text-white shadow-lg shadow-primary-600/20" 
                      : "bg-surface-700 text-content-400 cursor-not-allowed"
                  )}
                >
                   {craftingId === recipe.id ? "炼制中..." : "开炉"}
                </button>
              </div>

              <div className="bg-surface-900 rounded-xl p-3 text-xs space-y-1">
                 <CostItem name="灵石" current={player.spiritStones} cost={recipe.baseCost} icon="💎" />
                 {Object.entries(recipe.materials).map(([matId, count]) => {
                    const mat = MATERIALS.find(m => m.id === matId);
                    return (
                       <CostItem key={matId} name={mat?.name || matId} current={player.materials[matId] || 0} cost={count} icon={mat?.icon || '📦'} />
                    );
                 })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
