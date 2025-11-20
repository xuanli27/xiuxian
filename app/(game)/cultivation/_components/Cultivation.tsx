'use client'

import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui';
import { getCurrentPlayer } from '@/features/player/actions';
import { getCurrentPlayerRealmInfo, getCurrentCultivationStats } from '@/features/cultivation/actions';
import { startMeditation, attemptBreakthrough } from '@/features/cultivation/actions';
import type { Player } from '@/types/database';
import type { RealmInfo } from '@/features/cultivation/types';
import { toast } from 'sonner';
import { Sparkles, Zap, Activity, Hourglass } from 'lucide-react';

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
    queryKey: ['player'],
    queryFn: () => getCurrentPlayer(),
    initialData: initialPlayer,
  });

  const { data: realmInfo } = useQuery({
    queryKey: ['realm-info'],
    queryFn: () => getCurrentPlayerRealmInfo(),
    initialData: initialRealmInfo,
  });

  const { data: stats } = useQuery({
    queryKey: ['cultivation-stats'],
    queryFn: () => getCurrentCultivationStats(),
    initialData: initialStats,
  });

  const meditation = useMutation({
    mutationFn: () => startMeditation({ duration: 10 }),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['player'] });
      queryClient.invalidateQueries({ queryKey: ['realm-info'] });
      queryClient.invalidateQueries({ queryKey: ['cultivation-stats'] });
      toast.success(`闭关结束，获得 ${result.expGained} 点灵气`, {
        icon: '🧘',
        description: result.message || '心如止水，修为精进。'
      });
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });

  const breakthrough = useMutation({
    mutationFn: () => attemptBreakthrough({ playerId: initialPlayer.id }),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['player'] });
      queryClient.invalidateQueries({ queryKey: ['realm-info'] });
      queryClient.invalidateQueries({ queryKey: ['cultivation-stats'] });
      if (result.success) {
        toast.success('突破成功！', {
          description: `恭喜道友晋升至 ${result.realmAfter}！`,
          duration: 5000,
          icon: '⚡'
        });
      } else {
        toast.error('突破失败', {
          description: result.message
        });
      }
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });

  const canBreakthrough = player && player.qi >= player.max_qi;
  const progress = player ? (player.qi / player.max_qi) * 100 : 0;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex items-center gap-3 mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
        <div className="p-3 bg-primary-900/30 rounded-2xl border border-primary-500/30 text-primary-400">
          <Sparkles size={28} className="animate-pulse" />
        </div>
        <div>
          <h1 className="text-3xl font-bold font-xianxia text-transparent bg-clip-text bg-gradient-to-r from-primary-300 to-primary-500">
            洞天福地
          </h1>
          <p className="text-content-400 text-sm mt-1">纳天地灵气，养浩然正气</p>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {/* 境界卡片 */}
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-500 to-secondary-600 rounded-2xl opacity-30 group-hover:opacity-70 transition duration-500 blur"></div>
          <div className="relative bg-surface-900 p-8 rounded-2xl border border-surface-700 shadow-2xl h-full flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-lg text-content-400 font-serif">当前境界</h2>
                  <p className="text-4xl font-bold text-primary-400 mt-2 font-xianxia tracking-wider">
                    {realmInfo?.name || '凡人'}
                  </p>
                </div>
                <div className="bg-surface-800 p-2 rounded-lg border border-surface-700">
                  <Zap className="text-primary-400" size={24} />
                </div>
              </div>

              <div className="space-y-2 mb-6">
                <div className="flex justify-between text-sm font-medium">
                  <span className="text-content-400">修为进度</span>
                  <span className="text-primary-300">{Math.floor(player?.qi ?? 0)} / {player?.max_qi}</span>
                </div>
                <div className="h-4 bg-surface-950 rounded-full overflow-hidden border border-surface-800 relative">
                  <div
                    className="h-full bg-gradient-to-r from-primary-600 to-primary-400 transition-all duration-1000 ease-out relative overflow-hidden"
                    style={{ width: `${Math.min(progress, 100)}%` }}
                  >
                    <div className="absolute inset-0 bg-white/20 animate-[shimmer_2s_infinite]"></div>
                  </div>
                </div>
                <p className="text-xs text-right text-content-500 mt-1">
                  {progress >= 100 ? '瓶颈已至，需寻找机缘突破' : '道阻且长，行则将至'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <Button
                size="lg"
                onClick={() => meditation.mutate()}
                loading={meditation.isPending}
                className="w-full bg-surface-800 hover:bg-surface-700 border border-primary-500/30 text-primary-300 hover:text-primary-200"
              >
                <span className="flex items-center gap-2">
                  <Hourglass size={18} /> 闭关打坐
                </span>
              </Button>
              <Button
                size="lg"
                variant="primary"
                disabled={!canBreakthrough}
                onClick={() => breakthrough.mutate()}
                loading={breakthrough.isPending}
                className={canBreakthrough ? "animate-pulse shadow-[0_0_15px_rgba(245,158,11,0.5)]" : ""}
              >
                <span className="flex items-center gap-2">
                  <Zap size={18} /> 尝试突破
                </span>
              </Button>
            </div>
          </div>
        </div>

        {/* 统计卡片 */}
        <div className="bg-surface-800/50 p-8 rounded-2xl border border-surface-700/50 backdrop-blur-sm flex flex-col">
          <div className="flex items-center gap-3 mb-6">
            <Activity className="text-secondary-400" size={24} />
            <h2 className="text-xl font-bold text-content-200">修炼记录</h2>
          </div>

          <div className="grid grid-cols-2 gap-4 flex-1 content-start">
            <div className="bg-surface-900/80 p-4 rounded-xl border border-surface-700/50 hover:border-primary-500/30 transition-colors">
              <p className="text-content-400 text-xs mb-1">总修炼次数</p>
              <p className="text-2xl font-bold text-content-100">{stats?.totalSessions}</p>
            </div>
            <div className="bg-surface-900/80 p-4 rounded-xl border border-surface-700/50 hover:border-primary-500/30 transition-colors">
              <p className="text-content-400 text-xs mb-1">累计灵气</p>
              <p className="text-2xl font-bold text-primary-400">{stats?.totalExpGained}</p>
            </div>
            <div className="bg-surface-900/80 p-4 rounded-xl border border-surface-700/50 hover:border-primary-500/30 transition-colors">
              <p className="text-content-400 text-xs mb-1">突破次数</p>
              <p className="text-2xl font-bold text-content-100">{stats?.totalBreakthroughs}</p>
            </div>
            <div className="bg-surface-900/80 p-4 rounded-xl border border-surface-700/50 hover:border-primary-500/30 transition-colors">
              <p className="text-content-400 text-xs mb-1">突破成功率</p>
              <p className="text-2xl font-bold text-secondary-400">{(stats?.successRate ?? 0 * 100).toFixed(1)}%</p>
            </div>
          </div>

          <div className="mt-6 p-4 bg-surface-900/30 rounded-xl border border-surface-700/30 text-sm text-content-400 italic">
            &quot;修仙无岁月，一晃已千年。道友今日勤勉，他日必成大器。&quot;
          </div>
        </div>
      </div>
    </div>
  );
};