import type { Task as PrismaTask } from '@prisma/client'

/**
 * 游戏相关类型定义
 */

export interface Task extends PrismaTask {
  reward: {
    qi: number
    contribution: number
    stones: number
    materials?: string[]
  }
  completed: boolean
}