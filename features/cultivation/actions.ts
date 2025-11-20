'use server'

import { createServerSupabaseClient } from '@/lib/db/supabase'
import { getCurrentUserId } from '@/lib/auth/server'
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
import type { BreakthroughResult, RealmInfo, CultivationStats } from './types'
import { getPlayerRealmInfo, getCultivationStats } from './queries'
import type { Rank } from '@/types/enums'

/**
 * Cultivation Server Actions
 */

/**
 * 获取当前玩家的境界信息(客户端调用)
 */
export async function getCurrentPlayerRealmInfo(): Promise<RealmInfo | null> {
  const userId = await getCurrentUserId()
  const supabase = await createServerSupabaseClient()
  
  const { data: player } = await supabase
    .from('players')
    .select('id')
    .eq('user_id', userId)
    .single()

  if (!player) return null

  return getPlayerRealmInfo(player.id)
}

/**
 * 获取当前玩家的修炼统计(客户端调用)
 */
export async function getCurrentCultivationStats(): Promise<CultivationStats> {
  const userId = await getCurrentUserId()
  const supabase = await createServerSupabaseClient()
  
  const { data: player } = await supabase
    .from('players')
    .select('id')
    .eq('user_id', userId)
    .single()

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

  return getCultivationStats(player.id)
}

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
  const supabase = await createServerSupabaseClient()
  
  const { data: player } = await supabase
    .from('players')
    .select('id, spirit_root, qi, history')
    .eq('user_id', userId)
    .single()

  if (!player) {
    throw new Error('玩家不存在')
  }

  // 计算经验收益
  const spiritRootQuality = player.spirit_root === 'HEAVEN' ? 3 :
    player.spirit_root === 'EARTH' ? 2 : 1
  const expGained = calculateCultivationExp(
    validated.duration,
    spiritRootQuality,
    validated.boost || 1
  )

  // 更新玩家灵气和历史记录
  const history = Array.isArray(player.history) ? player.history : []
  history.push({
    type: 'CULTIVATION',
    timestamp: new Date().toISOString(),
    duration: validated.duration,
    expGained,
    method: 'MEDITATION'
  })

  const { data: updatedPlayer } = await supabase
    .from('players')
    .update({
      qi: player.qi + expGained,
      history
    })
    .eq('id', player.id)
    .select()
    .single()

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
 * 自动修炼(被动收益)
 * 每次调用增加少量灵气，用于前端轮询或后台任务
 */
