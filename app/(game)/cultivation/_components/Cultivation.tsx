'use client'

import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui';
import { getPlayerByUserId } from '@/features/player/queries';
import { getPlayerRealmInfo, getCultivationStats } from '@/features/cultivation/queries';
import { startMeditation, attemptBreakthrough } from '@/features/cultivation/actions';
import type { Player } from '@prisma/client';
import type { RealmInfo } from '@/features/cultivation/types';

interface CultivationStats {
  totalSessions: number;
  totalExpGained: number;
  totalBreakthroughs: number;
  successRate: number;
}

interface Props {
  initialPlayer: Player;
  initialRealmInfo: RealmInfo | null;
  initialStats: CultivationStats;
}

export const Cultivation: React.FC<Props> = ({ initialPlayer, initialRealmInfo, initialStats }) => {
  const queryClient = useQueryClient();

  const { data: player } = useQuery({
    queryKey: ['player', initialPlayer.id],
    queryFn: () => getPlayerByUserId(initialPlayer.userId),
    initialData: initialPlayer,
  });

  const { data: realmInfo } = useQuery({
    queryKey: ['realmInfo', initialPlayer.id],
    queryFn: () => getPlayerRealmInfo(initialPlayer.id),
    initialData: initialRealmInfo,
  });

  const { data: stats } = useQuery({
    queryKey: ['cultivationStats', initialPlayer.id],
    queryFn: () => getCultivationStats(initialPlayer.id),
    initialData: initialStats,
  });

  const meditation = useMutation({
    mutationFn: () => startMeditation({ duration: 10 }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['player', player?.id] });
      queryClient.invalidateQueries({ queryKey: ['realmInfo', player?.id] });
      queryClient.invalidateQueries({ queryKey: ['cultivationStats', player?.id] });
    },
  });

  const breakthrough = useMutation({
    mutationFn: () => attemptBreakthrough({ playerId: initialPlayer.id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['player', player?.id] });
      queryClient.invalidateQueries({ queryKey: ['realmInfo', player?.id] });
      queryClient.invalidateQueries({ queryKey: ['cultivationStats', player?.id] });
    },
  });
  
  const canBreakthrough = player && player.qi >= player.maxQi;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">修炼场</h1>
      
      <div className="grid gap-6 md:grid-cols-2">
        {/* 境界信息 */}
        <div className="bg-surface-800 p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-4">当前境界</h2>
          {realmInfo && (
            <div>
              <p className="text-2xl font-bold text-primary-400">{realmInfo.name}</p>
              <div className="mt-4">
                <div className="flex justify-between text-sm mb-2">
                  <span>修为进度</span>
                  <span>{Math.floor(player?.qi ?? 0)} / {player?.maxQi}</span>
                </div>
                <div className="w-full bg-surface-900 rounded-full h-2">
                  <div 
                    className="bg-primary-500 h-2 rounded-full transition-all"
                    style={{ width: `${((player?.qi ?? 0) / (player?.maxQi ?? 1)) * 100}%` }}
                  />
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm text-content-400">突破成功率: {(realmInfo.breakthroughChance * 100).toFixed(1)}%</p>
              </div>
            </div>
          )}
        </div>

        {/* 修炼统计 */}
        <div className="bg-surface-800 p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-4">修炼统计</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-content-400">总修炼次数</span>
              <span className="font-bold">{stats?.totalSessions}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-content-400">总获得灵气</span>
              <span className="font-bold">{stats?.totalExpGained}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-content-400">突破次数</span>
              <span className="font-bold">{stats?.totalBreakthroughs}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-content-400">成功率</span>
              <span className="font-bold">{(stats?.successRate ?? 0 * 100).toFixed(1)}%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <Button
          size="lg"
          onClick={() => meditation.mutate()}
          loading={meditation.isPending}
        >
          开始闭关
        </Button>
        <Button
          size="lg"
          variant="danger"
          disabled={!canBreakthrough}
          onClick={() => breakthrough.mutate()}
          loading={breakthrough.isPending}
        >
          {canBreakthrough ? '尝试突破' : '灵气不足'}
        </Button>
      </div>
    </div>
  );
};