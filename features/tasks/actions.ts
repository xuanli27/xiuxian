'use server'

import { getAvailableTasks as getAvailableTasksQuery } from './queries'
import { prisma } from '@/lib/db/prisma'
import { getCurrentUserId } from '@/lib/auth/guards'
import { revalidatePath } from 'next/cache'
import { generateStructuredData } from '@/lib/ai/client'
import { z } from 'zod'
import { TaskDifficulty, TaskType, TaskStatus } from '@prisma/client'

/**
 * Server Action: 获取可用任务列表
 */
export async function getAvailableTasks() {
  const userId = await getCurrentUserId()
  const player = await prisma.player.findUnique({
    where: { userId },
    select: { id: true }
  })
  
  if (!player) return []
  
  return getAvailableTasksQuery()
}

// Define the schema for task generation
const taskSchema = z.object({
  title: z.string(),
  description: z.string(),
  difficulty: z.enum(['EASY', 'MEDIUM', 'HARD', 'EXTREME']),
  type: z.enum(['COMBAT', 'GATHER', 'CRAFT', 'NEGOTIATE']),
  rewardSpiritStones: z.number(),
  rewardSectContribution: z.number(),
});

export async function generateNextTask() {
  const userId = await getCurrentUserId();
  const player = await prisma.player.findUnique({
    where: { userId }
  });

  if (!player) throw new Error("玩家不存在");

  // Use AI to generate a task based on player's level
  const prompt = `Generate a Xianxia (cultivation) themed task for a player at level ${player.level}.
  The task should be related to their current cultivation stage.
  Make it sound like a quest from a sect elder or a mysterious encounter.
  Difficulty should be appropriate for their level.`;

  const taskData = await generateStructuredData(taskSchema, prompt);

  const newTask = await prisma.task.create({
    data: {
      playerId: player.id,
      title: taskData.title,
      description: taskData.description,
      difficulty: taskData.difficulty as TaskDifficulty,
      type: taskData.type as TaskType,
      status: TaskStatus.PENDING,
      duration: 3600, // Default 1 hour in seconds
      rewardQi: 100,
      rewardStones: taskData.rewardSpiritStones,
      rewardContribution: taskData.rewardSectContribution
    }
  });

  revalidatePath('/(game)/tasks');
  return newTask;
}

export async function acceptTask(taskId: string) {
  const userId = await getCurrentUserId();
  const player = await prisma.player.findUnique({ where: { userId } });

  if (!player) throw new Error("玩家不存在");

  const task = await prisma.task.findUnique({ where: { id: taskId } });
  if (!task) throw new Error("任务不存在");
  if (task.playerId !== player.id) throw new Error("这不是你的任务");
  if (task.status !== TaskStatus.PENDING) throw new Error("任务状态不正确");

  await prisma.task.update({
    where: { id: taskId },
    data: { status: TaskStatus.IN_PROGRESS }
  });

  revalidatePath('/(game)/tasks');
  return { success: true };
}

export async function completeTask(taskId: string) {
  const userId = await getCurrentUserId();
  const player = await prisma.player.findUnique({ where: { userId } });

  if (!player) throw new Error("玩家不存在");

  const task = await prisma.task.findUnique({ where: { id: taskId } });
  if (!task) throw new Error("任务不存在");
  if (task.playerId !== player.id) throw new Error("这不是你的任务");
  if (task.status !== TaskStatus.IN_PROGRESS) throw new Error("任务状态不正确");

  // Update player resources
  await prisma.player.update({
    where: { id: player.id },
    data: {
      spiritStones: { increment: task.rewardStones },
      contribution: { increment: task.rewardContribution },
      qi: { increment: task.rewardQi }
    }
  });

  await prisma.task.update({
    where: { id: taskId },
    data: { status: TaskStatus.COMPLETED }
  });

  revalidatePath('/(game)/tasks');
  return {
    success: true,
    rewards: {
      spiritStones: task.rewardStones,
      sectContribution: task.rewardContribution
    }
  };
}

// Alias for backward compatibility if needed, or remove if not used
export const generateNewTaskForPlayer = generateNextTask;