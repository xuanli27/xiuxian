import { Task } from '@prisma/client'

/**
 * 任务相关类型定义
 */

export type TaskWithPlayer = Task & {
  player: {
    name: string
    realm: string
  }
}

export type TaskStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED'

export type TaskType = 'DAILY' | 'WEEKLY' | 'ACHIEVEMENT'

export type TaskDifficulty = 'EASY' | 'MEDIUM' | 'HARD'

export type TaskRewards = {
  experience: number
  currency: number
  items?: string[]
}

export type TaskProgress = {
  current: number
  target: number
  percentage: number
}

export type TaskCreate = {
  title: string
  description: string
  type: TaskType
  difficulty: TaskDifficulty
  rewards: TaskRewards
  requirements?: Record<string, any>
}