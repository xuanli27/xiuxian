'use server'

import { prisma } from '@/lib/db/prisma'
import { getCurrentUserId } from '@/lib/auth/guards'
import { revalidatePath } from 'next/cache'
import { 
  startMeditationSchema,
  startRetreatSchema,
  breakthroughSchema,
} from './schemas'
import { 
  calculateCultivationExp,
  calculateBreakthroughChance,
  getNextRank,
  calculateBreakthroughCost,
} from './utils'
import type { BreakthroughResult } from './types'

/**
 * Cultivation Server Actions
 */

/**
 * 开始修炼(打坐)
 */
export async function startMeditation(input: { 
  duration: number
  boost?: number 
}) {
  const userId = await getCurrentUserId()
  
  // 验证输入
  const validated = startMeditationSchema.parse(input)
  
  // 获取玩家
  const player = await prisma.player.findUnique({
    where: { userId }
  })
  
  if (!player) {
    throw new Error('玩家不存在')
  }
  
  // 计算经验收益
  const spiritRootQuality = player.spiritRoot === 'HEAVEN' ? 3 : 
                           player.spiritRoot === 'EARTH' ? 2 : 1
  const expGained = calculateCultivationExp(
    validated.duration,
    spiritRootQuality,
    validated.boost || 1
  )
  
  // 更新玩家灵气
  const updatedPlayer = await prisma.player.update({
    where: { id: player.id },
    data: {
      qi: {
        increment: expGained
      },
      // 添加修炼记录到history
      history: {
        push: {
          type: 'CULTIVATION',
          timestamp: new Date().toISOString(),
          duration: validated.duration,
          expGained,
          method: 'MEDITATION'
        }
      }
    }
  })
  
  revalidatePath('/cultivation')
  revalidatePath('/dashboard')
  
  return { 
    success: true, 
    expGained,
    player: updatedPlayer,
    message: `修炼完成!获得灵气: ${expGained}` 
  }
}

/**
 * 开始闭关
 */
export async function startRetreat(input: {
  duration: number
  resources?: Array<{ itemId: string; quantity: number }>
}) {
  const userId = await getCurrentUserId()
  
  // 验证输入
  const validated = startRetreatSchema.parse(input)
  
  // 获取玩家
  const player = await prisma.player.findUnique({
    where: { userId }
  })
  
  if (!player) {
    throw new Error('玩家不存在')
  }
  
  // 闭关经验是普通修炼的1.5倍
  const spiritRootQuality = player.spiritRoot === 'HEAVEN' ? 3 : 
                           player.spiritRoot === 'EARTH' ? 2 : 1
  const baseExp = calculateCultivationExp(validated.duration, spiritRootQuality, 1)
  const expGained = Math.floor(baseExp * 1.5)
  
  // TODO: 检查和消耗资源
  
  // 更新玩家
  const updatedPlayer = await prisma.player.update({
    where: { id: player.id },
    data: {
      qi: {
        increment: expGained
      },
      history: {
        push: {
          type: 'CULTIVATION',
          timestamp: new Date().toISOString(),
          duration: validated.duration,
          expGained,
          method: 'RETREAT'
        }
      }
    }
  })
  
  revalidatePath('/cultivation')
  revalidatePath('/dashboard')
  
  return { 
    success: true, 
    expGained,
    player: updatedPlayer,
    message: `闭关结束!获得灵气: ${expGained}` 
  }
}

/**
 * 境界突破
 */
