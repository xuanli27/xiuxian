'use client'

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowUpCircle, Hammer, Home, Sparkles, Box, Leaf, Mountain, Droplets, Wind, TrendingUp, Package } from 'lucide-react';
import { Button, Card } from '@/components/ui';
import clsx from 'clsx';
import { getPlayerCave, getCaveStats, upgradeCave } from '@/features/cave/actions';
import { CAVE_CONFIG } from '@/config/game';
import { calculateCaveUpgradeCost } from '@/features/cave/utils';
import type { Player } from '@/types/database';
import type { Cave } from '@/features/cave/types';

interface Props {
  initialCave: Cave
  player: Player
}

export const CaveManager: React.FC<Props> = ({ initialCave, player }) => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'overview' | 'upgrade' | 'resources'>('overview');

  const { data: cave } = useQuery({
    queryKey: ['cave', player.id],
    queryFn: () => getPlayerCave(),
    initialData: initialCave,
  });

  const { data: stats } = useQuery({
    queryKey: ['caveStats', player.id],
    queryFn: () => getCaveStats(),
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
    <div className="container mx-auto px-4 py-8 max-w-7xl animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* 洞府头部横幅 */}
      <div className="relative h-80 bg-gradient-to-br from-emerald-950 via-surface-900 to-blue-950 rounded-3xl border border-surface-700 mb-8 overflow-hidden group shadow-2xl">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-30" />
        
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3 animate-pulse" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl -translate-x-1/3 translate-y-1/3" />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 animate-pulse" style={{ animationDelay: '1s' }} />

        {/* 装饰性山峰 */}
        <div className="absolute bottom-0 left-0 right-0 h-32 opacity-20">
          <Mountain className="absolute bottom-0 left-1/4 text-emerald-400" size={120} />
          <Mountain className="absolute bottom-0 right-1/3 text-blue-400" size={100} />
        </div>

        <div className="absolute inset-0 flex items-center justify-center opacity-10 text-[16rem] select-none">
          🏔️
        </div>

        <div className="absolute bottom-8 left-8 z-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-primary-900/40 backdrop-blur-sm rounded-2xl border border-primary-500/30">
              <Home size={32} className="text-primary-300" />
            </div>
            <div>
              <h2 className="text-4xl font-bold font-xianxia text-transparent bg-clip-text bg-gradient-to-r from-emerald-200 via-primary-100 to-blue-200 drop-shadow-lg">
                {cave.name}
              </h2>
              <p className="text-content-400 text-sm font-serif italic mt-1">"斯是陋室，惟吾德馨"</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="px-4 py-2 bg-primary-900/40 border border-primary-500/30 rounded-full text-primary-300 text-sm font-bold backdrop-blur-sm shadow-lg">
              等级 {cave.level}
            </span>
            <span className="px-4 py-2 bg-emerald-900/40 border border-emerald-500/30 rounded-full text-emerald-300 text-sm font-bold backdrop-blur-sm shadow-lg flex items-center gap-2">
              <Sparkles size={14} />
              灵气 {cave.spiritDensity}
            </span>
          </div>
        </div>

        <div className="absolute top-6 right-6 z-10 flex gap-3">
          <StatCard icon={<TrendingUp size={16} />} label="产出" value={`${stats.productionRate}/时`} color="text-emerald-400" />
          <StatCard icon={<Package size={16} />} label="容量" value={stats.storageCapacity} color="text-blue-400" />
        </div>
      </div>

      {/* 标签页导航 */}
      <div className="flex gap-2 mb-6">
        <TabButton active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} icon={<Home size={18} />}>
          总览
        </TabButton>
        <TabButton active={activeTab === 'resources'} onClick={() => setActiveTab('resources')} icon={<Box size={18} />}>
          资源仓库
        </TabButton>
        <TabButton active={activeTab === 'upgrade'} onClick={() => setActiveTab('upgrade')} icon={<ArrowUpCircle size={18} />}>
          洞府升级
        </TabButton>
      </div>

      {/* 总览标签 */}
      {activeTab === 'overview' && (
        <>
          {/* 统计信息卡片 */}
          <div className="grid md:grid-cols-4 gap-4 mb-6">
            <Card className="bg-gradient-to-br from-blue-900/20 to-cyan-900/20 border-blue-500/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-content-400 mb-1">建筑数量</p>
                  <p className="text-2xl font-bold text-blue-400">{stats.totalBuildings}</p>
                </div>
                <Home className="text-blue-400 opacity-50" size={32} />
              </div>
            </Card>
            <Card className="bg-gradient-to-br from-green-900/20 to-emerald-900/20 border-green-500/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-content-400 mb-1">运行中</p>
                  <p className="text-2xl font-bold text-green-400">{stats.activeBuildings}</p>
                </div>
                <TrendingUp className="text-green-400 opacity-50" size={32} />
              </div>
            </Card>
            <Card className="bg-gradient-to-br from-purple-900/20 to-violet-900/20 border-purple-500/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-content-400 mb-1">防御力</p>
                  <p className="text-2xl font-bold text-purple-400">{stats.defensePower}</p>
                </div>
                <Wind className="text-purple-400 opacity-50" size={32} />
              </div>
            </Card>
            <Card className="bg-gradient-to-br from-amber-900/20 to-yellow-900/20 border-amber-500/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-content-400 mb-1">产出速率</p>
                  <p className="text-2xl font-bold text-amber-400">{stats.productionRate}/时</p>
                </div>
                <Sparkles className="text-amber-400 opacity-50" size={32} />
              </div>
            </Card>
          </div>

          {/* 资源卡片 */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ResourceCard
              icon={<Leaf className="text-green-400" size={24} />}
              title="灵草"
              amount={cave.resources.herbs}
              color="from-green-900/20 to-emerald-900/20"
              borderColor="border-green-500/20"
            />
            <ResourceCard
              icon={<Mountain className="text-gray-400" size={24} />}
              title="矿石"
              amount={cave.resources.ores}
              color="from-gray-900/20 to-slate-900/20"
              borderColor="border-gray-500/20"
            />
            <ResourceCard
              icon={<Sparkles className="text-amber-400" size={24} />}
              title="灵气"
              amount={cave.resources.spiritualEnergy}
              color="from-amber-900/20 to-yellow-900/20"
              borderColor="border-amber-500/20"
            />
            <ResourceCard
              icon={<Droplets className="text-blue-400" size={24} />}
              title="丹药"
              amount={cave.resources.pills}
              color="from-blue-900/20 to-cyan-900/20"
              borderColor="border-blue-500/20"
            />
            <ResourceCard
              icon={<Wind className="text-purple-400" size={24} />}
              title="法器"
              amount={cave.resources.artifacts}
              color="from-purple-900/20 to-violet-900/20"
              borderColor="border-purple-500/20"
            />
            <Card className="bg-gradient-to-br from-primary-900/20 to-secondary-900/20 border-primary-500/20">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-primary-500/10 rounded-xl">
                  <TrendingUp className="text-primary-400" size={24} />
                </div>
                <h3 className="font-bold text-content-100">每日收益</h3>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-content-300">
                  <span>灵气</span>
                  <span className="text-primary-400 font-bold">+{Math.floor(stats.dailyIncome.spiritualEnergy)}</span>
                </div>
                <div className="flex justify-between text-content-300">
                  <span>灵草</span>
                  <span className="text-green-400 font-bold">+{stats.dailyIncome.herbs}</span>
                </div>
                <div className="flex justify-between text-content-300">
                  <span>矿石</span>
                  <span className="text-gray-400 font-bold">+{stats.dailyIncome.ores}</span>
                </div>
              </div>
            </Card>
          </div>
        </>
      )}

      {/* 资源仓库标签 */}
      {activeTab === 'resources' && (
        <Card className="bg-surface-900/80 backdrop-blur-sm border-surface-700/50">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-500/10 rounded-xl text-blue-400 border border-blue-500/20">
              <Box size={24} />
            </div>
            <h3 className="font-bold text-xl text-content-100">资源仓库</h3>
            <span className="ml-auto text-sm text-content-400">
              容量: <span className="text-primary-400 font-bold">{stats.storageCapacity}</span>
            </span>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <StorageItem name="灵草" amount={cave.resources.herbs} icon="🌿" />
            <StorageItem name="矿石" amount={cave.resources.ores} icon="⛰️" />
            <StorageItem name="灵气" amount={cave.resources.spiritualEnergy} icon="✨" />
            <StorageItem name="丹药" amount={cave.resources.pills} icon="💊" />
            <StorageItem name="法器" amount={cave.resources.artifacts} icon="🗡️" />
          </div>
        </Card>
      )}

      {/* 升级标签 */}
      {activeTab === 'upgrade' && (
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
                <CostItem name="灵石" current={player.spirit_stones} cost={upgradeCost.spiritStones} icon="💎" />
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
      )}
    </div>
  );
};

