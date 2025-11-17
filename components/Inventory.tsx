import React from 'react';
import { useGameStore } from '../store/useGameStore';
import { SHOP_ITEMS } from '../types';
import { Backpack, Sparkles, PackageOpen } from 'lucide-react';

export const Inventory: React.FC = () => {
  const { player, useItem } = useGameStore();
  
  const ownedItems = SHOP_ITEMS.filter(item => (player.inventory[item.id] || 0) > 0);

  return (
    <div className="p-4 pb-24 max-w-4xl mx-auto min-h-screen">
      <div className="flex items-center gap-3 mb-8 animate-in fade-in slide-in-from-top-2 duration-300">
        <div className="p-3 bg-primary-600/20 rounded-2xl border border-primary-600/30">
          <Backpack size={32} className="text-primary-400" />
        </div>
        <div>
          <h1 className="font-xianxia text-3xl text-primary-400">百宝囊</h1>
          <p className="text-content-400 text-sm">“工欲善其事，必先摸其鱼”</p>
        </div>
      </div>

      {ownedItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-content-400 border-2 border-dashed border-border-base rounded-3xl bg-surface-800/30">
          <PackageOpen size={64} className="mb-4 opacity-50" />
          <p className="font-serif text-lg">囊中羞涩，空空如也。</p>
          <p className="text-sm mt-2 text-content-400">快去【宗门-功德阁】进货吧！</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {ownedItems.map(item => {
            const count = player.inventory[item.id];
            return (
              <div key={item.id} className="bg-surface-800 rounded-2xl p-5 border border-border-base hover:border-primary-500/50 transition-all shadow-lg relative overflow-hidden group">
                <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary-500/5 rounded-full blur-xl group-hover:bg-primary-500/10 transition-colors" />
                
                <div className="flex items-start justify-between mb-4 relative z-10">
                  <div className="text-4xl bg-surface-900 w-16 h-16 rounded-2xl flex items-center justify-center shadow-inner border border-border-base">
                    {item.icon}
                  </div>
                  <div className="bg-surface-900 px-3 py-1 rounded-full text-primary-400 font-mono font-bold text-sm border border-primary-600/30">
                    x{count}
                  </div>
                </div>

                <h3 className="font-bold text-lg text-content-100 mb-1">{item.name}</h3>
                <p className="text-xs text-content-400 mb-6 min-h-[32px] leading-relaxed">{item.description}</p>

                <button
                  onClick={() => useItem(item.id)}
                  className="w-full py-3 bg-primary-600 hover:bg-primary-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95 shadow-md shadow-primary-600/20"
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