import { prisma } from '@/lib/db/prisma'
import { TaskType, TaskDifficulty, TaskStatus, TaskCategory } from '@prisma/client'
import { cache } from 'react'

/**
 * Task查询函数 (使用React cache优化)
 */

/**
 * 获取所有任务
 */
export const getAllTasks = cache(async (limit: number = 50) => {
  return await prisma.task.findMany({
    take: limit,
    orderBy: {
      createdAt: 'desc'
    }
  })
})

/**
 * 根据类型获取任务
 */
export const getTasksByType = cache(async (type: TaskType) => {
  return await prisma.task.findMany({
    where: { type },
    orderBy: {
      createdAt: 'desc'
    }
  })
})

/**
 * 根据难度获取任务
 */
export const getTasksByDifficulty = cache(async (difficulty: TaskDifficulty) => {
  return await prisma.task.findMany({
    where: { difficulty },
    orderBy: {
      createdAt: 'desc'
    }
  })
})

/**
 * 获取玩家的任务
 */
export const getPlayerTasks = cache(async (playerId: number) => {
  return await prisma.task.findMany({
    where: { playerId },
    orderBy: {
      createdAt: 'desc'
    }
  })
})

/**
 * 根据状态获取玩家任务
 */
export const getPlayerTasksByStatus = cache(async (
  playerId: number,
  status: TaskStatus
) => {
  return await prisma.task.findMany({
    where: {
      playerId,
      status
    },
    orderBy: {
      createdAt: 'desc'
    }
  })
})

/**
 * 获取任务详情
 */
export const getTaskById = cache(async (id: string) => {
  return await prisma.task.findUnique({
    where: { id },
    include: {
      player: {
        select: {
          name: true,
          rank: true,
        }
      }
    }
  })
})

/**
 * 获取每日任务
 */
export const getDailyTasks = cache(async (playerId: number) => {
  return await prisma.task.findMany({
    where: {
      playerId,
      category: TaskCategory.DAILY,
      status: { in: [TaskStatus.PENDING, TaskStatus.IN_PROGRESS] }
    },
    orderBy: {
      createdAt: 'desc'
    }
  })
})

/**
 * 获取每周任务
 */
export const getWeeklyTasks = cache(async (playerId: number) => {
  return await prisma.task.findMany({
    where: {
      playerId,
      category: TaskCategory.WEEKLY,
      status: { in: [TaskStatus.PENDING, TaskStatus.IN_PROGRESS] }
    },
    orderBy: {
      createdAt: 'desc'
    }
  })
})

/**
 * 获取成就任务
 */
export const getAchievementTasks = cache(async (playerId: number) => {
  return await prisma.task.findMany({
    where: {
      playerId,
      category: TaskCategory.ACHIEVEMENT
    },
    orderBy: {
      status: 'asc',
      createdAt: 'desc'
    }
  })
})