/**
 * 游戏枚举类型定义
 * 替代 @prisma/client 的枚举类型
 */

// 境界
export type Rank = 
  | 'MORTAL' 
  | 'QI_REFINING' 
  | 'FOUNDATION' 
  | 'GOLDEN_CORE' 
  | 'NASCENT_SOUL' 
  | 'SPIRIT_SEVERING' 
  | 'VOID_REFINING' 
  | 'MAHAYANA' 
  | 'IMMORTAL'

// 宗门职位
export type SectRank = 
  | 'OUTER' 
  | 'INNER' 
  | 'ELITE' 
  | 'ELDER' 
  | 'MASTER'

// 灵根类型
export type SpiritRootType = 
  | 'HEAVEN' 
  | 'EARTH' 
  | 'HUMAN' 
  | 'WASTE'

// 心境状态
export type MindState = 
  | 'CALM' 
  | 'EXCITED' 
  | 'ANXIOUS' 
  | 'FOCUSED'

// 任务难度
export type TaskDifficulty = 
  | 'EASY' 
  | 'MEDIUM' 
  | 'HARD' 
  | 'EXTREME'

// 任务类型
export type TaskType = 
  | 'LINK' 
  | 'GAME' 
  | 'BATTLE'

// 任务状态
export type TaskStatus = 
  | 'AVAILABLE' 
  | 'IN_PROGRESS' 
  | 'COMPLETED' 
  | 'FAILED'

// 玩家类型 (从 database.ts 导入)
export type Player = {
  id: number
  user_id: string
  name: string
  avatar: string | null
  rank: string
  sect_rank: string
  level: number
  qi: number
  max_qi: number
  spirit_root: string
  mind_state: string
  spirit_stones: number
  inner_demon: number
  contribution: number
  cave_level: number
  inventory: any
  equipped: any
  materials: any
  history: any
  created_at: string
  updated_at: string
}

// 任务类型
export type Task = {
  id: number
  title: string
  description: string
  type: string
  difficulty: string
  status: string
  rewards: any
  requirements: any
  created_at: string
  updated_at: string
}