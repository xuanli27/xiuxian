import { SectRank } from '@prisma/client'

/**
 * 门派系统类型定义
 */

// 门派职位信息
export type SectPosition = {
  rank: SectRank
  name: string
  requiredContribution: number
  benefits: string[]
  permissions: string[]
}

// 门派贡献记录
export type ContributionRecord = {
  id: string
  playerId: number
  playerName: string
  amount: number
  type: 'TASK' | 'DONATION' | 'MISSION' | 'EVENT'
  description: string
  createdAt: Date
}

// 门派任务
export type SectMission = {
  id: string
  title: string
  description: string
  difficulty: 'EASY' | 'MEDIUM' | 'HARD' | 'EXTREME'
  requiredRank: SectRank
  rewards: {
    contribution: number
    spiritStones: number
    items?: Array<{ itemId: string; quantity: number }>
  }
  status: 'AVAILABLE' | 'IN_PROGRESS' | 'COMPLETED'
  startedAt?: Date
  completedAt?: Date
}

// 门派商店物品
export type SectShopItem = {
  id: string
  name: string
  description: string
  price: number  // 贡献点
  requiredRank: SectRank
  stock: number  // -1表示无限
  category: 'PILL' | 'EQUIPMENT' | 'MATERIAL' | 'SKILL'
}

// 门派信息
export type SectInfo = {
  name: string
  description: string
  totalMembers: number
  averageLevel: number
  totalContribution: number
  ranking: number
}

// 门派成员
export type SectMember = {
  playerId: number
  playerName: string
  rank: SectRank
  contribution: number
  joinedAt: Date
  lastActiveAt: Date
}

// 晋升结果
export type PromotionResult = {
  success: boolean
  rankBefore: SectRank
  rankAfter: SectRank | null
  message: string
  requirements?: {
    contributionNeeded: number
    contributionCurrent: number
  }
}

// 门派统计
export type SectStats = {
  totalContribution: number
  contributionRank: number
  tasksCompleted: number
  donationsTotal: number
  currentStreak: number
}