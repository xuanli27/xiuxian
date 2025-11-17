import { z } from 'zod'
import { LeaderboardCategory } from './types'

/**
 * 排行榜系统数据验证Schema
 */

// 获取排行榜
export const getLeaderboardSchema = z.object({
  category: z.nativeEnum(LeaderboardCategory, {
    errorMap: () => ({ message: '无效的排行榜类型' })
  }),
  season: z.string().optional(),
  page: z.number().int().min(1).default(1),
  pageSize: z.number().int().min(1).max(100).default(20),
})

// 获取玩家排名
export const getPlayerRankSchema = z.object({
  playerId: z.number().int().positive(),
  category: z.nativeEnum(LeaderboardCategory),
  season: z.string().optional(),
})

// 领取排行榜奖励
export const claimLeaderboardRewardSchema = z.object({
  season: z.string(),
  category: z.nativeEnum(LeaderboardCategory),
})

// 类型推断
export type GetLeaderboardInput = z.infer<typeof getLeaderboardSchema>
export type GetPlayerRankInput = z.infer<typeof getPlayerRankSchema>
export type ClaimLeaderboardRewardInput = z.infer<typeof claimLeaderboardRewardSchema>