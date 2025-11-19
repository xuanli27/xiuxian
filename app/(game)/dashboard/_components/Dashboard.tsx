import React, { useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { usePlayer } from '@/hooks/use-player'
import { getCurrentPlayerRealmInfo, autoCultivate } from '@/features/cultivation/actions'
import { QiCirculation } from '@/components/game/QiCirculation'
import { Button } from '@/components/ui'
import { Loader2 } from 'lucide-react'

export const Dashboard: React.FC = () => {
  const {
    player,
    isLoading: isPlayerLoading,
  } = usePlayer()

  const queryClient = useQueryClient()

  const { data: realmInfo, isLoading: isRealmLoading } = useQuery({
    queryKey: ['realm-info'],
    queryFn: () => getCurrentPlayerRealmInfo(),
    enabled: !!player,
  })

  // 自动修炼轮询
  const { mutate: triggerAutoCultivate } = useMutation({
    mutationFn: () => autoCultivate(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['player'] })
    }
  })

  useEffect(() => {
    if (!player) return

    // 每10秒触发一次自动修炼 (为了演示效果，比实际分钟级要快)
    const interval = setInterval(() => {
      triggerAutoCultivate()
    }, 10000)

    return () => clearInterval(interval)
  }, [player, triggerAutoCultivate])

  if (isPlayerLoading || isRealmLoading || !player || !realmInfo) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] gap-8 relative">
      {/* 顶部状态栏 (极简) */}
      <div className="absolute top-0 left-0 right-0 flex justify-between items-center px-4 py-2 bg-surface-900/50 backdrop-blur-sm rounded-full border border-surface-800/50 mx-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-content-400">境界</span>
          <span className="text-primary-300 font-bold">{realmInfo.name} {player.level}重</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-content-400">灵气</span>
          <span className="text-primary-300 font-mono">{Math.floor(player.qi)} / {player.maxQi}</span>
        </div>
      </div>

      {/* 核心视觉：周天运行 */}
      <div className="w-full max-w-md px-8">
        <QiCirculation
          isCultivating={true}
          realm={`${realmInfo.name} ${player.level}重`}
        />
      </div>

      {/* 底部状态提示 */}
      <div className="text-center space-y-2">
        <p className="text-primary-400 animate-pulse">
          自动修炼中... +{realmInfo.cultivationRate || 2} 灵气/分钟
        </p>
        <p className="text-xs text-content-500">
          (离线亦可获得收益)
        </p>
      </div>
    </div>
  )
}