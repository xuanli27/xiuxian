import { cache } from 'react'
import { prisma } from '@/lib/db/prisma'
import type { Rank } from '@prisma/client'
import type {
  TribulationHistory,
  TribulationStats,
  TribulationPreparation
} from './types'

/**
 * 渡劫系统数据查询函数
 */

/**
 * 获取玩家渡劫历史
 */
export const getTribulationHistory = cache(async (
  playerId: number,
  limit: number = 20
): Promise<TribulationHistory[]> => {
  const player = await prisma.player.findUnique({
    where: { id: playerId },
    select: { history: true }
  })

  if (!player) return []

  const history = Array.isArray(player.history) ? player.history : []

  const tribulationRecords = history
    .filter((r: any) => r.type === 'TRIBULATION')
    .map((r: any) => ({
      id: r.id || `trib_${Date.now()}_${Math.random()}`,
      playerId,
      type: r.tribulationType || 'THUNDER',
      difficulty: r.difficulty || 'MINOR',
      success: r.success || false,
      realmBefore: r.realmBefore,
      realmAfter: r.realmAfter || null,
      wavesCompleted: r.wavesCompleted || 0,
      totalWaves: r.totalWaves || 9,
      createdAt: new Date(r.timestamp || Date.now()),
    }))
    .sort((a: any, b: any) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, limit)

  return tribulationRecords
})

/**
 * 获取渡劫统计
 */
export const getTribulationStats = cache(async (
  playerId: number
): Promise<TribulationStats> => {
  const history = await getTribulationHistory(playerId, 100)

  const totalAttempts = history.length
  const successfulAttempts = history.filter(h => h.success).length
  const failedAttempts = totalAttempts - successfulAttempts
  const successRate = totalAttempts > 0 ? successfulAttempts / totalAttempts : 0

  const highestWaveReached = history.reduce((max, h) =>
    Math.max(max, h.wavesCompleted), 0
  )

  const averageWavesCompleted = totalAttempts > 0
    ? history.reduce((sum, h) => sum + h.wavesCompleted, 0) / totalAttempts
    : 0

  const lastAttemptAt = history.length > 0 ? history[0].createdAt : undefined

  return {
    totalAttempts,
    successfulAttempts,
    failedAttempts,
    successRate,
    highestWaveReached,
    averageWavesCompleted,
    lastAttemptAt,
  }
})

/**
 * 获取渡劫准备建议
 */
export const getTribulationPreparation = cache(async (
  playerId: number
): Promise<TribulationPreparation> => {
  const player = await prisma.player.findUnique({
    where: { id: playerId },
    select: {
      rank: true,
      qi: true,
      maxQi: true,
      innerDemon: true,
    }
  })

  if (!player) {
    return {
      recommendedHealth: 1000,
      recommendedDefense: 100,
      recommendedItems: [],
      successChance: 0,
      risks: ['玩家不存在'],
    }
  }

  // 根据境界计算推荐属性
  const rankLevels: Record<Rank, number> = {
    MORTAL: 0,
    QI_REFINING: 1,
    FOUNDATION: 2,
    GOLDEN_CORE: 3,
    NASCENT_SOUL: 4,
    SPIRIT_SEVERING: 5,
    VOID_REFINING: 6,
    MAHAYANA: 7,
    IMMORTAL: 8,
  }

  const level = rankLevels[player.rank]
  const recommendedHealth = 500 + level * 200
  const recommendedDefense = 50 + level * 30

  // 计算成功率
  const expProgress = player.maxQi > 0 ? player.qi / player.maxQi : 0
  let baseChance = expProgress * 0.6

  // 心魔减少成功率
  const demonPenalty = player.innerDemon / 1000
  baseChance -= demonPenalty

  const successChance = Math.max(0.1, Math.min(0.9, baseChance))

  // 推荐物品
  const recommendedItems = [
    '渡劫丹',
    '护体灵符',
    '回春丹',
  ]

  // 风险提示
  const risks: string[] = []
  if (expProgress < 0.9) {
    risks.push('灵气不足,建议继续修炼')
  }
  if (player.innerDemon > 50) {
    risks.push('心魔过重,建议先稳固境界')
  }
  if (successChance < 0.5) {
    risks.push('成功率较低,建议做好充分准备')
  }

  return {
    recommendedHealth,
    recommendedDefense,
    recommendedItems,
    successChance,
    risks,
  }
})

/**
 * 检查是否需要渡劫
 */
export const needsTribulation = cache(async (playerId: number): Promise<boolean> => {
  const player = await prisma.player.findUnique({
    where: { id: playerId },
    select: {
      rank: true,
      qi: true,
      maxQi: true,
    }
  })

  if (!player) return false

  // 达到瓶颈且已是最高境界则不需要渡劫
  if (player.rank === 'IMMORTAL') return false

  // 灵气达到90%以上需要渡劫突破
  return player.qi >= player.maxQi * 0.9
})

/**
 * 获取渡劫页面综合数据
 */
export const getTribulationDashboardData = cache(async (playerId: number) => {
  const [needs, preparation, history, stats] = await Promise.all([
    needsTribulation(playerId),
    getTribulationPreparation(playerId),
    getTribulationHistory(playerId),
    getTribulationStats(playerId)
  ]);

  return {
    needsTribulation: needs,
    preparation,
    history,
    stats
  };
});