export async function attemptBreakthrough(input: {
  playerId: number
  useItems?: Array<{ itemId: string; quantity: number }>
}): Promise<BreakthroughResult> {
  const userId = await getCurrentUserId()
  
  // 验证输入
  const validated = breakthroughSchema.parse(input)
  
  // 获取玩家
  const player = await prisma.player.findUnique({
    where: { id: validated.playerId, userId }
  })
  
  if (!player) {
    throw new Error('玩家不存在')
  }
  
  // 检查是否已经是最高境界
  const nextRank = getNextRank(player.rank)
  if (!nextRank) {
    return {
      success: false,
      realmBefore: player.rank,
      realmAfter: null,
      expUsed: 0,
      message: '您已达到仙人境界,无法继续突破!'
    }
  }
  
  // 计算突破成功率
  const expProgress = player.qi / player.maxQi
  const hasBreakthroughPill = validated.useItems && validated.useItems.length > 0
  const successChance = calculateBreakthroughChance(expProgress, 50, hasBreakthroughPill)
  
  // 检查是否满足突破条件
  if (expProgress < 0.8) {
    return {
      success: false,
      realmBefore: player.rank,
      realmAfter: null,
      expUsed: 0,
      message: '灵气不足,需要达到80%才能尝试突破!'
    }
  }
  
  // 计算消耗
  const cost = calculateBreakthroughCost(player.rank)
  
  // 检查资源是否足够
  if (player.spiritStones < cost.spiritStones) {
    return {
      success: false,
      realmBefore: player.rank,
      realmAfter: null,
      expUsed: 0,
      message: `灵石不足!需要${cost.spiritStones}灵石`
    }
  }
  
  // 随机判断是否成功
  const random = Math.random()
  const success = random < successChance
  
  if (success) {
    // 突破成功
    const newMaxQi = Math.floor(player.maxQi * 2)
    
    const updatedPlayer = await prisma.player.update({
      where: { id: player.id },
      data: {
        rank: nextRank,
        qi: 0, // 突破后灵气归零
        maxQi: newMaxQi,
        spiritStones: {
          decrement: cost.spiritStones
        },
        history: {
          push: {
            type: 'BREAKTHROUGH',
            timestamp: new Date().toISOString(),
            realmBefore: player.rank,
            realmAfter: nextRank,
            success: true,
            successChance: Math.floor(successChance * 100)
          }
        }
      }
    })
    
    revalidatePath('/cultivation')
    revalidatePath('/dashboard')
    
    return {
      success: true,
      realmBefore: player.rank,
      realmAfter: nextRank,
      expUsed: player.qi,
      message: `恭喜!突破成功,晋升${nextRank}!`
    }
  } else {
    // 突破失败
    const expLoss = Math.floor(player.qi * 0.3) // 失败损失30%灵气
    
    const updatedPlayer = await prisma.player.update({
      where: { id: player.id },
      data: {
        qi: {
          decrement: expLoss
        },
        innerDemon: {
          increment: 10 // 增加心魔值
        },
        spiritStones: {
          decrement: cost.spiritStones
        },
        history: {
          push: {
            type: 'BREAKTHROUGH',
            timestamp: new Date().toISOString(),
            realmBefore: player.rank,
            realmAfter: null,
            success: false,
            expLost: expLoss,
            successChance: Math.floor(successChance * 100)
          }
        }
      }
    })
    
    revalidatePath('/cultivation')
    revalidatePath('/dashboard')
    
    return {
      success: false,
      realmBefore: player.rank,
      realmAfter: null,
      expUsed: expLoss,
      message: `突破失败!损失${expLoss}灵气,心魔增加`
    }
  }
}

/**
 * 稳固境界(降低心魔)
 */
export async function stabilizeRealm() {
  const userId = await getCurrentUserId()
  
  const player = await prisma.player.findUnique({
    where: { userId }
  })
  
  if (!player) {
    throw new Error('玩家不存在')
  }
  
  // 需要消耗时间和资源来稳固境界
  const stabilizeCost = 50 // 灵石消耗
  
  if (player.spiritStones < stabilizeCost) {
    throw new Error('灵石不足')
  }
  
  const innerDemonReduction = Math.min(player.innerDemon, 20)
  
  const updatedPlayer = await prisma.player.update({
    where: { id: player.id },
    data: {
      innerDemon: {
        decrement: innerDemonReduction
      },
      spiritStones: {
        decrement: stabilizeCost
      },
      history: {
        push: {
          type: 'STABILIZE',
          timestamp: new Date().toISOString(),
          innerDemonReduced: innerDemonReduction
        }
      }
    }
  })
  
  revalidatePath('/cultivation')
  
  return {
    success: true,
    innerDemonReduced: innerDemonReduction,
    message: '境界稳固完成,心魔减少'
  }
}