/**
 * 修炼系统类型定义
 */

// 境界枚举
export type Rank = 'MORTAL' | 'QI_REFINING' | 'FOUNDATION' | 'GOLDEN_CORE' | 'NASCENT_SOUL' | 'SPIRIT_SEVERING' | 'VOID_REFINING' | 'MAHAYANA' | 'IMMORTAL'

// 修炼记录
export type CultivationRecord = {
  id: string
  playerId: number
  type: 'MEDITATION' | 'BREAKTHROUGH' | 'RETREAT'
  realmBefore: Rank
  realmAfter: Rank | null
  expGained: number
  duration: number
  success: boolean
  createdAt: Date
}

// 突破结果
export type BreakthroughResult = {
  success: boolean
  realmBefore: Rank
  realmAfter: Rank | null
  expUsed: number
  message: string
}

// 修炼会话
export type CultivationSession = {
  startTime: Date
  endTime: Date | null
  type: 'MEDITATION' | 'RETREAT'
  expRate: number
  totalExp: number
  active: boolean
}

// 境界信息
export type RealmInfo = {
  rank: Rank
  name: string
  expRequired: number
  expCurrent: number
  breakthroughChance: number
  benefits: string[]
  cultivationRate?: number
}

// 修炼统计
export type CultivationStats = {
  totalSessions: number
  totalExpGained: number
  totalBreakthroughs: number
  successRate: number
  longestRetreat: number
  currentStreak: number
}