const TabButton = ({ active, onClick, icon, children }: { active: boolean, onClick: () => void, icon: React.ReactNode, children: React.ReactNode }) => (
  <button
    onClick={onClick}
    className={clsx(
      "px-6 py-3 rounded-xl font-bold text-sm transition-all flex items-center gap-2",
      active
        ? "bg-primary-600 text-white shadow-lg shadow-primary-500/20"
        : "bg-surface-800 text-content-400 hover:bg-surface-700 border border-surface-700"
    )}
  >
    {icon}
    {children}
  </button>
);

const StatCard = ({ icon, label, value, color }: { icon: React.ReactNode, label: string, value: string | number, color: string }) => (
  <div className="bg-surface-950/60 backdrop-blur-md px-4 py-3 rounded-2xl border border-surface-700/50 shadow-lg">
    <div className="flex items-center gap-2 mb-1">
      <span className={color}>{icon}</span>
      <span className="text-[10px] text-content-400 uppercase tracking-wider font-bold">{label}</span>
    </div>
    <div className={clsx("text-xl font-bold font-mono", color)}>{value}</div>
  </div>
);

const ResourceCard = ({ icon, title, amount, color, borderColor }: { icon: React.ReactNode, title: string, amount: number, color: string, borderColor: string }) => (
  <Card className={clsx("bg-gradient-to-br border", color, borderColor)}>
    <div className="flex items-center justify-between mb-4">
      <div className="p-3 bg-surface-900/50 rounded-xl border border-surface-700/50">
        {icon}
      </div>
      <div className="text-right">
        <div className="text-3xl font-bold text-content-100 font-mono">{amount}</div>
        <div className="text-xs text-content-400 uppercase tracking-wider">{title}</div>
      </div>
    </div>
  </Card>
);

const StorageItem = ({ name, amount, icon }: { name: string, amount: number, icon: string }) => (
  <div className="flex items-center justify-between p-4 rounded-xl bg-surface-950/50 border border-surface-800 hover:border-surface-600 transition-colors group">
    <div className="flex items-center gap-3">
      <span className="text-3xl filter grayscale group-hover:grayscale-0 transition-all">{icon}</span>
      <span className="font-medium text-content-200">{name}</span>
    </div>
    <div className="text-2xl font-bold font-mono text-primary-400">{amount}</div>
  </div>
);

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