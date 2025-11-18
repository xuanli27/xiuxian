'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/db/prisma';
import { redis, isRedisEnabled } from '@/lib/db/redis';
import { aiGeneratedEventSchema } from './schemas';
import { generateNextEvent } from '@/lib/ai/generators/event-generator';
import { getCurrentUserId } from '@/lib/auth/guards';
import { z } from 'zod';
import type { Prisma } from '@prisma/client';

type AIEvent = z.infer<typeof aiGeneratedEventSchema>;

const EVENT_CACHE_TTL = 300; // 5 minutes in seconds

/**
 * Generates a new event for the current player, with caching.
 */
export async function generateNewEvent() {
  const userId = await getCurrentUserId();
  const player = await prisma.player.findUnique({
    where: { userId },
  });

  if (!player) throw new Error('Player not found');

  const cacheKey = `player:${player.id}:newEvent`;

  if (isRedisEnabled() && redis) {
    const cachedEvent = await redis.get(cacheKey);
    if (cachedEvent) {
      return { success: true, event: JSON.parse(cachedEvent) };
    }
  }

  const playerContext = {
    rank: player.rank,
    level: player.level,
    qi: player.qi,
    spiritStones: player.spiritStones,
    innerDemon: player.innerDemon,
    mindState: player.mindState,
  };

  const event = await generateNextEvent(playerContext);

  if (isRedisEnabled() && redis) {
    await redis.set(cacheKey, JSON.stringify(event), 'EX', EVENT_CACHE_TTL);
  }

  return { success: true, event };
}

/**
 * Processes a player's choice for a given event.
 */
export async function processEventChoice(input: { event: AIEvent, choiceId: string }) {
  const userId = await getCurrentUserId();
  const player = await prisma.player.findUnique({ where: { userId } });

  if (!player) throw new Error('Player not found');
  
  // When a choice is made, invalidate the event cache immediately
  const cacheKey = `player:${player.id}:newEvent`;
  if (isRedisEnabled() && redis) {
    await redis.del(cacheKey);
  }

  const { event, choiceId } = input;
  const choice = event.choices.find(c => c.id === choiceId);

  if (!choice) throw new Error('Invalid choice');

  let narration = `你选择了"${choice.text}"。`;
  const playerUpdates: Prisma.PlayerUpdateInput = {};
  const statusEffectsToCreate: Prisma.PlayerStatusEffectCreateManyInput[] = [];

  for (const outcome of choice.outcomes) {
    narration += ` ${outcome.description}`;
    switch (outcome.type) {
      case 'qi':
        playerUpdates.qi = { increment: outcome.value as number };
        break;
      case 'spiritStones':
        playerUpdates.spiritStones = { increment: outcome.value as number };
        break;
      case 'innerDemon':
        playerUpdates.innerDemon = { increment: outcome.value as number };
        break;
      case 'item':
        const currentInventory = (player.inventory as Record<string, number>) || {};
        const itemId = outcome.value as string;
        currentInventory[itemId] = (currentInventory[itemId] || 0) + 1;
        playerUpdates.inventory = currentInventory;
        break;
      case 'statusEffect':
        const effect = outcome.value as any;
        statusEffectsToCreate.push({
          playerId: player.id,
          effectId: effect.id,
          name: effect.name,
          description: effect.description,
          modifiers: effect.modifiers || {},
          expiresAt: effect.duration ? new Date(Date.now() + effect.duration * 1000) : null,
        });
        break;
    }
  }

  const [updatedPlayer] = await prisma.$transaction(async (tx) => {
    const playerUpdatePromise = tx.player.update({
      where: { id: player.id },
      data: playerUpdates,
    });

    if (statusEffectsToCreate.length > 0) {
      await tx.playerStatusEffect.createMany({
        data: statusEffectsToCreate,
      });
    }
    
    const eventLogPromise = tx.eventLog.create({
      data: {
        playerId: player.id,
        eventId: event.id,
        eventType: event.type,
        title: event.title,
        description: event.description,
        choiceId: choice.id,
        choiceText: choice.text,
        result: { narration, updates: playerUpdates, effects: statusEffectsToCreate } as any,
      },
    });

    return Promise.all([playerUpdatePromise, eventLogPromise]);
  });

  revalidatePath('/(game)', 'layout');

  return {
    success: true,
    result: {
      narration,
      playerUpdates: updatedPlayer,
    },
  };
}

export async function getPlayerEventHistory(playerId: number, limit = 10) {
  return prisma.eventLog.findMany({
    where: { playerId },
    orderBy: { createdAt: 'desc' },
    take: limit,
  });
}

export async function getPlayerStatusEffects(playerId: number) {
  const now = new Date();
  return prisma.playerStatusEffect.findMany({
    where: {
      playerId,
      OR: [{ expiresAt: null }, { expiresAt: { gt: now } }],
    },
    orderBy: { startedAt: 'desc' },
  });
}