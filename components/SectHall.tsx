import React, { useState } from 'react';
import { useGameStore } from '../store/useGameStore';
import { SectRank, SECT_PROMOTION_COST, SHOP_ITEMS, SHOP_PRICES } from '../types';
import { Crown, Scroll, TrendingUp, Lock, ShoppingBag, Coins, Info } from 'lucide-react';
import clsx from 'clsx';

export const SectHall: React.FC = () => {
  const { player, promoteSectRank, buyItem } = useGameStore();
  const [activeTab, setActiveTab] = useState<'HALL' | 'SHOP'>('HALL');
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = ((y - centerY) / centerY) * -15; 
    const rotateY = ((x - centerX) / centerX) * 15;

    setTilt({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  // Next Rank Logic
  const ranks = Object.values(SectRank);
  const currentIdx = ranks.indexOf(player.sectRank);
  const isMaxRank = currentIdx === ranks.length - 1;
  const nextRank = isMaxRank ? null : ranks[currentIdx + 1] as SectRank;
  const cost = nextRank ? SECT_PROMOTION_COST[nextRank] : 0;
  const canPromote = nextRank && player.contribution >= cost;

  return (
    <div className="p-4 pb-24 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex justify-center mb-6">
        <div className="bg-slate-900/80 p-1 rounded-lg flex gap-2">
          <button 
            onClick={() => setActiveTab('HALL')}
            className={clsx("px-6 py-2 rounded-md font-bold transition-all", activeTab === 'HALL' ? "bg-emerald-600 text-white" : "text-slate-500 hover:text-slate-300")}
          >
            宗门大殿
          </button>
          <button 
            onClick={() => setActiveTab('SHOP')}
            className={clsx("px-6 py-2 rounded-md font-bold transition-all", activeTab === 'SHOP' ? "bg-amber-600 text-white" : "text-slate-500 hover:text-slate-300")}
          >
            功德阁 (商城)
          </button>
        </div>
      </div>

      {activeTab === 'HALL' ? (
        <>
          <div className="mb-8 text-center">
            <h1 className="font-xianxia text-4xl text-amber-500 mb-2 drop-shadow-lg">仙欲宗</h1>
            <p className="text-slate-400 text-sm italic">“一入宗门深似海，从此节操是路人”</p>
          </div>

          {/* 3D Identity Token */}
          <div className="flex justify-center mb-10 perspective-1000 py-4">
            <div 
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              style={{
                transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
                transition: 'transform 0.1s ease-out'
              }}
              className="relative w-72 h-96 bg-gradient-to-b from-slate-800 to-slate-950 rounded-2xl border-4 border-amber-600/40 shadow-[0_0_30px_rgba(217,119,6,0.3)] preserve-3d cursor-pointer group select-none"
            >
              {/* Inner Holographic Glow */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-transparent via-amber-400/10 to-transparent opacity-50 pointer-events-none" />
              
              <div className="absolute inset-4 border border-amber-500/30 rounded-lg flex flex-col items-center justify-between p-6 backface-hidden bg-slate-900/50">
                <div className="text-amber-500/50 font-xianxia text-2xl tracking-widest">仙欲宗令</div>
                
                <div className="text-center transform translate-z-10">
                  <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden border-4 border-amber-500/50 bg-slate-950 shadow-lg">
                     {player.avatar ? <img src={player.avatar} className="w-full h-full object-cover" /> : null}
                  </div>
                  <h2 className="text-3xl font-xianxia text-amber-100 mb-2 drop-shadow-md">{player.name}</h2>
                  <div className="inline-block px-4 py-1 bg-amber-950/80 rounded-full text-amber-400 border border-amber-600/50 text-sm font-bold shadow-inner">
                    {player.sectRank}
                  </div>
                </div>

                <div className="w-full">
                  <div className="flex justify-between text-xs text-amber-500/80 mb-1 font-mono">
                    <span>CONTRIBUTION</span>
                    <span>{player.contribution}</span>
                  </div>
                  <div className="h-2 bg-slate-950 rounded-full overflow-hidden border border-amber-900/30">
                     <div className="h-full bg-gradient-to-r from-amber-700 to-amber-400 w-full" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Promotion System */}
          <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-6 mb-6 shadow-lg backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-4 text-amber-400 border-b border-slate-700 pb-3">
              <TrendingUp size={24} />
              <h3 className="text-xl font-xianxia">职位晋升</h3>
            </div>
            
            {isMaxRank ? (
              <div className="text-center py-4 text-amber-300 bg-amber-900/20 rounded-lg">
                <Crown size={48} className="mx-auto mb-2 animate-bounce" />
                <p>已至宗门巅峰，请尽情压榨师弟师妹。</p>
              </div>
            ) : (
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="text-slate-300">
                  <p className="text-lg">下一职级: <span className="text-amber-400 font-bold">{nextRank}</span></p>
                  <p className="text-sm text-slate-500 mt-1 flex items-center gap-1"><Coins size={14}/> 需贡献: {cost}</p>
                </div>
                <button
                  onClick={promoteSectRank}
                  disabled={!canPromote}
                  className={`px-6 py-3 rounded-lg font-bold flex items-center gap-2 transition-all transform hover:scale-105 ${
                    canPromote 
                    ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-lg shadow-amber-600/20' 
                    : 'bg-slate-700 text-slate-500 cursor-not-allowed grayscale'
                  }`}
                >
                  {canPromote ? <TrendingUp size={18} /> : <Lock size={18} />}
                  {canPromote ? "申请晋升" : "贡献不足"}
                </button>
              </div>
            )}
          </div>

          {/* Sect Rules */}
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4 text-slate-400">
              <Scroll size={20} />
              <h3 className="text-lg font-serif">《仙欲宗门规·修订版》</h3>
            </div>
            <ul className="space-y-3 text-sm text-slate-500 list-disc pl-5 italic">
              <li>能坐着绝不站着，能躺着绝不坐着。</li>
              <li>遇到困难睡大觉，天塌下来有高个子顶着。</li>
              <li>严禁内卷，违者废除修为逐出宗门。</li>
              <li>宗主也是打工人，不要给他发消息。</li>
            </ul>
          </div>
        </>
      ) : (
        // SHOP TAB
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
           <div className="bg-amber-900/20 border border-amber-700/30 rounded-lg p-4 mb-6 flex justify-between items-center">
              <span className="text-amber-200 font-bold flex items-center gap-2">
                <Coins className="text-amber-400" /> 我的贡献:
              </span>
              <span className="text-2xl font-mono text-amber-400">{player.contribution}</span>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             {SHOP_ITEMS.map(item => {
               const price = SHOP_PRICES[item.id];
               const canBuy = player.contribution >= price;
               return (
                 <div key={item.id} className="bg-slate-800 border border-slate-700 p-4 rounded-xl flex gap-4 hover:border-amber-500/50 transition-colors group">
                    <div className="w-16 h-16 bg-slate-900 rounded-lg flex items-center justify-center text-3xl shadow-inner group-hover:scale-110 transition-transform">
                      {item.icon}
                    </div>
                    <div className="flex-1">
                       <div className="flex justify-between items-start mb-1">
                         <h3 className="font-bold text-slate-200">{item.name}</h3>
                         <span className="text-amber-400 font-mono text-sm flex items-center gap-1">
                           <Coins size={12} /> {price}
                         </span>
                       </div>
                       <p className="text-xs text-slate-500 mb-3">{item.description}</p>
                       <button
                         onClick={() => buyItem(item.id)}
                         disabled={!canBuy}
                         className={clsx(
                           "w-full py-1.5 rounded text-sm font-bold transition-colors flex items-center justify-center gap-2",
                           canBuy 
                             ? "bg-slate-700 hover:bg-amber-600 hover:text-white text-slate-300"
                             : "bg-slate-800 text-slate-600 cursor-not-allowed"
                         )}
                       >
                         <ShoppingBag size={14} /> 兑换
                       </button>
                    </div>
                 </div>
               );
             })}
           </div>
           <div className="mt-6 p-4 bg-blue-900/20 border border-blue-500/20 rounded text-sm text-blue-300 flex gap-3">
              <Info className="shrink-0" size={18} />
              <p>兑换的物品会自动存入【行囊】中，请前往行囊使用。</p>
           </div>
        </div>
      )}
    </div>
  );
};