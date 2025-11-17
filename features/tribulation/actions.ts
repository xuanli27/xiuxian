'use server'

import { prisma } from '@/lib/db/prisma'
import { getCurrentUserId } from '@/lib/auth/guards'
import { revalidatePath } from 'next/cache'
import {
  startTribulationSchema,
  tribulationActionSchema,
  abandonTribulationSchema,
} from './schemas'
import {
  calculateTribulationWaves,
  generateTribulationWaves,
  calculateActionSuccessRate,
  calculateTribulationDamage,
  calculateTribulationRewards,
  calculateTribulationPenalty,
  isTribulationSuccess,
} from './utils'
import { getNextRank } from '../cultivation/utils'
import type { TribulationResult } from './types'

/**
 * Tribulation Server Actions
 */

/**
 * 开始渡劫
 */
export async function startTribulation(input: {
  playerId: number
  preparation?: any
}): Promise<TribulationResult> {
  const userId = await getCurrentUserId()
  
  // 验证输入
  const validated = startTribulationSchema.parse(input)
  
  // 获取玩家
  const player = await prisma.player.findUnique({
    where: { id: validated.playerId, userId }
  })
  
  if (!player) {
    throw new Error('玩家不存在')
  }
  
  // 检查是否已是最高境界
  const nextRank = getNextRank(player.rank)
  if (!nextRank) {
    return {
      success: false,
      realmBefore: player.rank,
      realmAfter: null,
      survived: true,
      wavesCompleted: 0,
      totalWaves: 0,
      message: '您已是仙人境界,无需渡劫!'
    }
  }
  
  // 检查灵气是否足够
  if (player.qi < player.maxQi * 0.8) {
    return {
      success: false,
      realmBefore: player.rank,
      realmAfter: null,
      survived: true,
      wavesCompleted: 0,
      totalWaves: 0,
      message: '灵气不足80%,无法开始渡劫!'
    }
  }
  
  // 生成渡劫波次
  const totalWaves = calculateTribulationWaves(player.rank)
  const waves = generateTribulationWaves(player.rank)
  
  // 模拟渡劫过程
  let health = 1000 // 玩家血量
  let wavesCompleted = 0
  let survived = true
  
  // 计算成功率(基于灵气进度和心魔)
  const expProgress = player.qi / player.maxQi
  let baseChance = expProgress * 0.7
  const demonPenalty = player.innerDemon / 1000
  baseChance -= demonPenalty
  const successChance = Math.max(0.1, Math.min(0.9, baseChance))
  
  // 随机判断每一波
  for (let i = 0; i < totalWaves; i++) {
    const wave = waves[i]
    const random = Math.random()
    
    if (random < successChance) {
      // 通过这一波
      wavesCompleted++
      health -= Math.floor(wave.damage * 0.3) // 受到少量伤害
    } else {
      // 失败
      health -= wave.damage
      if (health <= 0) {
        survived = false
        break
      }
    }
  }
  
  const success = isTribulationSuccess(wavesCompleted, totalWaves)
  
  // 更新玩家数据
  const updateData: any = {
    history: {
      push: {
        type: 'TRIBULATION',
        timestamp: new Date().toISOString(),
        realmBefore: player.rank,
        realmAfter: success ? nextRank : null,
        success,
        survived,
        wavesCompleted,
        totalWaves,
      }
    }
  }
  
  if (success) {
    // 渡劫成功
    const rewards = calculateTribulationRewards(player.rank, wavesCompleted)
    
    updateData.rank = nextRank
    updateData.qi = 0 // 突破后灵气归零
    updateData.maxQi = Math.floor(player.maxQi * 2)
    updateData.spiritStones = {
      increment: rewards.spiritStones
    }
    
    await prisma.player.update({
      where: { id: player.id },
      data: updateData
    })
    
    revalidatePath('/tribulation')
    revalidatePath('/cultivation')
    revalidatePath('/dashboard')
    
    return {
      success: true,
      realmBefore: player.rank,
      realmAfter: nextRank,
      survived: true,
      wavesCompleted,
      totalWaves,
      rewards,
      message: `渡劫成功!成功突破至${nextRank}!`
    }
  } else {
    // 渡劫失败
    const penalty = calculateTribulationPenalty(player.rank, totalWaves - wavesCompleted)
    
    updateData.qi = {
      decrement: Math.min(player.qi, penalty.expLost)
    }
    updateData.innerDemon = {
      increment: penalty.innerDemonGained
    }
    
    await prisma.player.update({
      where: { id: player.id },
      data: updateData
    })
    
    revalidatePath('/tribulation')
    revalidatePath('/cultivation')
    
    return {
      success: false,
      realmBefore: player.rank,
      realmAfter: null,
      survived,
      wavesCompleted,
      totalWaves,
      penalties: penalty,
      message: survived 
        ? `渡劫失败!损失${penalty.expLost}灵气,心魔增加${penalty.innerDemonGained}`
        : '渡劫失败!重伤垂危...'
    }
  }
}

/**
 * 执行渡劫行动(用于交互式渡劫)
 */
export async function performTribulationAction(input: {
  tribulationId: string
  action: string
  itemId?: string
}) {
  const userId = await getCurrentUserId()
  
  // 验证输入
  const validated = tribulationActionSchema.parse(input)
  
  // TODO: 实现交互式渡劫逻辑
  // 这需要在数据库中存储渡劫状态
  
  revalidatePath('/tribulation')
  
  return {
    success: true,
    message: '行动执行成功'
  }
}

/**
 * 放弃渡劫
 */
export async function abandonTribulation(input: {
  tribulationId: string
  confirm: true
}) {
  const userId = await getCurrentUserId()
  
  // 验证输入
  const validated = abandonTribulationSchema.parse(input)
  
  // TODO: 实现放弃渡劫逻辑
  
  revalidatePath('/tribulation')
  
  return {
    success: true,
    message: '已放弃渡劫'
  }
}