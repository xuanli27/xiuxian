import { prisma } from '@/lib/db/prisma';
import { cache } from 'react';
import { getCurrentUserId } from '@/lib/auth/guards';
import { SECT_CONFIG } from '@/config/game';

export const getSectInfo = cache(async () => {
  // Placeholder for single sect logic, or get the player's sect
  const userId = await getCurrentUserId();
  const player = await prisma.player.findUnique({
    where: { userId },
    include: { sectMembership: { include: { sect: true } } }
  });

  return player?.sectMembership?.sect || {
    name: '仙欲宗',
    description: '摸鱼修仙，法力无边'
  };
});

export const getPlayerSectStats = cache(async (playerId: number) => {
  const player = await prisma.player.findUnique({
    where: { id: playerId }
  });

  if (!player) return null;

  return {
    totalContribution: player.contribution,
    currentRank: player.sectRank
  };
});

export const getSectPositions = cache(async () => {
  // Return static config for now
  return Object.entries(SECT_CONFIG.ranks.names).map(([key, name]) => ({
    rank: key,
    name: name,
    requiredContribution: SECT_CONFIG.ranks.requirements[key as keyof typeof SECT_CONFIG.ranks.requirements] || 0
  }));
});