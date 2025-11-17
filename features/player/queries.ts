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
export const getPlayerById = cache(async (id: string) => {
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
      experience: 'desc'
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
export const getPlayersByRealm = cache(async (realm: string) => {
  return await prisma.player.findMany({
    where: { realm },
    orderBy: {
      experience: 'desc'
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
export const getPlayerStats = cache(async (playerId: string) => {
  const player = await prisma.player.findUnique({
    where: { id: playerId }
  })
  
  if (!player) return null
  
  return {
    id: player.id,
    name: player.name,
    realm: player.realm,
    experience: player.experience,
    currency: player.currency,
    spiritRoot: player.spiritRoot,
    level: calculateLevel(player.experience),
    stats: {
      health: player.health,
      mana: player.mana,
      attack: player.attack,
      defense: player.defense,
    }
  }
})

/**
 * 辅助函数:计算等级
 */
function calculateLevel(exp: number): number {
  // 简单的等级计算:每100经验1级
  return Math.floor(exp / 100) + 1
}