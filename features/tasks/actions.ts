'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/db/prisma';
import { getCurrentUserId } from '@/lib/auth/guards';
import { generateNextTask } from '@/lib/ai/generators/task-generator';
import { TaskStatus } from '@prisma/client';

export async function generateNewTaskForPlayer() {
  const userId = await getCurrentUserId();
  const player = await prisma.player.findUnique({ where: { userId } });

  if (!player) throw new Error('Player not found');

  const playerContext = {
    rank: player.rank,
    level: player.level,
    qi: player.qi,
    spiritStones: player.spiritStones,
    mindState: player.mindState,
    // Future: Add recent task history to context
  };

  const aiTask = await generateNextTask(playerContext);

  const newTask = await prisma.task.create({
    data: {
      playerId: player.id,
      ...aiTask,
    },
  });

  revalidatePath('/(game)/tasks');
  return { success: true, task: newTask };
}

export async function acceptTask(taskId: string) {
  const userId = await getCurrentUserId();
  const task = await prisma.task.findFirst({
    where: { id: taskId, player: { userId } },
  });

  if (!task || task.status !== TaskStatus.PENDING) {
    throw new Error('Task not found or cannot be accepted.');
  }

  await prisma.task.update({
    where: { id: taskId },
    data: {
      status: TaskStatus.IN_PROGRESS,
      startedAt: new Date(),
    },
  });

  revalidatePath('/(game)/tasks');
  return { success: true };
}

export async function completeTask(taskId: string) {
  const userId = await getCurrentUserId();
  const task = await prisma.task.findFirst({
    where: { id: taskId, player: { userId } },
  });

  if (!task || task.status !== TaskStatus.IN_PROGRESS) {
    throw new Error('Task not found or cannot be completed.');
  }
  
  // TODO: Add logic to verify task completion (e.g., check game result, URL visit)

  await prisma.$transaction([
    prisma.task.update({
      where: { id: taskId },
      data: {
        status: TaskStatus.COMPLETED,
        completedAt: new Date(),
      },
    }),
    prisma.player.update({
      where: { id: task.playerId },
      data: {
        qi: { increment: task.rewardQi },
        contribution: { increment: task.rewardContribution },
        spiritStones: { increment: task.rewardStones },
      },
    }),
  ]);

  revalidatePath('/(game)/tasks');
  revalidatePath('/(game)', 'layout'); // Update player stats in layout
  return { success: true };
}