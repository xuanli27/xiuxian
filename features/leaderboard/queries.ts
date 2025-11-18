import { cache } from 'react';
import { prisma } from '@/lib/db/prisma';
import { redis, isRedisEnabled } from '@/lib/db/redis';
import type { LeaderboardCategory, LeaderboardResponse, Season } from './types';
import { Rank, type Prisma } from '@prisma/client';

async function getActiveSeason(): Promise<Season> {
  let season = await prisma.season.findFirst({
    where: { isActive: true },
  });

  if (!season) {
    // This logic should ideally be in a cron job or a guarded admin action,
    // but for simplicity, we create it on-demand here.
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
  return season as Season;
}

const LEADERBOARD_CACHE_TTL = 300; // 5 minutes

export const getLeaderboard = cache(async (
  category: LeaderboardCategory,
  page: number = 1,
  pageSize: number = 20
): Promise<LeaderboardResponse> => {
  const season = await getActiveSeason();
  const cacheKey = `leaderboard:${season.id}:${category}:${page}:${pageSize}`;

  if (isRedisEnabled() && redis) {
    try {
      const cached = await redis.get(cacheKey);
      if (cached) return JSON.parse(cached);
    } catch (error) {
      console.error('Redis read error:', error);
    }
  }

  let orderBy: Prisma.LeaderboardOrderByWithRelationInput = {};
  switch (category) {
    case 'REALM':
      orderBy = { realmScore: 'desc' };
      break;
    case 'POWER':
      orderBy = { powerScore: 'desc' };
      break;
    case 'WEALTH':
      orderBy = { wealthScore: 'desc' };
      break;
    case 'CONTRIBUTION':
      orderBy = { contributionScore: 'desc' };
      break;
  }

  const [entries, totalEntries] = await prisma.$transaction([
    prisma.leaderboard.findMany({
      where: { seasonId: season.id },
      orderBy,
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.leaderboard.count({
      where: { seasonId: season.id },
    }),
  ]);

  const totalPages = Math.ceil(totalEntries / pageSize);

  const result = {
    category,
    season,
    entries: entries.map((entry, index) => ({
      ...entry,
      rank: (page - 1) * pageSize + index + 1,
    })),
    currentPage: page,
    totalPages,
    totalEntries,
  };

  if (isRedisEnabled() && redis) {
    try {
      await redis.set(cacheKey, JSON.stringify(result), 'EX', LEADERBOARD_CACHE_TTL);
    } catch (error) {
      console.error('Redis write error:', error);
    }
  }

  return result;
});

export const getPlayerRank = cache(async (
  playerId: number,
  category: LeaderboardCategory
): Promise<{ rank: number } | null> => {
  const season = await getActiveSeason();
  const entry = await prisma.leaderboard.findUnique({
    where: { playerId_seasonId: { playerId, seasonId: season.id } },
  });

  if (!entry) return null;

  let countQuery: Prisma.LeaderboardCountArgs = { where: { seasonId: season.id } };
  switch (category) {
    case 'REALM':
      countQuery.where!.realmScore = { gt: entry.realmScore };
      break;
    case 'POWER':
      countQuery.where!.powerScore = { gt: entry.powerScore };
      break;
    case 'WEALTH':
      countQuery.where!.wealthScore = { gt: entry.wealthScore };
      break;
    case 'CONTRIBUTION':
      countQuery.where!.contributionScore = { gt: entry.contributionScore };
      break;
  }

  const higherRankedCount = await prisma.leaderboard.count(countQuery);
  return { rank: higherRankedCount + 1 };
});