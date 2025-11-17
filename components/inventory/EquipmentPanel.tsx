
import React from 'react';
import { useGameStore } from '../../store/useGameStore';
import { EquipmentSlot } from '../../types';
import { ALL_ITEMS } from '../../data/constants';
import { HardHat, Shirt, Sword, Watch } from 'lucide-react';
import clsx from 'clsx';

export const EquipmentPanel: React.FC = () => {
    const { player, unequipItem } = useGameStore();

    return (
        <div className="relative bg-surface-800 rounded-3xl p-6 border border-border-base shadow-xl overflow-hidden group">
            {/* Background flair */}
            <div className="absolute inset-0 bg-gradient-to-br from-secondary-900/10 to-transparent pointer-events-none" />
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-secondary-500/10 rounded-full blur-3xl" />

            <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-xianxia text-secondary-400 flex items-center gap-2">
                        <span>⚔️</span> 本命法宝
                    </h2>
                    <div className="text-xs text-content-400 font-mono opacity-50">EQUIPMENT_SLOTS</div>
                </div>
                
                <div className="flex justify-center gap-4 sm:gap-8">
                    {/* Humanoid Layout - Simplified to a grid but styled to look connected */}
                    <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
                        <EquipSlot 
                            slot={EquipmentSlot.HEAD} 
                            icon={<HardHat size={24} />} 
                            equippedId={player.equipped[EquipmentSlot.HEAD]} 
                            onUnequip={() => unequipItem(EquipmentSlot.HEAD)}
                            label="头部"
                        />
                        <EquipSlot 
                            slot={EquipmentSlot.ACCESSORY} 
                            icon={<Watch size={24} />} 
                            equippedId={player.equipped[EquipmentSlot.ACCESSORY]} 
                            onUnequip={() => unequipItem(EquipmentSlot.ACCESSORY)}
                            label="饰品"
                        />
                         <EquipSlot 
                            slot={EquipmentSlot.BODY} 
                            icon={<Shirt size={24} />} 
                            equippedId={player.equipped[EquipmentSlot.BODY]} 
                            onUnequip={() => unequipItem(EquipmentSlot.BODY)}
                            label="身体"
                        />
                        <EquipSlot 
                            slot={EquipmentSlot.WEAPON} 
                            icon={<Sword size={24} />} 
                            equippedId={player.equipped[EquipmentSlot.WEAPON]} 
                            onUnequip={() => unequipItem(EquipmentSlot.WEAPON)}
                            label="法宝"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

const EquipSlot = ({ slot, icon, equippedId, onUnequip, label }: { slot: string, icon: React.ReactNode, equippedId: string | null, onUnequip: () => void, label: string }) => {
    const item = equippedId ? ALL_ITEMS.find(i => i.id === equippedId) : null;
    
    return (
        <div 
            onClick={equippedId ? onUnequip : undefined} 
            className={clsx(
                "aspect-[4/3] rounded-2xl border-2 flex flex-col items-center justify-center relative cursor-pointer transition-all duration-300 group overflow-hidden",
                equippedId 
                    ? "bg-surface-800 border-secondary-500/50 shadow-[0_0_15px_rgba(217,119,6,0.15)] hover:border-secondary-400" 
                    : "bg-surface-900/50 border-dashed border-border-base hover:bg-surface-800"
            )}
        >
            {equippedId && <div className="absolute inset-0 bg-gradient-to-br from-secondary-500/10 to-transparent" />}
            
            <div className={clsx("text-3xl z-10 transition-transform duration-300", equippedId && "group-hover:scale-110 filter drop-shadow-lg")}>
                {item ? item.icon : <span className="opacity-20 text-content-400">{icon}</span>}
            </div>
            
            <div className="mt-2 z-10 text-center">
                 <span className={clsx("text-xs font-bold block", item ? "text-secondary-200" : "text-content-400")}>
                    {item ? item.name : label}
                 </span>
                 {item && <span className="text-[9px] text-secondary-400/70 font-mono">Lv.MAX</span>}
            </div>

            {equippedId && (
                <div className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-20 shadow-[0_0_5px_red]" />
            )}
        </div>
    );
};
