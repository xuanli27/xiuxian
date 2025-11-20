/**
 * JSON 字段的精确类型定义
 * 用于替代 any 类型
 */

import type { Rank, SpiritRootType, MindState, TaskType, TaskDifficulty, TaskStatus } from './enums'

// 物品类型
export interface InventoryItem {
  id: string
  name: string
  type: 'WEAPON' | 'ARMOR' | 'PILL' | 'MATERIAL' | 'TREASURE'
  rarity: 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY'
  quantity: number
  description?: string
  stats?: Record<string, number>
}

// 背包数据结构
export type InventoryData = Record<string, InventoryItem>

// 装备槽位
export interface EquippedData {
  weapon?: string
  armor?: string
  accessory?: string
  treasure?: string
}

// 材料数据
export interface MaterialData {
  [materialId: string]: {
    name: string
    quantity: number
    quality: 'LOW' | 'MEDIUM' | 'HIGH' | 'SUPREME'
  }
}

// 历史记录类型
export type HistoryRecord = 
  | CultivationRecord
  | BreakthroughRecord
  | StabilizeRecord
  | TaskRecord
  | EventRecord

export interface CultivationRecord {
  type: 'CULTIVATION'
  timestamp: string
  duration: number
  expGained: number
  method: 'MEDITATION' | 'RETREAT'
}

export interface BreakthroughRecord {
  type: 'BREAKTHROUGH'
  timestamp: string
  realmBefore: Rank
  realmAfter: Rank | null
  success: boolean
  expLost?: number
  successChance: number
}

export interface StabilizeRecord {
  type: 'STABILIZE'
  timestamp: string
  innerDemonReduced: number
}

export interface TaskRecord {
  type: 'TASK'
  timestamp: string
  taskId: string
  taskTitle: string
  result: 'SUCCESS' | 'FAILED'
  rewards?: {
    qi?: number
    contribution?: number
    stones?: number
  }
}

export interface EventRecord {
  type: 'EVENT'
  timestamp: string
  eventId: string
  eventTitle: string
  choiceId?: string
  result: Record<string, unknown>
}

// 任务相关类型
export interface QuizData {
  question: string
  options: string[]
  correctAnswer: number
  difficulty: TaskDifficulty
}

export interface EnemyData {
  name: string
  level: number
  rank: Rank
  hp: number
  attack: number
  defense: number
  skills?: string[]
}

// 状态效果修饰符
export interface StatusEffectModifiers {
  qi_gain?: number
  cultivation_speed?: number
  breakthrough_chance?: number
  spirit_stone_gain?: number
  [key: string]: number | undefined
}

// 事件结果
export interface EventOutcome {
  type: 'STAT_CHANGE' | 'ITEM_GAIN' | 'STATUS_EFFECT'
  value: StatChange | ItemGain | StatusEffect
}

export interface StatChange {
  stat: 'qi' | 'spirit_stones' | 'contribution' | 'inner_demon'
  amount: number
}

export interface ItemGain {
  itemId: string
  quantity: number
}

export interface StatusEffect {
  effectId: string
  name: string
  description: string
  duration: number
  modifiers: StatusEffectModifiers
}