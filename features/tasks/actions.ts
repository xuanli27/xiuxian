'use server'

import { prisma } from '@/lib/db/prisma'
import { getCurrentUserId } from '@/lib/auth/guards'
import { revalidatePath } from 'next/cache'
import { createTaskSchema } from './schemas'
import { getRandomMoyuTasks } from '@/data/tasks/moyu-tasks'

/**
 * 创建任务
 */
export async function createTask(input: {
  title: string
  description: string
  type: 'LINK' | 'GAME' | 'BATTLE'
  difficulty: 'EASY' | 'MEDIUM' | 'HARD'
  category: 'DAILY' | 'WEEKLY' | 'ACHIEVEMENT'
  rewardQi: number
  rewardContribution: number
  rewardStones: number
  duration: number
  url?: string
  quiz?: any
  enemy?: any
}) {
  const userId = await getCurrentUserId()
  const validated = createTaskSchema.parse(input)
  
  const player = await prisma.player.findUnique({
    where: { userId }
  })
  
  if (!player) {
    throw new Error('玩家不存在')
  }
  
  const task = await prisma.task.create({
    data: {
      playerId: player.id,
      ...validated,
      status: 'PENDING',
    }
  })
  
  revalidatePath('/tasks')
  return { success: true, task }
}

/**
 * 接取任务
 */
export async function acceptTask(taskId: string) {
  const userId = await getCurrentUserId()
  
  const player = await prisma.player.findUnique({
    where: { userId }
  })
  
  if (!player) {
    throw new Error('玩家不存在')
  }
  
  const task = await prisma.task.update({
    where: { id: taskId },
    data: {
      status: 'IN_PROGRESS',
      startedAt: new Date()
    }
  })
  
  revalidatePath('/tasks')
  return { success: true, task }
}

/**
 * 完成任务
 */
export async function completeTask(taskId: string) {
  const userId = await getCurrentUserId()
  
  const player = await prisma.player.findUnique({
    where: { userId }
  })
  
  if (!player) {
    throw new Error('玩家不存在')
  }
  
  const task = await prisma.task.findUnique({
    where: { id: taskId, playerId: player.id }
  })
  
  if (!task) {
    throw new Error('任务不存在')
  }
  
  if (task.status !== 'IN_PROGRESS') {
    throw new Error('任务状态错误')
  }
  
  const [updatedTask, updatedPlayer] = await prisma.$transaction([
    prisma.task.update({
      where: { id: taskId },
      data: {
        status: 'COMPLETED',
        completedAt: new Date()
      }
    }),
    prisma.player.update({
      where: { id: player.id },
      data: {
        qi: { increment: task.rewardQi },
        contribution: { increment: task.rewardContribution },
        spiritStones: { increment: task.rewardStones }
      }
    })
  ])
  
  revalidatePath('/tasks')
  revalidatePath('/dashboard')
  return { 
    success: true, 
    task: updatedTask,
    player: updatedPlayer,
    rewards: {
      qi: task.rewardQi,
      contribution: task.rewardContribution,
      stones: task.rewardStones
    }
  }
}

/**
 * 放弃任务
 */
export async function abandonTask(taskId: string) {
  const userId = await getCurrentUserId()
  
  const player = await prisma.player.findUnique({
    where: { userId }
  })
  
  if (!player) {
    throw new Error('玩家不存在')
  }
  
  const task = await prisma.task.update({
    where: { id: taskId, playerId: player.id },
    data: {
      status: 'FAILED'
    }
  })
  
  revalidatePath('/tasks')
  return { success: true, task }
}

/**
 * AI生成任务（简化版，暂时返回预设任务）
 */
export async function generateMultipleAITasks(contexts: string[], count: number = 3) {
  const userId = await getCurrentUserId()
  
  const player = await prisma.player.findUnique({
    where: { userId }
  })
  
  if (!player) {
    throw new Error('玩家不存在')
  }
  
  // 从摸鱼任务库中随机获取任务
  const moyuTasks = getRandomMoyuTasks(count)
  
  const tasksToCreate = moyuTasks.map(template => ({
    ...template,
    playerId: player.id,
    status: 'PENDING' as const,
  }))
  
  const result = await prisma.task.createMany({
    data: tasksToCreate
  })
  
  revalidatePath('/tasks')
  return { success: true, count: result.count }
}