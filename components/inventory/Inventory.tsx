
import React, { useState } from 'react';
import { useGameStore } from '../../store/useGameStore';
import { ALL_ITEMS, MATERIALS } from '../../data/constants';
import { EquipmentPanel } from './EquipmentPanel';
import { PackageOpen, Zap, ShieldMinus, MoveUp, Backpack } from 'lucide-react';
import { Button, PageHeader } from '../ui/Shared';
import clsx from 'clsx';

export const Inventory: React.FC = () => {
  const { player, useItem, equipItem } = useGameStore();
  const [tab, setTab] = useState<'ITEMS' | 'MATS'>('ITEMS');
  
  const ownedItems = ALL_ITEMS.filter(item => (player.inventory[item.id] || 0) > 0);
  const ownedMats = MATERIALS.filter(mat => (player.materials[mat.id] || 0) > 0);

  return (
    <div className="pb-24 min-h-screen">
      <PageHeader 
        title="百宝囊" 
        icon={<Backpack size={24} />}
        rightContent={
          <div className="bg-surface-800 p-1 rounded-xl border border-border-base flex text-xs font-bold shadow-sm">
            <button onClick={() => setTab('ITEMS')} className={clsx("px-5 py-2 rounded-lg transition-all duration-300", tab === 'ITEMS' ? "bg-surface-600 text-white shadow-md" : "text-content-400 hover:text-content-100")}>道具</button>
            <button onClick={() => setTab('MATS')} className={clsx("px-5 py-2 rounded-lg transition-all duration-300", tab === 'MATS' ? "bg-surface-600 text-white shadow-md" : "text-content-400 hover:text-content-100")}>材料</button>
          </div>
        }
      />
      
      <EquipmentPanel />

      <div className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {tab === 'ITEMS' ? (
            ownedItems.length === 0 ? <EmptyState msg="道具空空如也，去功德阁看看？" /> : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {ownedItems.map(item => {
                const count = player.inventory[item.id];
                const isEquip = item.type === 'ARTIFACT';
                
                return (
                    <div key={item.id} className="bg-surface-800/60 backdrop-blur-sm rounded-2xl p-4 border border-border-base flex gap-4 group hover:border-primary-500/30 transition-all hover:shadow-lg">
                        <div className={clsx(
                            "text-4xl w-16 h-16 rounded-2xl flex items-center justify-center border shadow-inner transition-transform group-hover:scale-105", 
                            isEquip ? "bg-secondary-900/20 border-secondary-500/30 text-secondary-400" : "bg-surface-900 border-border-base"
                        )}>
                            {item.icon}
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between items-center">
                                <h3 className="font-bold text-content-100">{item.name}</h3>
                                <span className="text-xs font-mono bg-surface-900 px-2 py-0.5 rounded text-content-400">x{count}</span>
                            </div>
                            <p className="text-xs text-content-400 mt-1 mb-3 h-8 leading-snug line-clamp-2 opacity-80">{item.description}</p>
                            
                            {isEquip && item.bonus && (
                                <div className="flex gap-2 mb-3 text-[10px] font-mono font-bold text-secondary-400">
                                    {item.bonus.qiMultiplier && <span className="flex items-center gap-1 bg-secondary-900/20 px-1.5 py-0.5 rounded border border-secondary-500/20"><Zap size={10}/> +{(item.bonus.qiMultiplier * 100).toFixed(0)}%</span>}
                                    {item.bonus.demonReduction && <span className="flex items-center gap-1 bg-secondary-900/20 px-1.5 py-0.5 rounded border border-secondary-500/20"><ShieldMinus size={10}/> -{(item.bonus.demonReduction * 100).toFixed(0)}%</span>}
                                </div>
                            )}

                            <Button 
                                size="sm" 
                                variant={isEquip ? "secondary" : "ghost"} 
                                className={clsx("w-full", !isEquip && "bg-surface-700 hover:bg-surface-600")}
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
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                {ownedMats.map(mat => (
                <div key={mat.id} className="bg-surface-800 p-4 rounded-2xl border border-border-base text-center hover:-translate-y-1 transition-transform shadow-sm">
                    <div className="text-4xl mb-2 filter drop-shadow-md">{mat.icon}</div>
                    <div className="text-sm font-bold truncate text-content-200">{mat.name}</div>
                    <div className="text-xs text-content-400 mt-1 font-mono">QTY: {player.materials[mat.id]}</div>
                </div>
                ))}
            </div>
            )
        )}
      </div>
    </div>
  );
};

const EmptyState = ({ msg }: { msg: string }) => (
  <div className="flex flex-col items-center justify-center py-20 text-content-400 border-2 border-dashed border-border-base rounded-3xl bg-surface-800/20">
    <PackageOpen size={48} className="mb-4 opacity-50" />
    <p className="font-serif opacity-70">{msg}</p>
  </div>
);
