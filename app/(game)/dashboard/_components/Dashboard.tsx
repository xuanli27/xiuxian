'use client'

import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { Zap, Database, ShieldAlert, Coins } from 'lucide-react'
import { Button } from '@/components/ui'
import { SpiritSeaCore } from './SpiritSeaCore'
import { SecondaryPortals } from './SecondaryPortals'
import clsx from 'clsx'
import { usePlayer } from '@/hooks/use-player'
import { getCurrentPlayerRealmInfo } from '@/features/cultivation/queries'
import { REALM_CONFIG } from '@/config/game'

export const Dashboard: React.FC = () => {
  // 使用新的 usePlayer hook 获取玩家数据和操作
  const { 
    player, 
    isLoading: isPlayerLoading, 
    meditate, 
    isMeditating,
    breakthrough,
    isBreakingThrough 
  } = usePlayer()

  // 获取境界信息
  const { data: realmInfo, isLoading: isRealmLoading } = useQuery({
    queryKey: ['realm-info'],
    queryFn: () => getCurrentPlayerRealmInfo(),
    enabled: !!player, // 只有在玩家数据加载后才获取境界信息
  })

  // 加载状态
  if (isPlayerLoading || isRealmLoading || !player || !realmInfo) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-amber-200 text-xl">加载中...</div>
      </div>
    )
  }

  // 计算突破相关数据
  const canBreakthrough = player.qi >= player.maxQi * 0.8
  const progress = Math.min(100, (player.qi / player.maxQi) * 100)
  const displayRank = `${realmInfo.name} ${player.level}级`

  return (
    <div className="relative min-h-screen -m-8 -mb-28">
      {/* 识海背景核心 */}
      <SpiritSeaCore 
        onMeditate={() => meditate({ duration: 10 })}
        canBreakthrough={canBreakthrough}
      />

      {/* 悬浮UI层 */}
      <div className="relative z-10 pointer-events-none">
        {/* 左上角：玩家信息 */}
        <div className="absolute top-8 left-8 pointer-events-auto">
          <div className="bg-slate-900/80 backdrop-blur-md border border-indigo-500/30 rounded-2xl p-4 shadow-2xl">
            <h2 className="text-xl font-bold text-amber-200 mb-1">
              {player.name}
            </h2>
            <p className="text-sm text-slate-400">仙欲宗 · 内门弟子</p>
          </div>
        </div>

        {/* 右上角：核心状态 */}
        <div className="absolute top-8 right-8 flex flex-col gap-3 pointer-events-auto">
          <StatCard 
            icon={<Database size={16} />} 
            label="境界" 
            value={displayRank} 
            color="bg-blue-500/20 text-blue-400 border-blue-500/30" 
          />
          <StatCard 
            icon={<ShieldAlert size={16} />} 
            label="心魔" 
            value={`${Math.floor(player.innerDemon)}%`} 
            color={player.innerDemon > 80 
              ? "bg-red-500/20 text-red-500 border-red-500/30 animate-pulse" 
              : "bg-orange-500/20 text-orange-400 border-orange-500/30"
            } 
          />
          <StatCard 
            icon={<Coins size={16} />} 
            label="灵石" 
            value={player.spiritStones} 
            color="bg-amber-500/20 text-amber-400 border-amber-500/30" 
          />
        </div>

        {/* 底部：次级入口 */}
        <div className="absolute bottom-32 left-1/2 -translate-x-1/2 pointer-events-auto">
          <SecondaryPortals
            player={player}
            canTribulation={canBreakthrough}
          />
        </div>

        {/* 右侧：渡劫面板 */}
        <div className="absolute top-1/2 right-8 -translate-y-1/2 w-80 pointer-events-auto">
          <div className="bg-slate-900/80 backdrop-blur-md border border-indigo-500/30 rounded-2xl p-6 shadow-2xl">
            <div className="mb-6">
              <div className="flex justify-between mb-3 items-end">
                <span className="text-amber-200 text-lg font-bold">{realmInfo.name}考核</span>
                <span className="text-amber-400 font-mono text-xl">{progress.toFixed(1)}%</span>
              </div>
              
              <div className="h-4 bg-slate-950 rounded-full overflow-hidden border border-amber-500/20 relative">
                <div
                  className="h-full bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-400 rounded-full relative overflow-hidden transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(251,191,36,0.5)]"
                  style={{ width: `${progress}%` }}
                >
                  <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.3)_50%,transparent_75%)] bg-[size:20px_20px] animate-[shimmer_1s_infinite_linear]" />
                </div>
              </div>
              
              <div className="flex justify-between mt-2 text-xs text-slate-400 font-mono">
                <span>0</span>
                <span>{Math.floor(player.qi)} / {player.maxQi}</span>
              </div>
            </div>
            
            <Button
              size="lg"
              disabled={!canBreakthrough || isBreakingThrough}
              onClick={() => breakthrough()}
              variant={'danger'}
              className={clsx(
                "w-full h-14 text-base relative overflow-hidden bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500", 
                canBreakthrough && "animate-pulse shadow-lg shadow-red-500/50"
              )}
              icon={<Zap size={20} />}
            >
              {isBreakingThrough 
                ? "渡劫中..." 
                : canBreakthrough
                  ? `渡劫 (晋升${REALM_CONFIG.names[realmInfo.rank]})`
                  : "闭关积累中"
              }
            </Button>
            
            {player.innerDemon > 50 && (
              <div className="mt-4 bg-red-900/20 border border-red-500/30 p-3 rounded-xl flex items-start gap-3 text-red-400 text-xs animate-pulse">
                <ShieldAlert size={14} className="shrink-0 mt-0.5" />
                <span>警告：心魔指数过高！建议立即调整状态。</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

const StatCard = ({ icon, label, value, color }: {
  icon: React.ReactNode
  label: string
  value: string | number
  color: string
}) => (
  <div 
    className={`bg-slate-900/80 backdrop-blur-md p-4 rounded-xl border ${color} flex items-center gap-3 shadow-xl min-w-[180px]`}
  >
    <div className={`p-2 rounded-lg ${color}`}>{icon}</div>
    <div>
      <div className="text-xs text-slate-400 uppercase tracking-wider">{label}</div>
      <div className="font-bold text-lg text-slate-100 font-mono">{value}</div>
    </div>
  </div>
)