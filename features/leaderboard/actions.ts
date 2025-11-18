'use server';

import { prisma } from '@/lib/db/prisma';
import { getCurrentUserId } from '@/lib/auth/guards';
import { Rank } from '@prisma/client';
import { revalidatePath } from 'next/cache';

async function getActiveSeason() {
  let season = await prisma.season.findFirst({
    where: { isActive: true },
  });

  // If no active season, create a new one (e.g., for the current quarter)
  if (!season) {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const quarter = Math.ceil(month / 3);
    const id = `${year}-Q${quarter}`;
    
    season = await prisma.season.create({
      data: {
        id,
        name: `${year}年第${quarter}季度`,
        startDate: new Date(year, (quarter - 1) * 3, 1),
        endDate: new Date(year, quarter * 3, 0),
        isActive: true,
      },
    });
  }
  return season;
}

function calculateRealmScore(rank: Rank, level: number): bigint {
  const rankOrder = Object.values(Rank);
  const rankValue = rankOrder.indexOf(rank);
  // Using BigInt for score calculation to avoid precision issues
  return BigInt(rankValue) * 1000000n + BigInt(level);
}

export async function updateLeaderboardForPlayer(playerId?: number) {
  let internalPlayerId = playerId;

  if (!internalPlayerId) {
    const userId = await getCurrentUserId();
    const player = await prisma.player.findUnique({ where: { userId }, select: { id: true } });
    if (!player) throw new Error('Player not found');
    internalPlayerId = player.id;
  }
  
  const player = await prisma.player.findUnique({ where: { id: internalPlayerId } });
  if (!player) throw new Error('Player not found');

  const season = await getActiveSeason();

  const realmScore = calculateRealmScore(player.rank, player.level);

  await prisma.leaderboard.upsert({
    where: {
      playerId_seasonId: {
        playerId: player.id,
        seasonId: season.id,
      },
    },
    update: {
      playerName: player.name,
      playerAvatar: player.avatar,
      rank: player.rank,
      level: player.level,
      realmScore: realmScore,
      powerScore: BigInt(player.contribution), // Temporary: using contribution
      wealthScore: BigInt(player.spiritStones),
      contributionScore: BigInt(player.contribution),
    },
    create: {
      playerId: player.id,
      seasonId: season.id,
      playerName: player.name,
      playerAvatar: player.avatar,
      rank: player.rank,
      level: player.level,
      realmScore: realmScore,
      powerScore: BigInt(player.contribution), // Temporary: using contribution
      wealthScore: BigInt(player.spiritStones),
      contributionScore: BigInt(player.contribution),
    },
  });

  revalidatePath('/(game)/leaderboard');
}