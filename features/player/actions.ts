'use server'

import { prisma } from '@/lib/db/prisma'
import { getCurrentUserId } from '@/lib/auth/guards'
import { revalidatePath } from 'next/cache'
import {
  createPlayerSchema,
  updatePlayerSchema,
  addQiSchema,
  addSpiritStonesSchema
} from './schemas'
import { calculateExpForLevel } from '@/lib/game/formulas'

/**
 * Player Server Actions
 */

/**
 * 创建新玩家
 */
export async function createPlayer(input: { name: string; spiritRoot: string }) {
  const userId = await getCurrentUserId()
  
  // 验证输入
  const validated = createPlayerSchema.parse(input)
  
  // 检查是否已有玩家
  const existing = await prisma.player.findUnique({
    where: { userId }
  })
  
  if (existing) {
    throw new Error('玩家已存在')
  }
  
  // 创建玩家
  const player = await prisma.player.create({
    data: {
      userId,
      name: validated.name,
      spiritRoot: validated.spiritRoot,
      rank: 'QI_REFINING', // 使用正确的 rank 字段和枚举值
      level: 1,
      qi: 0,
      maxQi: 100,
      innerDemon: 0,
      contribution: 0,
      spiritStones: 0,
      caveLevel: 1,
    }
  })
  
  revalidatePath('/')
  return { success: true, player }
}

/**
 * 更新玩家信息
 */
export async function updatePlayer(input: {
  name?: string
  rank?: string
  level?: number
  qi?: number
  maxQi?: number
  spiritStones?: number
}) {
  const userId = await getCurrentUserId()
  
  // 验证输入
  const validated = updatePlayerSchema.parse(input)
  
  // 更新玩家
  const player = await prisma.player.update({
    where: { userId },
    data: validated
  })
  
  revalidatePath('/')
  return { success: true, player }
}

/**
 * 增加经验值
 */
export async function addQi(playerId: number, amount: number) {
  const userId = await getCurrentUserId()
  
  // 验证输入
  const validated = addQiSchema.parse({ playerId, amount })
  
  // 获取玩家
  const player = await prisma.player.findUnique({
    where: { id: validated.playerId }
  })
  
  // 验证玩家所有权
  if (player && player.userId !== userId) {
    throw new Error('无权操作此玩家')
  }
  
  if (!player) {
    throw new Error('玩家不存在')
  }
  
  // 增加灵气
  const newQi = player.qi + validated.amount
  const updated = await prisma.player.update({
    where: { id: validated.playerId },
    data: { qi: Math.min(newQi, player.maxQi) }
  })
  
  revalidatePath('/')
  return { success: true, player: updated, leveledUp: false }
}

/**
 * 增加货币
 */
export async function addSpiritStones(playerId: number, amount: number) {
  const userId = await getCurrentUserId()
  
  // 验证输入
  const validated = addSpiritStonesSchema.parse({ playerId, amount })
  
  // 获取玩家验证所有权
  const existingPlayer = await prisma.player.findUnique({
    where: { id: validated.playerId }
  })
  
  if (!existingPlayer || existingPlayer.userId !== userId) {
    throw new Error('玩家不存在或无权操作')
  }
  
  // 更新灵石
  const player = await prisma.player.update({
    where: { id: validated.playerId },
    data: {
      spiritStones: {
        increment: validated.amount
      }
    }
  })
  
  revalidatePath('/')
  return { success: true, player }
}

/**
 * 境界突破
 */
export async function levelUpRealm(playerId: number) {
  const userId = await getCurrentUserId()
  
  const player = await prisma.player.findUnique({
    where: { id: playerId }
  })
  
  if (!player) {
    throw new Error('玩家不存在')
  }
  
  // TODO: 实现境界升级逻辑
  // 这里需要根据经验值和当前境界判断是否可以升级
  
  revalidatePath('/')
  return { success: true, message: '境界突破成功!' }
}

/**
 * 更新玩家进度（用于本地状态同步）
 */
export async function updatePlayerProgress(input: {
  playerId: number
  qi: number
  innerDemon: number
  spiritStones: number
  caveLevel: number
}) {
  const userId = await getCurrentUserId()
  
  // 验证玩家所有权
  const player = await prisma.player.findUnique({
    where: { id: input.playerId }
  })
  
  if (!player || player.userId !== userId) {
    throw new Error('无权操作此玩家')
  }
  
  // 更新进度
  const updated = await prisma.player.update({
    where: { id: input.playerId },
    data: {
      qi: input.qi,
      innerDemon: input.innerDemon,
      spiritStones: input.spiritStones,
      caveLevel: input.caveLevel,
    }
  })
  
  return { success: true, player: updated }
}