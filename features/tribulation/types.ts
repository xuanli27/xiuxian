/**
 * 渡劫系统类型定义
 */

// 境界枚举
export type Rank = 'MORTAL' | 'QI_REFINING' | 'FOUNDATION' | 'GOLDEN_CORE' | 'NASCENT_SOUL' | 'SPIRIT_SEVERING' | 'VOID_REFINING' | 'MAHAYANA' | 'IMMORTAL'

// 天劫类型
export enum TribulationType {
  THUNDER = 'THUNDER',       // 雷劫
  FIRE = 'FIRE',            // 火劫
  WIND = 'WIND',            // 风劫
  HEART_DEMON = 'HEART_DEMON', // 心魔劫
  HEAVENLY = 'HEAVENLY',    // 天道劫
}

// 劫难难度
export enum TribulationDifficulty {
  MINOR = 'MINOR',         // 小劫
  MAJOR = 'MAJOR',         // 大劫
  CATASTROPHIC = 'CATASTROPHIC', // 大天劫
}

// 渡劫状态
export enum TribulationStatus {
  PENDING = 'PENDING',     // 待渡劫
  IN_PROGRESS = 'IN_PROGRESS', // 渡劫中
  SUCCESS = 'SUCCESS',     // 成功
  FAILED = 'FAILED',       // 失败
}

// 渡劫信息
export type Tribulation = {
  id: string
  playerId: number
  type: TribulationType
  difficulty: TribulationDifficulty
  status: TribulationStatus
  
  // 境界相关
  realmBefore: Rank
  realmAfter: Rank | null
  
  // 劫难属性
  power: number           // 威力
  waves: number           // 劫难波数
  currentWave: number     // 当前波数
  
  // 玩家状态
  health: number
  maxHealth: number
  
  // 时间
  startedAt: Date
  completedAt?: Date
}

// 劫难波次
export type TribulationWave = {
  wave: number
  type: TribulationType
  power: number
  description: string
  damage: number
  effects?: TribulationEffect[]
}

// 劫难效果
export type TribulationEffect = {
  type: 'DAMAGE' | 'DEBUFF' | 'HEAL' | 'BUFF'
  value: number
  duration?: number
  description: string
}

// 渡劫选项
export type TribulationOption = {
  id: string
  text: string
  type: 'DEFEND' | 'ATTACK' | 'DODGE' | 'HEAL' | 'ITEM'
  successRate: number
  effect: string
  cost?: {
    health?: number
    qi?: number
    items?: Array<{ itemId: string; quantity: number }>
  }
}

// 渡劫结果
export type TribulationResult = {
  success: boolean
  realmBefore: Rank
  realmAfter: Rank | null
  survived: boolean
  wavesCompleted: number
  totalWaves: number
  rewards?: {
    experience: number
    spiritStones: number
    items?: Array<{ itemId: string; quantity: number }>
  }
  penalties?: {
    healthLost: number
    expLost: number
    innerDemonGained: number
  }
  message: string
}

// 渡劫准备
export type TribulationPreparation = {
  recommendedHealth: number
  recommendedDefense: number
  recommendedItems: string[]
  successChance: number
  risks: string[]
}

// 渡劫历史
export type TribulationHistory = {
  id: string
  playerId: number
  type: TribulationType
  difficulty: TribulationDifficulty
  success: boolean
  realmBefore: Rank
  realmAfter: Rank | null
  wavesCompleted: number
  totalWaves: number
  createdAt: Date
}

// 渡劫统计
export type TribulationStats = {
  totalAttempts: number
  successfulAttempts: number
  failedAttempts: number
  successRate: number
  highestWaveReached: number
  averageWavesCompleted: number
  lastAttemptAt?: Date
}

// 渡劫面板数据
export type TribulationDashboard = {
  needsTribulation: boolean
  preparation: TribulationPreparation
  history: TribulationHistory[]
  stats: TribulationStats
}