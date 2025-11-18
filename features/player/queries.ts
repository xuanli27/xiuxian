import { prisma } from '@/lib/db/prisma'
import { cache } from 'react'

/**
 * Player查询函数 (使用React cache优化)
 */

/**
 * 根据用户ID获取玩家
 */
export const getPlayerByUserId = cache(async (userId: string) => {
  return await prisma.player.findUnique({
    where: { userId },
    include: {
      user: {
        select: {
          name: true,
          email: true,
        }
      }
    }
  })
})

/**
 * 根据玩家ID获取玩家
 */
export const getPlayerById = cache(async (id: number) => {
  return await prisma.player.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          name: true,
          email: true,
        }
      }
    }
  })
})

/**
 * 获取所有玩家(用于排行榜)
 */
export const getAllPlayers = cache(async (limit: number = 100) => {
  return await prisma.player.findMany({
    take: limit,
    orderBy: {
      level: 'desc'
    },
    include: {
      user: {
        select: {
          name: true,
          email: true,
        }
      }
    }
  })
})

/**
 * 根据境界筛选玩家
 */
export const getPlayersByRealm = cache(async (rank: string) => {
  return await prisma.player.findMany({
    where: { rank: rank as any },
    orderBy: {
      level: 'desc'
    },
    include: {
      user: {
        select: {
          name: true,
          email: true,
        }
      }
    }
  })
})

/**
 * 获取玩家统计数据
 */
export const getPlayerStats = cache(async (playerId: number) => {
  const player = await prisma.player.findUnique({
    where: { id: playerId },
    select: {
      id: true,
      name: true,
      rank: true,
      level: true,
      qi: true,
      maxQi: true,
      spiritRoot: true,
      spiritStones: true,
      contribution: true,
    }
  })
  
  if (!player) return null
  
  return {
    id: player.id,
    name: player.name,
    rank: player.rank,
    level: player.level,
    qi: player.qi,
    maxQi: player.maxQi,
    spiritRoot: player.spiritRoot,
    spiritStones: player.spiritStones,
    contribution: player.contribution,
  }
})