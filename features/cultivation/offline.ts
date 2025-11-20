/**
 * 离线收益计算
 */

import { createServerSupabaseClient } from '@/lib/db/supabase'
import { calculateCultivationExp } from './utils'
import type { Rank, SpiritRootType } from '@/types/enums'

/**
 * 计算离线收益
 */
export async function calculateOfflineRewards(playerId: number) {
  const supabase = await createServerSupabaseClient()
  
  const { data: player } = await supabase
    .from('players')
    .select('last_login_time, spirit_root, rank, cave_level, inner_demon')
    .eq('id', playerId)
    .single()

  if (!player) {
    return {
      qi: 0,
      duration: 0,
      message: '玩家不存在'
    }
  }

  const now = new Date()
  const lastLogin = new Date(player.last_login_time)
  const diffMs = now.getTime() - lastLogin.getTime()
  const diffMinutes = Math.floor(diffMs / (1000 * 60))

  // 如果离线时间少于5分钟,不计算收益
  if (diffMinutes < 5) {
    return {
      qi: 0,
      duration: 0,
      message: '离线时间太短,无收益'
    }
  }

  // 最多计算24小时的离线收益
  const effectiveMinutes = Math.min(diffMinutes, 24 * 60)

  // 灵根品质影响
  const spiritRootQuality = getSpiritRootQuality(player.spirit_root as SpiritRootType)
  
  // 洞府加成
  const caveBonus = 1 + (player.cave_level - 1) * 0.1
  
  // 心魔惩罚
  const demonPenalty = player.inner_demon > 50 ? 0.5 : 1.0

  // 离线修炼速度是正常的50%
  const offlineRate = 0.5
  
  // 计算总收益
  const baseQi = calculateCultivationExp(
    effectiveMinutes,
    spiritRootQuality,
    1
  )
  
  const totalQi = Math.floor(baseQi * caveBonus * demonPenalty * offlineRate)

  return {
    qi: totalQi,
    duration: effectiveMinutes,
    message: generateOfflineMessage(effectiveMinutes, totalQi, player.rank as Rank)
  }
}

/**
 * 获取灵根品质系数
 */
function getSpiritRootQuality(spiritRoot: SpiritRootType): number {
  const qualities: Record<SpiritRootType, number> = {
    HEAVEN: 3,
    EARTH: 2,
    HUMAN: 1.5,
    WASTE: 1,
  }
  return qualities[spiritRoot] || 1
}

/**
 * 生成离线消息
 */
function generateOfflineMessage(minutes: number, qi: number, rank: Rank): string {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  
  let timeStr = ''
  if (hours > 0) {
    timeStr = mins > 0 ? `${hours}小时${mins}分钟` : `${hours}小时`
  } else {
    timeStr = `${mins}分钟`
  }

  const messages = [
    `离线${timeStr},自动修炼获得${qi}点灵气`,
    `摸鱼${timeStr},被动吸收灵气${qi}点`,
    `挂机${timeStr},灵气自然增长${qi}点`,
    `闭关${timeStr},修为提升${qi}点`,
  ]

  return messages[Math.floor(Math.random() * messages.length)]
}

/**
 * 应用离线收益
 */
export async function applyOfflineRewards(playerId: number) {
  const rewards = await calculateOfflineRewards(playerId)
  const supabase = await createServerSupabaseClient()
  
  if (rewards.qi > 0) {
    const { data: player } = await supabase
      .from('players')
      .select('qi, history')
      .eq('id', playerId)
      .single()
    
    if (player) {
      const history = Array.isArray(player.history) ? player.history : []
      history.push({
        type: 'OFFLINE_REWARD',
        timestamp: new Date().toISOString(),
        duration: rewards.duration,
        qi: rewards.qi,
        message: rewards.message
      })
      
      await supabase
        .from('players')
        .update({
          qi: player.qi + rewards.qi,
          last_login_time: new Date().toISOString(),
          history
        })
        .eq('id', playerId)
    }
  } else {
    // 只更新登录时间
    await supabase
      .from('players')
      .update({ last_login_time: new Date().toISOString() })
      .eq('id', playerId)
  }

  return rewards
}