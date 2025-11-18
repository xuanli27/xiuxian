'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/db/prisma';
import { processEventChoiceSchema } from './schemas';
import type { ProcessEventChoiceInput, EventResult } from './types';
import type { Player } from '@prisma/client';

export async function processEventChoice(input: ProcessEventChoiceInput) {
  const validated = processEventChoiceSchema.parse(input);
  const { playerId, eventId, choiceId } = validated;

  // 获取玩家当前状态
  const player = await prisma.player.findUnique({
    where: { id: playerId },
  });

  if (!player) {
    throw new Error('玩家不存在');
  }

  // TODO: 从缓存或数据库获取当前事件
  // 这里暂时返回模拟结果，后续会与AI集成
  const mockResult: EventResult = {
    playerUpdates: {
      qi: player.qi + 10,
      spiritStones: player.spiritStones + 5,
    },
    narration: '你做出了选择，获得了一些修为和灵石。',
  };

  // 更新玩家状态
  await prisma.player.update({
    where: { id: playerId },
    data: {
      qi: mockResult.playerUpdates.qi,
      spiritStones: mockResult.playerUpdates.spiritStones,
    },
  });

  // 记录事件日志
  await prisma.eventLog.create({
    data: {
      playerId,
      eventId,
      eventType: 'MINOR',
      title: '测试事件',
      description: '这是一个测试事件',
      choiceId,
      choiceText: '测试选择',
      result: mockResult as any,
    },
  });

  revalidatePath('/game');
  
  return {
    success: true,
    result: mockResult,
  };
}

export async function getPlayerEventHistory(playerId: number, limit = 10) {
  const logs = await prisma.eventLog.findMany({
    where: { playerId },
    orderBy: { createdAt: 'desc' },
    take: limit,
  });

  return logs;
}

export async function getPlayerStatusEffects(playerId: number) {
  const now = new Date();
  
  const effects = await prisma.playerStatusEffect.findMany({
    where: {
      playerId,
      OR: [
        { expiresAt: null },
        { expiresAt: { gt: now } },
      ],
    },
    orderBy: { startedAt: 'desc' },
  });

  return effects;
}