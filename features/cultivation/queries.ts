import { getCurrentUserId } from '@/lib/auth/guards'

/**
 * 获取当前玩家的境界信息(客户端调用)
 */
export async function getCurrentPlayerRealmInfo(): Promise<RealmInfo | null> {
  const userId = await getCurrentUserId()
  const player = await prisma.player.findUnique({
    where: { userId },
    select: {
      id: true,
      rank: true,
      qi: true,
      maxQi: true,
    }
  })

  if (!player) return null

  return getPlayerRealmInfo(player.id)
}

import { cache } from 'react'
import { prisma } from '@/lib/db/prisma'
import type { Rank } from '@prisma/client'
import type { RealmInfo, CultivationStats } from './types'

/**
 * 修炼系统数据查询函数
 */

/**
 * 获取玩家当前境界信息
 */
export const getPlayerRealmInfo = cache(async (playerId: number): Promise<RealmInfo | null> => {
  const player = await prisma.player.findUnique({
    where: { id: playerId },
    select: {
      rank: true,
      qi: true,
      maxQi: true,
    }
  })

  if (!player) return null

  // 境界名称映射
  const realmNames: Record<Rank, string> = {
    MORTAL: '凡人',
    QI_REFINING: '练气期',
    FOUNDATION: '筑基期',
    GOLDEN_CORE: '金丹期',
    NASCENT_SOUL: '元婴期',
    SPIRIT_SEVERING: '化神期',
    VOID_REFINING: '炼虚期',
    MAHAYANA: '大乘期',
    IMMORTAL: '仙人',
  }

  // 境界经验需求
  const expRequirements: Record<Rank, number> = {
    MORTAL: 0,
    QI_REFINING: 100,
    FOUNDATION: 500,
    GOLDEN_CORE: 2000,
    NASCENT_SOUL: 5000,
    SPIRIT_SEVERING: 10000,
    VOID_REFINING: 20000,
    MAHAYANA: 50000,
    IMMORTAL: 100000,
  }

  // 境界特权
  const benefits: Record<Rank, string[]> = {
    MORTAL: ['开启修炼之路'],
    QI_REFINING: ['感知灵气', '基础修炼'],
    FOUNDATION: ['凝聚灵力', '开辟洞府'],
    GOLDEN_CORE: ['御器飞行', '炼制法宝'],
    NASCENT_SOUL: ['神识外放', '分身术'],
    SPIRIT_SEVERING: ['掌控规则', '领域展开'],
    VOID_REFINING: ['破碎虚空', '时空感知'],
    MAHAYANA: ['渡天劫', '准备飞升'],
    IMMORTAL: ['长生不老', '遨游诸天'],
  }

  const expCurrent = player.qi
  const expRequired = player.maxQi
  const breakthroughChance = Math.min((expCurrent / expRequired) * 0.9, 0.9)

  return {
    rank: player.rank,
    name: realmNames[player.rank],
    expRequired,
    expCurrent,
    breakthroughChance,
    benefits: benefits[player.rank],
  }
})

/**
 * 获取修炼记录(从Player的history字段解析)
 */
export const getCultivationRecords = cache(async (
  playerId: number,
  limit: number = 20
) => {
  const player = await prisma.player.findUnique({
    where: { id: playerId },
    select: { history: true }
  })

  if (!player) return []

  // 从JSON字段中提取修炼记录
  const history = Array.isArray(player.history) ? player.history : []
  
  return history
    .filter((record: any) => 
      record.type === 'CULTIVATION' || 
      record.type === 'BREAKTHROUGH'
    )
    .slice(0, limit)
})

/**
 * 获取修炼统计
 */
export const getCultivationStats = cache(async (playerId: number): Promise<CultivationStats> => {
  const player = await prisma.player.findUnique({
    where: { id: playerId },
    select: { history: true }
  })

  if (!player) {
    return {
      totalSessions: 0,
      totalExpGained: 0,
      totalBreakthroughs: 0,
      successRate: 0,
      longestRetreat: 0,
      currentStreak: 0,
    }
  }

  const history = Array.isArray(player.history) ? player.history : []
  const cultivationRecords = history.filter((r: any) => 
    r.type === 'CULTIVATION' || r.type === 'BREAKTHROUGH'
  )

  const totalSessions = cultivationRecords.length
  const totalExpGained = cultivationRecords.reduce((sum: number, r: any) => 
    sum + (r.expGained || 0), 0
  )
  const breakthroughs = cultivationRecords.filter((r: any) => 
    r.type === 'BREAKTHROUGH'
  )
  const totalBreakthroughs = breakthroughs.length
  const successfulBreakthroughs = breakthroughs.filter((r: any) => r.success).length
  const successRate = totalBreakthroughs > 0 
    ? successfulBreakthroughs / totalBreakthroughs 
    : 0

  // 计算最长闭关时间
  const longestRetreat = cultivationRecords.reduce((max: number, r: any) => {
    const duration = r.duration || 0
    return duration > max ? duration : max
  }, 0)

  return {
    totalSessions,
    totalExpGained,
    totalBreakthroughs,
    successRate,
    longestRetreat,
    currentStreak: 0, // TODO: 实现连续修炼天数
  }
})

/**
 * 检查是否可以突破
 */
export const canBreakthrough = cache(async (playerId: number): Promise<boolean> => {
  const realmInfo = await getPlayerRealmInfo(playerId)
  if (!realmInfo) return false

  // 需要达到80%以上经验才能尝试突破
  return realmInfo.expCurrent >= realmInfo.expRequired * 0.8
})