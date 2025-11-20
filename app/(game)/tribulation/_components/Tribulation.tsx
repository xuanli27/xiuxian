'use client'

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button, Card } from '@/components/ui';
import { getTribulationDashboardData, startTribulation } from '@/features/tribulation/actions';
import type { Player } from '@/types/enums';
import { toast } from 'sonner';
import { Zap, Skull, Heart, Activity, Wind, Scroll, AlertTriangle, CheckCircle2 } from 'lucide-react';
import clsx from 'clsx';

interface Props {
  player: Player;
}

export const Tribulation: React.FC<Props> = ({ player }) => {
  const queryClient = useQueryClient();
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationLogs, setAnimationLogs] = useState<string[]>([]);
  const [currentWave, setCurrentWave] = useState(0);
  const [maxWaves, setMaxWaves] = useState(9);
  const [currentHealth, setCurrentHealth] = useState(100);

  const { data: dashboard, isLoading } = useQuery({
    queryKey: ['tribulation-dashboard', player.id],
    queryFn: () => getTribulationDashboardData(),
  });

  const start = useMutation({
    mutationFn: () => startTribulation({ playerId: player.id }),
    onSuccess: async (result) => {
      // Start animation sequence
      setIsAnimating(true);
      setAnimationLogs([]);
      setCurrentWave(0);
      setMaxWaves(result.totalWaves);
      setCurrentHealth(100);

      // Simulate waves
      const waveDelay = 800;
      const totalWaves = result.totalWaves;
      const wavesCompleted = result.wavesCompleted;

      for (let i = 1; i <= totalWaves; i++) {
        await new Promise(resolve => setTimeout(resolve, waveDelay));
        setCurrentWave(i);

        const isSuccessWave = i <= wavesCompleted;

        if (isSuccessWave) {
          setAnimationLogs(prev => [...prev, `第 ${i} 道天雷落下... 你成功抵挡了伤害！`]);
          setCurrentHealth(h => Math.max(h - 5, 10)); // Small chip damage
        } else {
          setAnimationLogs(prev => [...prev, `第 ${i} 道天雷落下... 护体灵光破碎！`]);
          setCurrentHealth(0);
          break; // Stop at failure
        }
      }

      await new Promise(resolve => setTimeout(resolve, 1000));

      if (result.success) {
        toast.success(result.message, {
          description: '恭喜道友境界提升，寿元大增！',
          icon: '🎉'
        });
      } else {
        toast.error(result.message, {
          description: '道友根基不稳，请修养生息后再来。',
          icon: '💀'
        });
      }

      setIsAnimating(false);
      queryClient.invalidateQueries({ queryKey: ['tribulation-dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['player'] });
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });

  if (isLoading || !dashboard) {
    return <div className="p-8 text-center text-content-400">加载天机中...</div>;
  }

  const { needsTribulation, preparation, history } = dashboard;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex items-center gap-3 mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
        <div className="p-3 bg-danger-900/30 rounded-2xl border border-danger-500/30 text-danger-400">
          <Zap size={28} className={clsx(isAnimating && "animate-pulse")} />
        </div>
        <div>
          <h1 className="text-3xl font-bold font-xianxia text-transparent bg-clip-text bg-gradient-to-r from-danger-400 to-primary-500">
            职场天劫
          </h1>
          <p className="text-content-400 text-sm mt-1">逆天而行，必受天谴（KPI考核）</p>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {/* 状态面板 */}
        <div className="space-y-6">
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-br from-danger-500 to-primary-600 rounded-2xl opacity-30 group-hover:opacity-50 transition duration-500 blur"></div>
            <Card className="relative bg-surface-900 border-surface-700 shadow-2xl p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-content-200 flex items-center gap-2">
                  <Activity size={20} className="text-primary-400" />
                  当前状态
                </h2>
                <span className={clsx(
                  "px-3 py-1 rounded-full text-xs font-bold border",
                  isAnimating ? "bg-danger-500/20 text-danger-400 border-danger-500/30 animate-pulse" :
                    needsTribulation ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" :
                      "bg-green-500/20 text-green-400 border-green-500/30"
                )}>
                  {isAnimating ? '渡劫中' : needsTribulation ? '瓶颈期' : '修炼中'}
                </span>
              </div>

              {isAnimating ? (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-content-400 flex items-center gap-1"><Heart size={14} /> 状态</span>
                      <span className="text-danger-400 font-bold">{currentHealth}%</span>
                    </div>
                    <div className="h-3 bg-surface-950 rounded-full overflow-hidden border border-surface-800">
                      <div
                        className="h-full bg-gradient-to-r from-danger-600 to-danger-400 transition-all duration-300"
                        style={{ width: `${currentHealth}%` }}
                      />
                    </div>
                  </div>

                  <div className="text-center py-8">
                    <Zap size={48} className="mx-auto text-danger-400 animate-bounce mb-4" />
                    <p className="text-xl font-bold text-content-100">
                      正在承受第 <span className="text-danger-400 text-2xl">{currentWave}</span> / {maxWaves} 道天雷
                    </p>
                  </div>
                </div>
              ) : needsTribulation ? (
                <div className="space-y-6">
                  <div className="bg-surface-950/50 p-4 rounded-xl border border-surface-800">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-content-400 text-sm">成功率预估</span>
                      <span className={clsx(
                        "font-bold text-lg",
                        preparation.successChance > 0.7 ? "text-green-400" :
                          preparation.successChance > 0.4 ? "text-yellow-400" : "text-danger-400"
                      )}>
                        {(preparation.successChance * 100).toFixed(0)}%
                      </span>
                    </div>
                    <div className="h-2 bg-surface-900 rounded-full overflow-hidden">
                      <div
                        className={clsx("h-full transition-all",
                          preparation.successChance > 0.7 ? "bg-green-500" :
                            preparation.successChance > 0.4 ? "bg-yellow-500" : "bg-danger-500"
                        )}
                        style={{ width: `${preparation.successChance * 100}%` }}
                      />
                    </div>
                  </div>

                  {preparation.risks.length > 0 && (
                    <div className="bg-danger-900/20 p-4 rounded-xl border border-danger-500/20">
                      <h3 className="text-danger-400 font-bold text-sm mb-2 flex items-center gap-2">
                        <AlertTriangle size={14} /> 风险提示
                      </h3>
                      <ul className="list-disc list-inside text-xs text-content-400 space-y-1">
                        {preparation.risks.map((risk, i) => (
                          <li key={i}>{risk}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <Button
                    className="w-full py-6 text-lg font-bold shadow-[0_0_20px_rgba(220,38,38,0.3)] hover:shadow-[0_0_30px_rgba(220,38,38,0.5)] transition-all"
                    variant="danger"
                    onClick={() => start.mutate()}
                    loading={start.isPending}
                    icon={<Zap size={24} />}
                  >
                    引动天劫
                  </Button>
                </div>
              ) : (
                <div className="text-center py-10 space-y-4">
                  <div className="w-20 h-20 bg-surface-800 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-surface-700">
                    <Wind size={40} className="text-content-400" />
                  </div>
                  <p className="text-content-400">当前修为稳固，暂无天劫降临。</p>
                  <p className="text-xs text-content-500">（当修为达到瓶颈时可触发）</p>
                </div>
              )}
            </Card>
          </div>
        </div>

        {/* 历史记录 / 战斗日志 */}
        <div className="bg-surface-900/80 border border-surface-700 rounded-2xl p-6 h-[500px] flex flex-col shadow-xl">
          <h2 className="text-xl font-bold text-content-200 mb-4 flex items-center gap-2">
            <Scroll size={20} className="text-secondary-400" />
            {isAnimating ? '天劫实况' : '渡劫记录'}
          </h2>
          <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
            {isAnimating ? (
              animationLogs.map((log, index) => (
                <div key={index} className="text-sm p-3 rounded-lg bg-surface-950/50 border border-surface-800 animate-in fade-in slide-in-from-left-2">
                  <span className="text-danger-400 font-mono mr-2">[{index + 1}]</span>
                  {log}
                </div>
              ))
            ) : history.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-content-500 opacity-50">
                <p>暂无记录</p>
              </div>
            ) : (
              history.map((record) => (
                <div key={record.id} className="text-sm p-3 rounded-lg bg-surface-950/50 border border-surface-800 flex justify-between items-center">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={clsx(
                        "font-bold",
                        record.success ? "text-green-400" : "text-danger-400"
                      )}>
                        {record.success ? "渡劫成功" : "渡劫失败"}
                      </span>
                      <span className="text-xs text-content-500">
                        {new Date(record.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="text-xs text-content-400">
                      坚持了 {record.wavesCompleted} / {record.totalWaves} 轮
                    </div>
                  </div>
                  {record.success ? (
                    <CheckCircle2 size={18} className="text-green-500/50" />
                  ) : (
                    <Skull size={18} className="text-danger-500/50" />
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};