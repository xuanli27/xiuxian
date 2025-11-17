import { Rank, SectRank } from '@prisma/client'

/**
 * 排行榜系统类型定义
 */

// 排行榜类型
export enum LeaderboardCategory {
  REALM = 'REALM',           // 境界排行
  POWER = 'POWER',           // 战力排行
  WEALTH = 'WEALTH',         // 财富排行
  CONTRIBUTION = 'CONTRIBUTION', // 贡献排行
  CAVE = 'CAVE',             // 洞府排行
  CULTIVATION = 'CULTIVATION', // 修炼速度排行
}

// 排行榜条目
export type LeaderboardEntry = {
  rank: number
  playerId: number
  playerName: string
  avatar?: string
  
  // 境界排行
  realm?: Rank
  level?: number
  
  // 战力排行
  power?: number
  
  // 财富排行
  wealth?: number
  
  // 贡献排行
  contribution?: number
  sectRank?: SectRank
  
  // 洞府排行
  caveLevel?: number
  cavePower?: number
  
  // 修炼速度
  cultivationSpeed?: number
  
  // 变化
  rankChange?: number  // 排名变化 (正数=上升, 负数=下降)
  
  updatedAt: Date
}

// 排行榜查询参数
export type LeaderboardQuery = {
  category: LeaderboardCategory
  season?: string
  page?: number
  pageSize?: number
}

// 排行榜响应
export type LeaderboardResponse = {
  category: LeaderboardCategory
  season: string
  entries: LeaderboardEntry[]
  currentPage: number
  totalPages: number
  totalEntries: number
  playerRank?: LeaderboardEntry  // 当前玩家的排名
}

// 赛季信息
export type Season = {
  id: string
  name: string
  startDate: Date
  endDate: Date
  active: boolean
}

// 排行榜奖励
export type LeaderboardReward = {
  rank: number
  rankRange?: { min: number; max: number }
  rewards: {
    spiritStones: number
    items?: Array<{ itemId: string; quantity: number }>
    title?: string
  }
}

// 排行榜统计
export type LeaderboardStats = {
  category: LeaderboardCategory
  highestRank: number
  currentRank: number
  bestSeason?: string
  averageRank: number
  totalSeasons: number
}