'use client'

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PackageOpen, Zap, ShieldMinus, MoveUp, Backpack } from 'lucide-react';
import { Button, PageHeader } from '@/components/ui';
import clsx from 'clsx';
import { EquipmentPanel } from './EquipmentPanel';
import { getPlayerInventory, useItem as itemAction, equipItem } from '@/features/inventory/actions';
import type { Player } from '@/types/enums';
import type { InventoryItem, Item } from '@/features/inventory/types';

interface Props {
  initialItems: InventoryItem[]
  player: Player
}

export const Inventory: React.FC<Props> = ({ initialItems, player }) => {
  const queryClient = useQueryClient();
  const [tab, setTab] = useState<'ITEMS' | 'MATS'>('ITEMS');

  const { data: items, isLoading } = useQuery({
    queryKey: ['inventory', player.id],
    queryFn: () => getPlayerInventory(),
    initialData: initialItems,
  });

  const useItemMutation = useMutation({
    mutationFn: (itemId: string) => itemAction({ itemId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory', player.id] });
      queryClient.invalidateQueries({ queryKey: ['player', player.id] });
    },
  });

  const equip = useMutation({
    mutationFn: (item: Item) => equipItem({ itemId: item.id, slot: item.slot! }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory', player.id] });
      queryClient.invalidateQueries({ queryKey: ['player', player.id] });
    },
  });

  const ownedItems = items?.filter(item => item.item.type !== 'MATERIAL');
  const ownedMats = items?.filter(item => item.item.type === 'MATERIAL');

  return (
    <div className="pb-24 min-h-screen">
      <PageHeader
        title="储物戒指"
        icon={<span className="text-2xl">💍</span>}
        rightContent={
          <div className="bg-surface-800 p-1 rounded-xl border border-border-base flex text-xs font-bold shadow-sm">
            <button onClick={() => setTab('ITEMS')} className={clsx("px-5 py-2 rounded-lg transition-all duration-300", tab === 'ITEMS' ? "bg-surface-600 text-white shadow-md" : "text-content-400 hover:text-content-100")}>法宝</button>
            <button onClick={() => setTab('MATS')} className={clsx("px-5 py-2 rounded-lg transition-all duration-300", tab === 'MATS' ? "bg-surface-600 text-white shadow-md" : "text-content-400 hover:text-content-100")}>天材</button>
          </div>
        }
      />

      <EquipmentPanel />

      <div className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {tab === 'ITEMS' ? (
          ownedItems?.length === 0 ? <EmptyState msg="道具空空如也，去功德阁看看？" /> : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {ownedItems?.map(({ item, quantity }) => {
                const isEquip = item.type === 'EQUIPMENT';

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
                        <span className="text-xs font-mono bg-surface-900 px-2 py-0.5 rounded text-content-400">x{quantity}</span>
                      </div>
                      <p className="text-xs text-content-400 mt-1 mb-3 h-8 leading-snug line-clamp-2 opacity-80">{item.description}</p>

                      {isEquip && item.stats && (
                        <div className="flex gap-2 mb-3 text-[10px] font-mono font-bold text-secondary-400">
                          {item.stats.attack && <span className="flex items-center gap-1 bg-secondary-900/20 px-1.5 py-0.5 rounded border border-secondary-500/20"><Zap size={10} /> +{item.stats.attack}</span>}
                          {item.stats.defense && <span className="flex items-center gap-1 bg-secondary-900/20 px-1.5 py-0.5 rounded border border-secondary-500/20"><ShieldMinus size={10} /> +{item.stats.defense}</span>}
                        </div>
                      )}

                      <Button
                        size="sm"
                        variant={isEquip ? "secondary" : "ghost"}
                        className={clsx("w-full", !isEquip && "bg-surface-700 hover:bg-surface-600")}
                        onClick={() => isEquip ? equip.mutate(item) : useItemMutation.mutate(item.id)}
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
          ownedMats?.length === 0 ? <EmptyState msg="暂无炼器材料，快去接需求吧！" /> : (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
              {ownedMats?.map(({ item, quantity }) => (
                <div key={item.id} className="bg-surface-800 p-4 rounded-2xl border border-border-base text-center hover:-translate-y-1 transition-transform shadow-sm">
                  <div className="text-4xl mb-2 filter drop-shadow-md">{item.icon}</div>
                  <div className="text-sm font-bold truncate text-content-200">{item.name}</div>
                  <div className="text-xs text-content-400 mt-1 font-mono">QTY: {quantity}</div>
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