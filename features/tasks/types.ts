import type { Task, TaskType, TaskStatus, TaskDifficulty, TaskCategory } from '@prisma/client'

/**
 * 任务相关类型定义
 */

export type { Task, TaskType, TaskStatus, TaskDifficulty, TaskCategory }

export type TaskWithPlayer = Task & {
  player: {
    name: string
    rank: string
  }
}

export type TaskRewards = {
  qi: number
  contribution: number
  stones: number
}

export type TaskProgress = {
  current: number
  target: number
  percentage: number
}

export type TaskCreateInput = {
  title: string
  description: string
  type: TaskType
  difficulty: TaskDifficulty
  category: TaskCategory
  rewardQi: number
  rewardContribution: number
  rewardStones: number
  duration: number
  url?: string
  quiz?: any
  enemy?: any
}