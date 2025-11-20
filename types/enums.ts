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

// 注意: Player 和 Task 类型应该从 @/types/database 导入
// 这里不再重复定义,避免类型冲突