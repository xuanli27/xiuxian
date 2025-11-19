import { prisma } from '@/lib/db/prisma';
import { cache } from 'react';
import { getCurrentUserId } from '@/lib/auth/guards';
import { TaskStatus } from '@prisma/client';

export const getAvailableTasks = cache(async () => {
  const userId = await getCurrentUserId();
  const player = await prisma.player.findUnique({
    where: { userId },
    select: { id: true }
  });

  if (!player) return [];

  return prisma.task.findMany({
    where: {
      playerId: player.id,
      status: {
        in: [TaskStatus.PENDING, TaskStatus.IN_PROGRESS, TaskStatus.COMPLETED]
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });
});

export const getTaskHistory = cache(async () => {
  // Placeholder for history
  return [];
});

export const getPlayerTasks = cache(async (playerId: number) => {
  return prisma.task.findMany({
    where: {
      playerId: playerId,
    },
    orderBy: {
      createdAt: 'desc'
    }
  });
});