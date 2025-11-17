'use server'

import { prisma } from '@/lib/db/prisma'
import { getCurrentUserId } from '@/lib/auth/guards'
import { revalidatePath } from 'next/cache'
import { 
  createTaskSchema,
  acceptTaskSchema,
  completeTaskSchema,
  generateTaskSchema
} from './schemas'
import { generateTask, generateMultipleTasks } from '@/lib/ai/generators/task-generator'
import { calculateTaskRewards } from '@/lib/game/formulas'

/**
 * Task Server Actions
 */

/**
 * 创建任务
 */
export async function createTask(input: {
  title: string
  description: string
  type: 'DAILY' | 'WEEKLY' | 'ACHIEVEMENT'
  difficulty: 'EASY' | 'MEDIUM' | 'HARD'
  rewards: { experience: number; currency: number; items?: string[] }
}) {
  const userId = await getCurrentUserId()
  
  // 验证输入
  const validated = createTaskSchema.parse(input)
  
  // 获取玩家
  const player = await prisma.player.findUnique({
    where: { userId }
  })
  
  if (!player) {
    throw new Error('玩家不存在,请先创建角色')
  }
  
  // 创建任务
  const task = await prisma.task.create({
    data: {
      playerId: player.id,
      title: validated.title,
      description: validated.description,
      type: validated.type,
      difficulty: validated.difficulty,
      status: 'PENDING',
      rewards: validated.rewards,
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
  
  // 获取玩家
  const player = await prisma.player.findUnique({
    where: { userId }
  })
  
  if (!player) {
    throw new Error('玩家不存在')
  }
  
  // 更新任务状态
  const task = await prisma.task.update({
    where: { id: taskId, playerId: player.id },
    data: {
      status: 'IN_PROGRESS',
      acceptedAt: new Date()
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
  
  // 获取玩家
  const player = await prisma.player.findUnique({
    where: { userId }
  })
  
  if (!player) {
    throw new Error('玩家不存在')
  }
  
  // 获取任务
  const task = await prisma.task.findUnique({
    where: { id: taskId, playerId: player.id }
  })
  
  if (!task) {
    throw new Error('任务不存在')
  }
  
  if (task.status !== 'IN_PROGRESS') {
    throw new Error('任务状态错误')
  }
  
  // 更新任务状态和玩家奖励
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
        experience: {
          increment: task.rewards.experience
        },
        currency: {
          increment: task.rewards.currency
        }
      }
    })
  ])
  
  revalidatePath('/tasks')
  revalidatePath('/dashboard')
  return { 
    success: true, 
    task: updatedTask,
    player: updatedPlayer,
    rewards: task.rewards
  }
}

/**
 * AI生成任务
 */
export async function generateAITask(context: string) {
  const userId = await getCurrentUserId()
  
  // 验证输入
  const validated = generateTaskSchema.parse({ context, count: 1 })
  
  // 获取玩家
  const player = await prisma.player.findUnique({
    where: { userId }
  })
  
  if (!player) {
    throw new Error('玩家不存在')
  }
  
  try {
    // 调用AI生成任务
    const generatedTask = await generateTask(validated.context)
    
    // 创建任务
    const task = await prisma.task.create({
      data: {
        playerId: player.id,
        title: generatedTask.title,
        description: generatedTask.description,
        type: generatedTask.type,
        difficulty: generatedTask.difficulty,
        status: 'PENDING',
        rewards: generatedTask.rewards,
      }
    })
    
    revalidatePath('/tasks')
    return { success: true, task }
  } catch (error) {
    console.error('Failed to generate AI task:', error)
    throw new Error('AI任务生成失败,请重试')
  }
}

/**
 * 批量生成AI任务
 */
export async function generateMultipleAITasks(contexts: string[], count: number = 3) {
  const userId = await getCurrentUserId()
  
  // 获取玩家
  const player = await prisma.player.findUnique({
    where: { userId }
  })
  
  if (!player) {
    throw new Error('玩家不存在')
  }
  
  try {
    // 调用AI批量生成任务
    const generatedTasks = await generateMultipleTasks(contexts, count)
    
    // 批量创建任务
    const tasks = await prisma.task.createMany({
      data: generatedTasks.map(task => ({
        playerId: player.id,
        title: task.title,
        description: task.description,
        type: task.type,
        difficulty: task.difficulty,
        status: 'PENDING' as const,
        rewards: task.rewards,
      }))
    })
    
    revalidatePath('/tasks')
    return { success: true, count: tasks.count }
  } catch (error) {
    console.error('Failed to generate multiple AI tasks:', error)
    throw new Error('批量AI任务生成失败,请重试')
  }
}

/**
 * 放弃任务
 */
export async function abandonTask(taskId: string) {
  const userId = await getCurrentUserId()
  
  // 获取玩家
  const player = await prisma.player.findUnique({
    where: { userId }
  })
  
  if (!player) {
    throw new Error('玩家不存在')
  }
  
  // 更新任务状态
  const task = await prisma.task.update({
    where: { id: taskId, playerId: player.id },
    data: {
      status: 'FAILED'
    }
  })
  
  revalidatePath('/tasks')
  return { success: true, task }
}