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

  if (player?.sectMembership?.sect) {
    const sect = player.sectMembership.sect;
    const memberCount = await prisma.sectMember.count({
      where: { sectId: sect.id }
    });
    
    return {
      name: sect.name,
      description: sect.description,
      totalMembers: memberCount,
      averageLevel: 1,
      totalContribution: sect.reputation,
      ranking: 1
    };
  }
  
  return {
    name: '仙欲宗',
    description: '摸鱼修仙,法力无边',
    totalMembers: 1,
    averageLevel: 1,
    totalContribution: 0,
    ranking: 1
  };
});

export const getPlayerSectStats = cache(async (playerId: number) => {
  const player = await prisma.player.findUnique({
    where: { id: playerId }
  });

  if (!player) {
    return {
      totalContribution: 0,
      rank: 'OUTER' as const,
      joinedAt: new Date()
    };
  }

  return {
    totalContribution: player.contribution,
    rank: player.sectRank,
    joinedAt: new Date()
  };
});

export const getSectPositions = cache(async () => {
  // Return static config for now
  return Object.entries(SECT_CONFIG.ranks.names).map(([key, name]) => ({
    rank: key as any,
    name: name,
    requiredContribution: SECT_CONFIG.ranks.requirements[key as keyof typeof SECT_CONFIG.ranks.requirements] || 0,
    benefits: [],
    permissions: []
  }));
});