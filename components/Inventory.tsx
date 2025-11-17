
import React, { useState } from 'react';
import { useGameStore } from '../store/useGameStore';
import { ALL_ITEMS, MATERIALS } from '../data/constants';
import { EquipmentSlot } from '../types';
import { Backpack, PackageOpen, Shirt, Sword, HardHat, Watch, Zap, ShieldMinus, MoveUp } from 'lucide-react';
import { Button, PageHeader } from './ui/Shared';
import clsx from 'clsx';

export const Inventory: React.FC = () => {
  const { player, useItem, equipItem, unequipItem } = useGameStore();
  const [tab, setTab] = useState<'ITEMS' | 'MATS'>('ITEMS');
  
  const ownedItems = ALL_ITEMS.filter(item => (player.inventory[item.id] || 0) > 0);
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
      
      {/* Equipment Panel */}
      <div className="mb-8 bg-surface-800 rounded-3xl p-6 border border-border-base shadow-lg relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-surface-900/50 to-transparent pointer-events-none" />
        <div className="relative z-10">
            <h2 className="text-lg font-xianxia text-secondary-400 mb-4 flex items-center gap-2">
                <Shirt size={20} /> 
                <span>本命法宝</span>
            </h2>
            <div className="grid grid-cols-4 gap-2 sm:gap-4">
                <EquipSlot 
                    slot={EquipmentSlot.HEAD} 
                    icon={<HardHat size={20} />} 
                    equippedId={player.equipped[EquipmentSlot.HEAD]} 
                    onUnequip={() => unequipItem(EquipmentSlot.HEAD)}
                />
                <EquipSlot 
                    slot={EquipmentSlot.BODY} 
                    icon={<Shirt size={20} />} 
                    equippedId={player.equipped[EquipmentSlot.BODY]} 
                    onUnequip={() => unequipItem(EquipmentSlot.BODY)}
                />
                <EquipSlot 
                    slot={EquipmentSlot.WEAPON} 
                    icon={<Sword size={20} />} 
                    equippedId={player.equipped[EquipmentSlot.WEAPON]} 
                    onUnequip={() => unequipItem(EquipmentSlot.WEAPON)}
                />
                <EquipSlot 
                    slot={EquipmentSlot.ACCESSORY} 
                    icon={<Watch size={20} />} 
                    equippedId={player.equipped[EquipmentSlot.ACCESSORY]} 
                    onUnequip={() => unequipItem(EquipmentSlot.ACCESSORY)}
                />
            </div>
        </div>
      </div>

      {tab === 'ITEMS' ? (
        ownedItems.length === 0 ? <EmptyState msg="道具空空如也，去功德阁看看？" /> : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {ownedItems.map(item => {
              const count = player.inventory[item.id];
              const isEquip = item.type === 'ARTIFACT';
              
              return (
                <div key={item.id} className="bg-surface-800 rounded-2xl p-4 border border-border-base flex gap-4">
                  <div className={clsx("text-4xl w-16 h-16 rounded-xl flex items-center justify-center border border-border-base shadow-inner", isEquip ? "bg-secondary-900/20 border-secondary-500/30" : "bg-surface-900")}>
                      {item.icon}
                  </div>
                  <div className="flex-1">
                     <div className="flex justify-between"><h3 className="font-bold text-content-100">{item.name}</h3><span className="text-primary-400 font-mono font-bold">x{count}</span></div>
                     <p className="text-xs text-content-400 mb-2 h-8 leading-snug line-clamp-2">{item.description}</p>
                     
                     {/* Stats Display for Artifacts */}
                     {isEquip && item.bonus && (
                         <div className="flex gap-2 mb-3 text-[10px] font-mono text-secondary-400">
                             {item.bonus.qiMultiplier && <span className="flex items-center gap-0.5 bg-surface-900 px-1.5 py-0.5 rounded"><Zap size={10}/> +{(item.bonus.qiMultiplier * 100).toFixed(0)}%</span>}
                             {item.bonus.demonReduction && <span className="flex items-center gap-0.5 bg-surface-900 px-1.5 py-0.5 rounded"><ShieldMinus size={10}/> -{(item.bonus.demonReduction * 100).toFixed(0)}%</span>}
                         </div>
                     )}

                     <Button 
                        size="sm" 
                        variant={isEquip ? "secondary" : "ghost"} 
                        onClick={() => isEquip ? equipItem(item.id) : useItem(item.id)}
                        icon={isEquip ? <MoveUp size={14} /> : undefined}
                    >
                        {isEquip ? "装备" : "使用"}
                    </Button>
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

const EquipSlot = ({ slot, icon, equippedId, onUnequip }: { slot: string, icon: React.ReactNode, equippedId: string | null, onUnequip: () => void }) => {
    const item = equippedId ? ALL_ITEMS.find(i => i.id === equippedId) : null;
    
    return (
        <div onClick={equippedId ? onUnequip : undefined} className={clsx("aspect-square rounded-xl border-2 flex flex-col items-center justify-center relative cursor-pointer transition-all active:scale-95 group", equippedId ? "bg-surface-800 border-primary-500/50 shadow-[0_0_10px_rgba(16,185,129,0.1)]" : "bg-surface-900/50 border-dashed border-border-base")}>
            {equippedId && <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 to-transparent rounded-xl" />}
            
            <div className={clsx("text-2xl z-10 transition-transform", equippedId && "group-hover:scale-110")}>
                {item ? item.icon : <span className="opacity-20">{icon}</span>}
            </div>
            
            <span className="text-[10px] mt-1 z-10 font-bold text-content-400 uppercase tracking-wider">
                {item ? <span className="text-primary-400">{item.name}</span> : slot}
            </span>

            {equippedId && (
                <div className="absolute -top-1 -right-1 bg-surface-900 rounded-full p-0.5 border border-border-base opacity-0 group-hover:opacity-100 transition-opacity z-20">
                    <div className="w-2 h-2 bg-red-500 rounded-full" />
                </div>
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
