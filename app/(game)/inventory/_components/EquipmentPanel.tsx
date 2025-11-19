import React from 'react';
import { usePlayer } from '@/hooks/use-player';
import { unequipItem } from '@/features/inventory/actions';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { EquipmentSlot } from '@/types';
import { ALL_ITEMS } from '@/data/constants';
import { HardHat, Shirt, Sword, Watch } from 'lucide-react';
import clsx from 'clsx';
import { toast } from 'sonner';

export const EquipmentPanel: React.FC = () => {
    const { player } = usePlayer();
    const queryClient = useQueryClient();

    const unequipMutation = useMutation({
        mutationFn: (slot: string) => unequipItem({ slot }),
        onSuccess: (result) => {
            if (result.success) {
                toast.success(result.message);
                queryClient.invalidateQueries({ queryKey: ['player'] });
            } else {
                toast.error(result.message);
            }
        },
        onError: (error) => {
            toast.error('卸下装备失败');
            console.error(error);
        }
    });

    const handleUnequip = (slot: string) => {
        unequipMutation.mutate(slot);
    };

    if (!player) return null;

    // Ensure equipped is treated as a Record<string, any> or similar structure if strictly typed
    // The Prisma type might be Json, so we cast or access safely
    const equipped = (player.equipped as Record<string, { id: string }>) || {};

    return (
        <div className="relative bg-surface-900/80 backdrop-blur-md rounded-3xl p-8 border border-surface-700 shadow-2xl overflow-hidden group">
            {/* Background flair */}
            <div className="absolute inset-0 bg-gradient-to-br from-secondary-900/20 to-transparent pointer-events-none" />
            <div className="absolute -right-20 -top-20 w-60 h-60 bg-secondary-500/10 rounded-full blur-3xl animate-pulse" />

            <div className="relative z-10">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold font-xianxia text-secondary-200 flex items-center gap-3">
                        <span className="text-3xl filter drop-shadow-md">⚔️</span> 本命法宝
                    </h2>
                    <div className="text-[10px] text-content-500 font-mono tracking-widest uppercase border border-surface-700 px-2 py-1 rounded">Equipment Slots</div>
                </div>

                <div className="flex justify-center">
                    {/* Humanoid Layout - Simplified to a grid but styled to look connected */}
                    <div className="grid grid-cols-2 gap-6 w-full max-w-md">
                        <EquipSlot
                            slot={EquipmentSlot.HEAD}
                            icon={<HardHat size={28} />}
                            equippedId={equipped[EquipmentSlot.HEAD]?.id}
                            onUnequip={() => handleUnequip(EquipmentSlot.HEAD)}
                            label="头部"
                            isPending={unequipMutation.isPending}
                        />
                        <EquipSlot
                            slot={EquipmentSlot.ACCESSORY}
                            icon={<Watch size={28} />}
                            equippedId={equipped[EquipmentSlot.ACCESSORY]?.id}
                            onUnequip={() => handleUnequip(EquipmentSlot.ACCESSORY)}
                            label="饰品"
                            isPending={unequipMutation.isPending}
                        />
                        <EquipSlot
                            slot={EquipmentSlot.BODY}
                            icon={<Shirt size={28} />}
                            equippedId={equipped[EquipmentSlot.BODY]?.id}
                            onUnequip={() => handleUnequip(EquipmentSlot.BODY)}
                            label="身体"
                            isPending={unequipMutation.isPending}
                        />
                        <EquipSlot
                            slot={EquipmentSlot.WEAPON}
                            icon={<Sword size={28} />}
                            equippedId={equipped[EquipmentSlot.WEAPON]?.id}
                            onUnequip={() => handleUnequip(EquipmentSlot.WEAPON)}
                            label="法宝"
                            isPending={unequipMutation.isPending}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

const EquipSlot = ({ slot, icon, equippedId, onUnequip, label, isPending }: { slot: string, icon: React.ReactNode, equippedId: string | null, onUnequip: () => void, label: string, isPending: boolean }) => {
    const item = equippedId ? ALL_ITEMS.find(i => i.id === equippedId) : null;

    return (
        <div
            onClick={equippedId && !isPending ? onUnequip : undefined}
            className={clsx(
                "aspect-[4/3] rounded-2xl border-2 flex flex-col items-center justify-center relative cursor-pointer transition-all duration-300 group overflow-hidden",
                equippedId
                    ? "bg-surface-800/80 border-secondary-500/50 shadow-[0_0_20px_rgba(217,119,6,0.15)] hover:border-secondary-400 hover:shadow-[0_0_30px_rgba(217,119,6,0.25)] hover:scale-[1.02]"
                    : "bg-surface-950/30 border-dashed border-surface-700 hover:bg-surface-900 hover:border-surface-600",
                isPending && "opacity-50 cursor-wait"
            )}
        >
            {equippedId && <div className="absolute inset-0 bg-gradient-to-br from-secondary-500/10 to-transparent" />}

            <div className={clsx("text-4xl z-10 transition-transform duration-300", equippedId ? "group-hover:scale-110 filter drop-shadow-xl text-secondary-200" : "opacity-20 text-content-500")}>
                {item ? item.icon : icon}
            </div>

            <div className="mt-3 z-10 text-center">
                <span className={clsx("text-sm font-bold block tracking-wide", item ? "text-secondary-100" : "text-content-500")}>
                    {item ? item.name : label}
                </span>
                {item && <span className="text-[10px] text-secondary-400/80 font-mono bg-secondary-950/50 px-2 py-0.5 rounded mt-1 inline-block border border-secondary-500/20">Lv.MAX</span>}
            </div>

            {equippedId && (
                <div className="absolute top-2 right-2 w-2 h-2 bg-danger-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-20 shadow-[0_0_8px_rgba(220,38,38,0.8)] animate-pulse" title="点击卸下" />
            )}
        </div>
    );
};
