'use client'

import React, { useEffect } from 'react'
import { useMutation } from '@tanstack/react-query'
import { Zap, Database, ShieldAlert, Coins } from 'lucide-react'
import { Button } from '@/components/ui'
import { SpiritSeaCore } from './SpiritSeaCore'
import { SecondaryPortals } from './SecondaryPortals'
import clsx from 'clsx'
import { startMeditation, attemptBreakthrough } from '@/features/cultivation/actions'
import { useGameStore } from '@/stores/game-store'
import { useGameSync } from '@/hooks/use-game-sync'
import { REALM_CONFIG } from '@/config/game'
import type { Player, Task } from '@prisma/client'
import type { RealmInfo } from '@/features/cultivation/types'

interface Props {
  initialPlayer: Player
  initialRealmInfo: RealmInfo | null
  initialTasks: Task[]
}

export const Dashboard: React.FC<Props> = ({ initialPlayer, initialRealmInfo, initialTasks }) => {
  useGameSync(initialPlayer)
  
  const localPlayer = useGameStore((state) => state.player)
  const gainQi = useGameStore((state) => state.gainQi)
  const tick = useGameStore((state) => state.tick)

  useEffect(() => {
    const interval = setInterval(() => {
      tick()
    }, 100)
    return () => clearInterval(interval)
  }, [tick])

  const meditation = useMutation({
    mutationFn: () => startMeditation({ duration: 10 }),
    onSuccess: () => {
      gainQi(10)
    }
  })
  
  const breakthrough = useMutation({
    mutationFn: () => attemptBreakthrough({ playerId: initialPlayer.id }),
  })

  if (!localPlayer || !initialRealmInfo) {
    return <div>加载中...</div>
  }
  
  const canBreakthrough = localPlayer.qi >= localPlayer.maxQi
  const progress = Math.min(100, (localPlayer.qi / localPlayer.maxQi) * 100)
  const displayRank = `${initialRealmInfo.name} ${initialPlayer.level}级`

  return (
    <div className="relative min-h-screen -m-8 -mb-28">
      {/* 识海背景核心 */}
      <SpiritSeaCore 
        onMeditate={() => meditation.mutate()}
        canBreakthrough={canBreakthrough}
      />

      {/* 悬浮UI层 */}
      <div className="relative z-10 pointer-events-none">
        {/* 左上角：玩家信息 */}
        <div className="absolute top-8 left-8 pointer-events-auto">
          <div className="bg-slate-900/80 backdrop-blur-md border border-indigo-500/30 rounded-2xl p-4 shadow-2xl">
            <h2 className="text-xl font-bold text-amber-200 mb-1">
              {initialPlayer.name}
            </h2>
            <p className="text-sm text-slate-400">仙欲宗 · 内门弟子</p>
          </div>
        </div>

        {/* 右上角：核心状态 */}
        <div className="absolute top-8 right-8 flex flex-col gap-3 pointer-events-auto">
          <StatCard icon={<Database size={16} />} label="境界" value={displayRank} color="bg-blue-500/20 text-blue-400 border-blue-500/30" />
          <StatCard icon={<ShieldAlert size={16} />} label="心魔" value={`${localPlayer.innerDemon}%`} color={localPlayer.innerDemon > 80 ? "bg-red-500/20 text-red-500 border-red-500/30 animate-pulse" : "bg-orange-500/20 text-orange-400 border-orange-500/30"} />
          <StatCard icon={<Coins size={16} />} label="灵石" value={localPlayer.spiritStones} color="bg-amber-500/20 text-amber-400 border-amber-500/30" />
        </div>

        {/* 底部：次级入口 */}
        <div className="absolute bottom-32 left-1/2 -translate-x-1/2 pointer-events-auto">
          <SecondaryPortals
            player={initialPlayer}
            canTribulation={canBreakthrough}
          />
        </div>

        {/* 右侧：渡劫面板 */}
        <div className="absolute top-1/2 right-8 -translate-y-1/2 w-80 pointer-events-auto">
          <div className="bg-slate-900/80 backdrop-blur-md border border-indigo-500/30 rounded-2xl p-6 shadow-2xl">
            <div className="mb-6">
              <div className="flex justify-between mb-3 items-end">
                <span className="text-amber-200 text-lg font-bold">{initialRealmInfo.name}考核</span>
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
                <span>{localPlayer.maxQi === Infinity ? '∞' : Math.floor(localPlayer.qi) + ' / ' + localPlayer.maxQi}</span>
              </div>
            </div>
            
            <Button
              size="lg"
              disabled={!canBreakthrough}
              onClick={() => breakthrough.mutate()}
              variant={'danger'}
              className={clsx("w-full h-14 text-base relative overflow-hidden bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500", canBreakthrough && "animate-pulse shadow-lg shadow-red-500/50")}
              icon={<Zap size={20} />}
            >
              {canBreakthrough
                ? `渡劫 (晋升${REALM_CONFIG.names[initialRealmInfo.rank]})`
                : "闭关积累中"}
            </Button>
            
            {localPlayer.innerDemon > 50 && (
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

const StatCard = ({ icon, label, value, color }: any) => (
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