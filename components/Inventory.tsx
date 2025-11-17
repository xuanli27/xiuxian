import React from 'react';
import { useGameStore } from '../store/useGameStore';
import { SHOP_ITEMS } from '../types';
import { Backpack, Sparkles, PackageOpen } from 'lucide-react';

export const Inventory: React.FC = () => {
  const { player, useItem } = useGameStore();
  
  // Filter items that player actually owns
  const ownedItems = SHOP_ITEMS.filter(item => (player.inventory[item.id] || 0) > 0);

  return (
    <div className="p-4 pb-24 max-w-4xl mx-auto min-h-screen">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-emerald-900/30 rounded-xl">
          <Backpack size={32} className="text-emerald-400" />
        </div>
        <div>
          <h1 className="font-xianxia text-3xl text-emerald-100">百宝囊</h1>
          <p className="text-slate-400 text-sm">“工欲善其事，必先摸其鱼”</p>
        </div>
      </div>

      {ownedItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-600 border-2 border-dashed border-slate-800 rounded-2xl">
          <PackageOpen size={64} className="mb-4 opacity-50" />
          <p>囊中羞涩，空空如也。</p>
          <p className="text-sm mt-2">快去【宗门-功德阁】进货吧！</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {ownedItems.map(item => {
            const count = player.inventory[item.id];
            return (
              <div key={item.id} className="bg-slate-800 rounded-xl p-4 border border-slate-700 hover:border-emerald-500/50 transition-all shadow-lg relative overflow-hidden group">
                <div className="absolute -right-4 -top-4 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl group-hover:bg-emerald-500/10 transition-colors" />
                
                <div className="flex items-start justify-between mb-4 relative z-10">
                  <div className="text-4xl bg-slate-900 w-16 h-16 rounded-lg flex items-center justify-center shadow-inner">
                    {item.icon}
                  </div>
                  <div className="bg-slate-900 px-3 py-1 rounded-full text-emerald-400 font-mono font-bold text-sm border border-emerald-900/50">
                    x{count}
                  </div>
                </div>

                <h3 className="font-bold text-lg text-slate-200 mb-1">{item.name}</h3>
                <p className="text-xs text-slate-400 mb-4 min-h-[32px]">{item.description}</p>

                <button
                  onClick={() => useItem(item.id)}
                  className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold flex items-center justify-center gap-2 transition-all active:scale-95"
                >
                  <Sparkles size={16} /> 使用
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};