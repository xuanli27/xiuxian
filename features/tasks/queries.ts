import { prisma } from '@/lib/db/prisma'
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
export const getTasksByType = cache(async (type: string) => {
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
export const getTasksByDifficulty = cache(async (difficulty: string) => {
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
  status: string
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
          realm: true,
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
      type: 'DAILY',
      status: { in: ['PENDING', 'IN_PROGRESS'] }
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
      type: 'WEEKLY',
      status: { in: ['PENDING', 'IN_PROGRESS'] }
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
      type: 'ACHIEVEMENT'
    },
    orderBy: {
      status: 'asc',
      createdAt: 'desc'
    }
  })
})