export async function autoCultivate() {
  const userId = await getCurrentUserId()
  const supabase = await createServerSupabaseClient()
  
  const { data: player } = await supabase
    .from('players')
    .select('id, spirit_root, qi, max_qi')
    .eq('user_id', userId)
    .single()

  if (!player) return null

  // 基础自动修炼速度 (每分钟)
  const baseRate = 2
  // 灵根加成
  const spiritRootMultiplier = player.spirit_root === 'HEAVEN' ? 2 : player.spirit_root === 'EARTH' ? 1.5 : 1

  const expGained = Math.floor(baseRate * spiritRootMultiplier)

  // 检查是否可以自动突破
  const shouldAutoBreakthrough = player.qi + expGained >= player.max_qi * 0.95

  if (shouldAutoBreakthrough) {
    // 触发自动突破逻辑 (这里简化处理，实际可能需要更复杂的判定)
    // 暂时只增加灵气，让前端提示突破
  }

  const { data: updatedPlayer } = await supabase
    .from('players')
    .update({
      qi: player.qi + expGained
    })
    .eq('id', player.id)
    .select('qi, max_qi')
    .single()

  revalidatePath('/dashboard')

  return {
    success: true,
    expGained,
    currentQi: updatedPlayer?.qi || player.qi + expGained,
    maxQi: updatedPlayer?.max_qi || player.max_qi
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
  const supabase = await createServerSupabaseClient()
  
  const { data: player } = await supabase
    .from('players')
    .select('id, spirit_root, qi, history')
    .eq('user_id', userId)
    .single()

  if (!player) {
    throw new Error('玩家不存在')
  }

  // 闭关经验是普通修炼的1.5倍
  const spiritRootQuality = player.spirit_root === 'HEAVEN' ? 3 :
    player.spirit_root === 'EARTH' ? 2 : 1
  const baseExp = calculateCultivationExp(validated.duration, spiritRootQuality, 1)
  const expGained = Math.floor(baseExp * 1.5)

  // TODO: 检查和消耗资源

  // 更新玩家
  const history = Array.isArray(player.history) ? player.history : []
  history.push({
    type: 'CULTIVATION',
    timestamp: new Date().toISOString(),
    duration: validated.duration,
    expGained,
    method: 'RETREAT'
  })

  const { data: updatedPlayer } = await supabase
    .from('players')
    .update({
      qi: player.qi + expGained,
      history
    })
    .eq('id', player.id)
    .select()
    .single()

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
  const supabase = await createServerSupabaseClient()
  
  const { data: player } = await supabase
    .from('players')
    .select('id, rank, qi, max_qi, spirit_stones, inner_demon, history')
    .eq('id', validated.playerId)
    .eq('user_id', userId)
    .single()

  if (!player) {
    throw new Error('玩家不存在')
  }

  const currentRank = player.rank as Rank

  // 检查是否已经是最高境界
  const nextRank = getNextRank(currentRank)
  if (!nextRank) {
    return {
      success: false,
      realmBefore: currentRank,
      realmAfter: null,
      expUsed: 0,
      message: '您已达到仙人境界,无法继续突破!'
    }
  }

  // 计算突破成功率
  const expProgress = player.qi / player.max_qi
  const hasBreakthroughPill = validated.useItems && validated.useItems.length > 0
  const successChance = calculateBreakthroughChance(expProgress, 50, hasBreakthroughPill)

  // 检查是否满足突破条件
  if (expProgress < 0.8) {
    return {
      success: false,
      realmBefore: currentRank,
      realmAfter: null,
      expUsed: 0,
      message: '灵气不足,需要达到80%才能尝试突破!'
    }
  }

  // 计算消耗
  const cost = calculateBreakthroughCost(currentRank)

  // 检查资源是否足够
  if (player.spirit_stones < cost.spiritStones) {
    return {
      success: false,
      realmBefore: currentRank,
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
    const newMaxQi = Math.floor(player.max_qi * 2)

    const history = Array.isArray(player.history) ? player.history : []
    history.push({
      type: 'BREAKTHROUGH',
      timestamp: new Date().toISOString(),
      realmBefore: currentRank,
      realmAfter: nextRank,
      success: true,
      successChance: Math.floor(successChance * 100)
    })

    await supabase
      .from('players')
      .update({
        rank: nextRank,
        qi: 0,
        max_qi: newMaxQi,
        spirit_stones: player.spirit_stones - cost.spiritStones,
        history
      })
      .eq('id', player.id)

    revalidatePath('/cultivation')
    revalidatePath('/dashboard')

    return {
      success: true,
      realmBefore: currentRank,
      realmAfter: nextRank,
      expUsed: player.qi,
      message: `恭喜!突破成功,晋升${nextRank}!`
    }
  } else {
    // 突破失败
    const expLoss = Math.floor(player.qi * 0.3)

    const history = Array.isArray(player.history) ? player.history : []
    history.push({
      type: 'BREAKTHROUGH',
      timestamp: new Date().toISOString(),
      realmBefore: currentRank,
      realmAfter: null,
      success: false,
      expLost: expLoss,
      successChance: Math.floor(successChance * 100)
    })

    await supabase
      .from('players')
      .update({
        qi: player.qi - expLoss,
        inner_demon: player.inner_demon + 10,
        spirit_stones: player.spirit_stones - cost.spiritStones,
        history
      })
      .eq('id', player.id)

    revalidatePath('/cultivation')
    revalidatePath('/dashboard')

    return {
      success: false,
      realmBefore: currentRank,
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
  const supabase = await createServerSupabaseClient()

  const { data: player } = await supabase
    .from('players')
    .select('id, inner_demon, spirit_stones, history')
    .eq('user_id', userId)
    .single()

  if (!player) {
    throw new Error('玩家不存在')
  }

  const stabilizeCost = 50

  if (player.spirit_stones < stabilizeCost) {
    throw new Error('灵石不足')
  }

  const innerDemonReduction = Math.min(player.inner_demon, 20)

  const history = Array.isArray(player.history) ? player.history : []
  history.push({
    type: 'STABILIZE',
    timestamp: new Date().toISOString(),
    innerDemonReduced: innerDemonReduction
  })

  await supabase
    .from('players')
    .update({
      inner_demon: player.inner_demon - innerDemonReduction,
      spirit_stones: player.spirit_stones - stabilizeCost,
      history
    })
    .eq('id', player.id)

  revalidatePath('/cultivation')

  return {
    success: true,
    innerDemonReduced: innerDemonReduction,
    message: '境界稳固完成,心魔减少'
  }
}