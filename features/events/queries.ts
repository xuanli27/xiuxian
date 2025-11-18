'use server';

import { prisma } from '@/lib/db/prisma';

export async function getCurrentEvent(playerId: number) {
  // TODO: 实现获取当前事件的逻辑
  // 可以从缓存、会话或数据库中获取
  return null;
}

export async function getEventHistory(playerId: number, limit = 10) {
  return await prisma.eventLog.findMany({
    where: { playerId },
    orderBy: { createdAt: 'desc' },
    take: limit,
  });
}

export async function getActiveStatusEffects(playerId: number) {
  const now = new Date();
  
  return await prisma.playerStatusEffect.findMany({
    where: {
      playerId,
      OR: [
        { expiresAt: null },
        { expiresAt: { gt: now } },
      ],
    },
    orderBy: { startedAt: 'desc' },
  });
}