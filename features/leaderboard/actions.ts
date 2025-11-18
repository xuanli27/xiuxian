'use server'

import { prisma } from '@/lib/db/prisma'
import { getCurrentUserId } from '@/lib/auth/guards'
import { revalidatePath } from 'next/cache'
import {
  claimLeaderboardRewardSchema,
} from './schemas'
import { getLeaderboardRewards, getPlayerRank, getCurrentSeason } from './queries'
import { invalidateLeaderboardCache } from './utils'
import type { LeaderboardCategory } from './types'

/**
 * Leaderboard Server Actions
 */

/**
 * 领取排行榜奖励
 */
export async function claimLeaderboardReward(input: {
  season: string
  category: LeaderboardCategory
}) {
  const userId = await getCurrentUserId()
  
  // 验证输入
  const validated = claimLeaderboardRewardSchema.parse(input)
  
  // 获取玩家
  const player = await prisma.player.findUnique({
    where: { userId }
  })
  
  if (!player) {
    throw new Error('玩家不存在')
  }
  
  // 检查赛季是否已结束
  const currentSeason = await getCurrentSeason()
  if (validated.season === currentSeason.id) {
    throw new Error('当前赛季尚未结束,无法领取奖励')
  }
  
  // 检查是否已领取
  const history = Array.isArray(player.history) ? player.history : []
  const alreadyClaimed = history.some((r: any) =>
    r.type === 'LEADERBOARD_REWARD' &&
    r.season === validated.season &&
    r.category === validated.category
  )
  
  if (alreadyClaimed) {
    throw new Error('该赛季排行榜奖励已领取')
  }
  
  // 获取玩家排名
  const playerRank = await getPlayerRank(player.id, validated.category, validated.season)
  
  if (!playerRank) {
    throw new Error('未找到排名信息')
  }
  
  // 获取奖励配置
  const rewardConfigs = await getLeaderboardRewards(validated.category)
  
  // 查找对应的奖励
  let reward = null
  for (const config of rewardConfigs) {
    if (config.rank && config.rank === playerRank.rank) {
      reward = config.rewards
      break
    }
    if (config.rankRange) {
      const { min, max } = config.rankRange
      if (playerRank.rank >= min && playerRank.rank <= max) {
        reward = config.rewards
        break
      }
    }
  }
  
  if (!reward) {
    throw new Error('您的排名未进入奖励范围')
  }
  
  // 发放奖励
  await prisma.player.update({
    where: { id: player.id },
    data: {
      spiritStones: {
        increment: reward.spiritStones
      },
      history: {
        push: {
          type: 'LEADERBOARD_REWARD',
          timestamp: new Date().toISOString(),
          season: validated.season,
          category: validated.category,
          rank: playerRank.rank,
          spiritStones: reward.spiritStones,
          title: reward.title,
        }
      }
    }
  })
  
  // 清除相关缓存
  await invalidateLeaderboardCache(validated.category, validated.season)
  
  revalidatePath('/leaderboard')
  
  return {
    success: true,
    rank: playerRank.rank,
    reward,
    message: `领取成功!获得${reward.spiritStones}灵石${reward.title ? `和称号"${reward.title}"` : ''}`
  }
}

/**
 * 更新排行榜数据(定时任务调用)
 */
export async function updateLeaderboardData() {
  // 清除所有排行榜缓存
  await invalidateLeaderboardCache()
  
  revalidatePath('/leaderboard')
  
  return {
    success: true,
    message: '排行榜数据更新完成'
  }
}