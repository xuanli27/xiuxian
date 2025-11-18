import { cache } from 'react'
import { prisma } from '@/lib/db/prisma'
import { redis } from '@/lib/db/redis'
import type { LeaderboardCategory } from './types'
import type { LeaderboardEntry, LeaderboardResponse, Season } from './types'

/**
 * 排行榜系统数据查询函数
 */

/**
 * 获取当前赛季
 */
export const getCurrentSeason = cache(async (): Promise<Season> => {
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth() + 1
  const quarter = Math.ceil(month / 3)
  
  return {
    id: `${year}-Q${quarter}`,
    name: `${year}年第${quarter}季度`,
    startDate: new Date(year, (quarter - 1) * 3, 1),
    endDate: new Date(year, quarter * 3, 0),
    active: true,
  }
})

/**
 * 获取排行榜
 */
export const getLeaderboard = cache(async (
  category: LeaderboardCategory,
  season?: string,
  page: number = 1,
  pageSize: number = 20
): Promise<LeaderboardResponse> => {
  const currentSeason = season || (await getCurrentSeason()).id
  
  // 如果 Redis 可用，尝试从缓存读取
  if (redis) {
    const cacheKey = `leaderboard:${category}:${currentSeason}:${page}:${pageSize}`
    
    try {
      const cached = await redis.get(cacheKey)
      if (cached) {
        return JSON.parse(cached)
      }
    } catch (error) {
      console.error('Redis read error:', error)
    }
  }
  
  let orderBy: any = {}
  let selectFields: any = {
    id: true,
    name: true,
  }

  // 根据排行榜类型设置排序和选择字段
  switch (category) {
    case 'REALM':
      orderBy = [{ rank: 'desc' }, { level: 'desc' }]
      selectFields = { ...selectFields, rank: true, level: true }
      break
    case 'POWER':
      // 计算战力 = 攻击 + 防御 + 生命/10
      orderBy = { contribution: 'desc' } // 临时用贡献代替战力
      selectFields = { ...selectFields, contribution: true }
      break
    case 'WEALTH':
      orderBy = { spiritStones: 'desc' }
      selectFields = { ...selectFields, spiritStones: true }
      break
    case 'CONTRIBUTION':
      orderBy = { contribution: 'desc' }
      selectFields = { ...selectFields, contribution: true, sectRank: true }
      break
    case 'CAVE':
      orderBy = { caveLevel: 'desc' }
      selectFields = { ...selectFields, caveLevel: true }
      break
    case 'CULTIVATION':
      orderBy = { qi: 'desc' }
      selectFields = { ...selectFields, qi: true, maxQi: true }
      break
  }

  // 查询玩家
  const players = await prisma.player.findMany({
    select: selectFields,
    orderBy,
    skip: (page - 1) * pageSize,
    take: pageSize,
  })

  const totalEntries = await prisma.player.count()
  const totalPages = Math.ceil(totalEntries / pageSize)

  // 转换为排行榜条目
  const entries: LeaderboardEntry[] = players.map((p: any, index) => {
    const entry: LeaderboardEntry = {
      rank: (page - 1) * pageSize + index + 1,
      playerId: p.id,
      playerName: p.name,
      updatedAt: new Date(),
    }

    switch (category) {
      case 'REALM':
        entry.realm = p.rank
        entry.level = p.level
        break
      case 'POWER':
        entry.power = p.contribution // 临时
        break
      case 'WEALTH':
        entry.wealth = p.spiritStones
        break
      case 'CONTRIBUTION':
        entry.contribution = p.contribution
        entry.sectRank = p.sectRank
        break
      case 'CAVE':
        entry.caveLevel = p.caveLevel
        break
      case 'CULTIVATION':
        entry.cultivationSpeed = p.qi
        break
    }

    return entry
  })

  const result = {
    category,
    season: currentSeason,
    entries,
    currentPage: page,
    totalPages,
    totalEntries,
  }
  
  // 如果 Redis 可用，写入缓存，TTL 5分钟
  if (redis) {
    const cacheKey = `leaderboard:${category}:${currentSeason}:${page}:${pageSize}`
    
    try {
      await redis.setex(cacheKey, 300, JSON.stringify(result))
    } catch (error) {
      console.error('Redis write error:', error)
    }
  }

  return result
})

/**
 * 获取玩家排名
 */
export const getPlayerRank = cache(async (
  playerId: number,
  category: LeaderboardCategory,
  season?: string
): Promise<LeaderboardEntry | null> => {
  const player = await prisma.player.findUnique({
    where: { id: playerId }
  })

  if (!player) return null

  // 计算排名
  let higherRanked = 0

  switch (category) {
    case 'REALM':
      higherRanked = await prisma.player.count({
        where: {
          OR: [
            { rank: { gt: player.rank } },
            { rank: player.rank, level: { gt: player.level } }
          ]
        }
      })
      break
    case 'WEALTH':
      higherRanked = await prisma.player.count({
        where: { spiritStones: { gt: player.spiritStones } }
      })
      break
    case 'CONTRIBUTION':
      higherRanked = await prisma.player.count({
        where: { contribution: { gt: player.contribution } }
      })
      break
    case 'CAVE':
      higherRanked = await prisma.player.count({
        where: { caveLevel: { gt: player.caveLevel } }
      })
      break
    case 'CULTIVATION':
      higherRanked = await prisma.player.count({
        where: { qi: { gt: player.qi } }
      })
      break
  }

  const entry: LeaderboardEntry = {
    rank: higherRanked + 1,
    playerId: player.id,
    playerName: player.name,
    updatedAt: new Date(),
  }

  switch (category) {
    case 'REALM':
      entry.realm = player.rank
      entry.level = player.level
      break
    case 'WEALTH':
      entry.wealth = player.spiritStones
      break
    case 'CONTRIBUTION':
      entry.contribution = player.contribution
      entry.sectRank = player.sectRank
      break
    case 'CAVE':
      entry.caveLevel = player.caveLevel
      break
    case 'CULTIVATION':
      entry.cultivationSpeed = player.qi
      break
  }

  return entry
})

/**
 * 获取排行榜奖励配置
 */
export const getLeaderboardRewards = cache(async (category: LeaderboardCategory) => {
  // 返回固定的奖励配置
  return [
    {
      rank: 1,
      rewards: {
        spiritStones: 10000,
        title: '第一名'
      }
    },
    {
      rank: 2,
      rewards: {
        spiritStones: 5000,
        title: '第二名'
      }
    },
    {
      rank: 3,
      rewards: {
        spiritStones: 3000,
        title: '第三名'
      }
    },
    {
      rankRange: { min: 4, max: 10 },
      rewards: {
        spiritStones: 1000,
      }
    },
    {
      rankRange: { min: 11, max: 50 },
      rewards: {
        spiritStones: 500,
      }
    },
  ]
})