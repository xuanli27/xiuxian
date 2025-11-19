'use server'

import { getPlayerCave as getPlayerCaveQuery, getCaveStats as getCaveStatsQuery } from './queries'
import { prisma } from '@/lib/db/prisma'
import { getCurrentUserId } from '@/lib/auth/guards'
import { revalidatePath } from 'next/cache'
import { calculateCaveUpgradeCost } from './utils'
import type { Cave, CaveStats } from './types'

/**
 * Server Action: 获取玩家洞府
 */
export async function getPlayerCave(): Promise<Cave | null> {
  const userId = await getCurrentUserId()
  const player = await prisma.player.findUnique({
    where: { userId },
    select: { id: true }
  })
  
  if (!player) return null
  
  return getPlayerCaveQuery(player.id)
}

/**
 * Server Action: 获取洞府统计
 */
export async function getCaveStats(): Promise<CaveStats> {
  const userId = await getCurrentUserId()
  const player = await prisma.player.findUnique({
    where: { userId },
    select: { id: true }
  })
  
  if (!player) {
    return {
      totalBuildings: 0,
      activeBuildings: 0,
      productionRate: 0,
      defensePower: 0,
      storageCapacity: 0,
      dailyIncome: {
        spiritualEnergy: 0,
        herbs: 0,
        ores: 0,
        pills: 0,
        artifacts: 0,
      },
    }
  }
  
  return getCaveStatsQuery(player.id)
}

/**
 * Server Action: 升级洞府
 */
export async function upgradeCave(input: { playerId: number }) {
  const userId = await getCurrentUserId()
  const player = await prisma.player.findUnique({
    where: { userId, id: input.playerId }
  })
  
  if (!player) {
    throw new Error('玩家不存在')
  }
  
  const cost = calculateCaveUpgradeCost(player.caveLevel)
  
  if (player.spiritStones < cost.spiritStones) {
    throw new Error('灵石不足')
  }
  
  const updatedPlayer = await prisma.player.update({
    where: { id: player.id },
    data: {
      caveLevel: { increment: 1 },
      spiritStones: { decrement: cost.spiritStones }
    }
  })
  
  revalidatePath('/cave')
  return { success: true, newLevel: updatedPlayer.caveLevel }
}

/**
 * Server Action: 炼制物品
 */
export async function craftItem(input: { recipeId: string }) {
  const userId = await getCurrentUserId()
  const player = await prisma.player.findUnique({
    where: { userId }
  })

  if (!player) {
    throw new Error('玩家不存在')
  }

  // TODO: 实现炼制逻辑

  revalidatePath('/cave')
  revalidatePath('/inventory')
  return { success: true, message: '炼制成功' }
}