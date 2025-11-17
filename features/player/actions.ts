'use server'

import { prisma } from '@/lib/db/prisma'
import { getCurrentUserId } from '@/lib/auth/guards'
import { revalidatePath } from 'next/cache'
import { 
  createPlayerSchema, 
  updatePlayerSchema,
  addExperienceSchema,
  addCurrencySchema 
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
      realm: 'LIANQI',
      experience: 0,
      currency: 0,
      health: 100,
      mana: 100,
      attack: 10,
      defense: 5,
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
  realm?: string
  experience?: number
  currency?: number
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
export async function addExperience(playerId: string, amount: number) {
  const userId = await getCurrentUserId()
  
  // 验证输入
  const validated = addExperienceSchema.parse({ playerId, amount })
  
  // 获取玩家
  const player = await prisma.player.findUnique({
    where: { id: validated.playerId, userId }
  })
  
  if (!player) {
    throw new Error('玩家不存在')
  }
  
  // 增加经验
  const newExp = player.experience + validated.amount
  const updated = await prisma.player.update({
    where: { id: validated.playerId },
    data: { experience: newExp }
  })
  
  revalidatePath('/')
  return { success: true, player: updated, leveledUp: false }
}

/**
 * 增加货币
 */
export async function addCurrency(playerId: string, amount: number) {
  const userId = await getCurrentUserId()
  
  // 验证输入
  const validated = addCurrencySchema.parse({ playerId, amount })
  
  // 更新货币
  const player = await prisma.player.update({
    where: { id: validated.playerId, userId },
    data: {
      currency: {
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
export async function levelUpRealm(playerId: string) {
  const userId = await getCurrentUserId()
  
  const player = await prisma.player.findUnique({
    where: { id: playerId, userId }
  })
  
  if (!player) {
    throw new Error('玩家不存在')
  }
  
  // TODO: 实现境界升级逻辑
  // 这里需要根据经验值和当前境界判断是否可以升级
  
  revalidatePath('/')
  return { success: true, message: '境界突破成功!' }
}