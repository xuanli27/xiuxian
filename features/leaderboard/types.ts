import type { Season, LeaderboardEntry as DBLeaderboardEntry } from '@/types/database'
import type { Rank } from '@/types/database'

/**
 * 排行榜系统类型定义
 */

// 排行榜类型
export type LeaderboardCategory = 'REALM' | 'POWER' | 'WEALTH' | 'CONTRIBUTION'

// 排行榜类别枚举（用于组件）
export const LeaderboardCategory = {
  REALM: 'REALM' as LeaderboardCategory,
  POWER: 'POWER' as LeaderboardCategory,
  WEALTH: 'WEALTH' as LeaderboardCategory,
  CONTRIBUTION: 'CONTRIBUTION' as LeaderboardCategory,
} as const

// 导出类型
export type { Season, Rank }

// 排行榜条目（扩展数据库模型，添加排名位置）
export type LeaderboardEntry = DBLeaderboardEntry & {
  ranking: number  // 排名位置（1, 2, 3...）
  rankChange?: number
}

// 排行榜响应
export type LeaderboardResponse = {
  category: LeaderboardCategory
  season: Season
  entries: LeaderboardEntry[]
  currentPage: number
  totalPages: number
  totalEntries: number
}

// 排行榜奖励
export type LeaderboardReward = {
  rank?: number
  rankRange?: { min: number; max: number }
  rewards: {
    spiritStones: number
    items?: Array<{ itemId: string; quantity: number }>
    title?: string
  }
}