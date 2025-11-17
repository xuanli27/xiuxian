
import React, { useState } from 'react';
import { useGameStore } from '../store/useGameStore';
import { SHOP_ITEMS, MATERIALS } from '../data/constants';
import { Backpack, PackageOpen } from 'lucide-react';
import { Button, PageHeader } from './ui/Shared';
import clsx from 'clsx';

export const Inventory: React.FC = () => {
  const { player, useItem } = useGameStore();
  const [tab, setTab] = useState<'ITEMS' | 'MATS'>('ITEMS');
  
  const ownedItems = SHOP_ITEMS.filter(item => (player.inventory[item.id] || 0) > 0);
  const ownedMats = MATERIALS.filter(mat => (player.materials[mat.id] || 0) > 0);

  return (
    <div className="p-4 pb-24 max-w-4xl mx-auto min-h-screen">
      <PageHeader 
        title="百宝囊" 
        icon={<Backpack size={24} />}
        rightContent={
          <div className="bg-surface-800 p-1 rounded-lg flex text-xs font-bold">
            <button onClick={() => setTab('ITEMS')} className={clsx("px-4 py-1.5 rounded transition-colors", tab === 'ITEMS' ? "bg-surface-600 text-white" : "text-content-400")}>道具</button>
            <button onClick={() => setTab('MATS')} className={clsx("px-4 py-1.5 rounded transition-colors", tab === 'MATS' ? "bg-surface-600 text-white" : "text-content-400")}>材料</button>
          </div>
        }
      />

      {tab === 'ITEMS' ? (
        ownedItems.length === 0 ? <EmptyState msg="道具空空如也，去功德阁看看？" /> : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {ownedItems.map(item => {
              const count = player.inventory[item.id];
              return (
                <div key={item.id} className="bg-surface-800 rounded-2xl p-4 border border-border-base flex gap-4">
                  <div className="text-4xl bg-surface-900 w-16 h-16 rounded-xl flex items-center justify-center border border-border-base">{item.icon}</div>
                  <div className="flex-1">
                     <div className="flex justify-between"><h3 className="font-bold text-content-100">{item.name}</h3><span className="text-primary-400 font-mono font-bold">x{count}</span></div>
                     <p className="text-xs text-content-400 mb-3 h-8 leading-snug">{item.description}</p>
                     <Button size="sm" variant="ghost" onClick={() => useItem(item.id)}>使用</Button>
                  </div>
                </div>
              );
            })}
          </div>
        )
      ) : (
        ownedMats.length === 0 ? <EmptyState msg="暂无炼器材料，快去接需求吧！" /> : (
          <div className="grid grid-cols-3 gap-3">
             {ownedMats.map(mat => (
               <div key={mat.id} className="bg-surface-800 p-3 rounded-xl border border-border-base text-center">
                 <div className="text-3xl mb-2">{mat.icon}</div>
                 <div className="text-sm font-bold truncate">{mat.name}</div>
                 <div className="text-xs text-content-400">拥有: {player.materials[mat.id]}</div>
               </div>
             ))}
          </div>
        )
      )}
    </div>
  );
};

const EmptyState = ({ msg }: { msg: string }) => (
  <div className="flex flex-col items-center justify-center py-20 text-content-400 border-2 border-dashed border-border-base rounded-3xl bg-surface-800/30">
    <PackageOpen size={48} className="mb-4 opacity-50" />
    <p className="font-serif">{msg}</p>
  </div>
);
