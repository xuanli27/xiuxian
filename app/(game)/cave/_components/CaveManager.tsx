'use client'

import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowUpCircle, Hammer, Home, Sparkles, Box } from 'lucide-react';
import { Button, Card } from '@/components/ui';
import clsx from 'clsx';
import { getPlayerCave, getCaveStats } from '@/features/cave/queries';
import { upgradeCave } from '@/features/cave/actions';
import { CAVE_CONFIG } from '@/config/game';
import { calculateCaveUpgradeCost } from '@/features/cave/utils';
import type { Player } from '@prisma/client';
import type { Cave } from '@/features/cave/types';

interface Props {
  initialCave: Cave
  player: Player
}

export const CaveManager: React.FC<Props> = ({ initialCave, player }) => {
  const queryClient = useQueryClient();

  const { data: cave } = useQuery({
    queryKey: ['cave', player.id],
    queryFn: () => getPlayerCave(player.id),
    initialData: initialCave,
  });

  const { data: stats } = useQuery({
    queryKey: ['caveStats', player.id],
    queryFn: () => getCaveStats(player.id),
  });

  const upgrade = useMutation({
    mutationFn: () => upgradeCave({ playerId: player.id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cave', player.id] });
      queryClient.invalidateQueries({ queryKey: ['caveStats', player.id] });
      queryClient.invalidateQueries({ queryKey: ['player', player.id] });
    },
  });

  if (!cave || !stats) {
    return <div className="p-8 text-center text-primary-200 animate-pulse">加载洞府数据中...</div>
  }

  const nextLevel = cave.level + 1;
  const nextLevelConfig = CAVE_CONFIG.levelNames[nextLevel as keyof typeof CAVE_CONFIG.levelNames];
  const upgradeCost = calculateCaveUpgradeCost(cave.level);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="relative h-64 bg-surface-900 rounded-3xl border border-surface-700 mb-8 overflow-hidden group shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-surface-900 via-surface-950 to-black z-0" />
        <div className="absolute top-0 right-0 w-80 h-80 bg-primary-500/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2 animate-pulse" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary-500/10 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />

        <div className="absolute inset-0 flex items-center justify-center opacity-5 text-[12rem] select-none grayscale group-hover:grayscale-0 transition-all duration-1000 transform group-hover:scale-110">
          🏠
        </div>

        <div className="absolute bottom-8 left-8 z-10">
          <h2 className="text-4xl font-bold font-xianxia text-transparent bg-clip-text bg-gradient-to-r from-primary-200 via-primary-100 to-primary-300 mb-2 drop-shadow-lg">
            {cave.name}
          </h2>
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-primary-900/40 border border-primary-500/30 rounded-full text-primary-300 text-xs font-bold backdrop-blur-sm">
              Lv.{cave.level}
            </span>
            <p className="text-content-400 text-sm font-serif italic opacity-80">“斯是陋室，惟吾德馨”</p>
          </div>
        </div>

        <div className="absolute top-6 right-6 z-10 bg-surface-950/60 backdrop-blur-md px-5 py-3 rounded-2xl border border-surface-700/50 text-sm font-mono text-primary-300 shadow-lg flex flex-col items-end group-hover:border-primary-500/30 transition-colors">
          <span className="text-[10px] text-content-400 uppercase tracking-wider mb-1">灵气浓度</span>
          <span className="text-2xl font-bold flex items-center gap-2">
            <Sparkles size={16} className="text-primary-400" />
            {cave.spiritDensity}
          </span>
        </div>
      </div>

      <Card className="bg-surface-900/80 backdrop-blur-sm border-surface-700/50">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-secondary-500/10 rounded-xl text-secondary-400 border border-secondary-500/20">
            <ArrowUpCircle size={24} />
          </div>
          <h3 className="font-bold text-xl text-content-100">洞府升级</h3>
        </div>

        {nextLevelConfig ? (
          <>
            <div className="flex justify-between items-center mb-8 text-sm bg-surface-950/50 p-6 rounded-2xl border border-surface-800 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-surface-800/30 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

              <div className="space-y-4 relative z-10">
                <div className="text-content-400 flex items-center gap-2">
                  <span className="w-20">当前等级</span>
                  <span className="text-content-100 text-lg font-bold font-mono bg-surface-800 px-2 py-0.5 rounded">{cave.level}</span>
                </div>
                <div className="text-content-400 flex items-center gap-2">
                  <span className="w-20">当前容量</span>
                  <span className="text-content-100 text-lg font-bold font-mono bg-surface-800 px-2 py-0.5 rounded">{stats.storageCapacity}</span>
                </div>
              </div>

              <div className="text-3xl text-secondary-400 animate-pulse px-4">➜</div>

              <div className="space-y-4 text-right relative z-10">
                <div className="text-primary-400 font-bold text-lg font-mono bg-primary-900/20 px-3 py-0.5 rounded border border-primary-500/20">
                  {nextLevel}
                </div>
                <div className="text-primary-400 font-bold text-lg font-mono bg-primary-900/20 px-3 py-0.5 rounded border border-primary-500/20">
                  {stats.storageCapacity + CAVE_CONFIG.capacityPerLevel}
                </div>
              </div>
            </div>

            <div className="bg-surface-950/30 p-6 rounded-2xl mb-6 border border-surface-800">
              <div className="text-xs text-content-400 mb-4 uppercase tracking-wider font-bold flex items-center gap-2">
                <Hammer size={14} className="text-secondary-400" />
                装修所需材料
              </div>
              <div className="space-y-3">
                <CostItem name="灵石" current={player.spiritStones} cost={upgradeCost.spiritStones} icon="💎" />
                {Object.entries(upgradeCost.materials).map(([matId, cost]) => (
                  <CostItem key={matId} name={matId} current={0} cost={cost} icon={'📦'} />
                ))}
              </div>
            </div>

            <Button
              onClick={() => upgrade.mutate()}
              variant="secondary"
              size="lg"
              className="w-full h-14 text-lg font-bold shadow-lg shadow-secondary-500/20 hover:shadow-secondary-500/40 transition-all"
              icon={<Hammer size={20} />}
              loading={upgrade.isPending}
            >
              开始装修工程
            </Button>
          </>
        ) : (
          <div className="text-center py-16 text-content-400 bg-surface-950/30 rounded-2xl border border-dashed border-surface-700">
            <div className="w-20 h-20 bg-surface-900 rounded-full flex items-center justify-center mx-auto mb-6 border border-surface-700">
              <Home size={40} className="text-primary-400 opacity-80" />
            </div>
            <p className="text-xl font-bold text-content-200 mb-2">已达到目前装修风格的极致</p>
            <p className="text-sm opacity-60 font-serif">“可谓是五星级工位，摸鱼圣地”</p>
          </div>
        )}
      </Card>
    </div>
  );
};

const CostItem = ({ name, current, cost, icon }: { name: string, current: number, cost: number, icon: string }) => {
  const canAfford = current >= cost;
  return (
    <div className="flex justify-between items-center text-sm p-3 rounded-xl bg-surface-900 border border-surface-800 hover:border-surface-600 transition-colors group">
      <div className="flex items-center gap-3 text-content-200">
        <span className="text-xl filter grayscale group-hover:grayscale-0 transition-all">{icon}</span>
        <span className="font-medium">{name}</span>
      </div>
      <div className={clsx(
        "font-mono font-bold px-2 py-1 rounded-lg text-xs",
        canAfford ? "bg-primary-900/20 text-primary-400 border border-primary-500/20" : "bg-danger-900/20 text-danger-400 border border-danger-500/20"
      )}>
        {current} <span className="text-content-500 mx-1">/</span> {cost}
      </div>
    </div>
  );
};