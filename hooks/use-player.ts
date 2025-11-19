'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getCurrentPlayer } from '@/features/player/actions'
import { startMeditation, attemptBreakthrough } from '@/features/cultivation/actions'
import type { Player } from '@prisma/client'

// 定义查询的key, 以便在整个应用中复用
const playerQueryKey = ['player']

export function usePlayer() {
  const queryClient = useQueryClient()

  // 数据获取 (useQuery)
  const {
    data: player,
    isLoading,
    isError,
    error
  } = useQuery({
    queryKey: playerQueryKey,
    queryFn: () => getCurrentPlayer(),
    // 可以添加一些配置, 例如:
    // staleTime: 5 * 60 * 1000, // 5分钟内数据被认为是新鲜的
    // refetchOnWindowFocus: true, // 当窗口重新获得焦点时自动刷新
  })

  // 数据变更 (useMutation)

  // 封装修炼(打坐)的mutation
  const meditateMutation = useMutation({
    mutationFn: (variables: { duration: number }) => startMeditation(variables),
    onSuccess: (result) => {
      // 当mutation成功时, 使player查询失效, React Query会自动重新获取最新数据
      queryClient.invalidateQueries({ queryKey: playerQueryKey })
      // 你可以在这里添加一些成功后的UI反馈, 例如toast通知
      console.log(`修炼成功, 获得 ${result.expGained} 灵气!`)
    },
    onError: (error) => {
      // 错误处理
      console.error('修炼失败:', error)
    },
  })

  // 封装境界突破的mutation
  const breakthroughMutation = useMutation({
    mutationFn: () => {
      if (!player) throw new Error("玩家数据未加载,无法突破");
      return attemptBreakthrough({ playerId: player.id });
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: playerQueryKey })
      // 可以在这里根据result.success来显示不同的通知
      console.log(result.message)
    },
    onError: (error) => {
      console.error('突破失败:', error)
    },
  })

  return {
    // 玩家数据
    player,
    isLoading,
    isError,
    error,

    // 玩家操作
    // 提供一个更简洁的API给组件调用
    meditate: meditateMutation.mutate,
    isMeditating: meditateMutation.isPending,

    breakthrough: breakthroughMutation.mutate,
    isBreakingThrough: breakthroughMutation.isPending,
  }
}