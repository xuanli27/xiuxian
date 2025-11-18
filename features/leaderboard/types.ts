import type { Leaderboard, Season as PrismaSeason } from '@prisma/client';

/**
 * 排行榜系统类型定义
 */

// 排行榜类型 (保持与旧版兼容，但后端现在使用 score 字段)
export type LeaderboardCategory = 'REALM' | 'POWER' | 'WEALTH' | 'CONTRIBUTION';

// 扩展 Prisma 生成的 Season 类型
export type Season = PrismaSeason;

// 排行榜条目，基于 Prisma 模型并添加了动态计算的排名
export type LeaderboardEntry = Leaderboard & {
  rank: number;
};

// 排行榜响应
export type LeaderboardResponse = {
  category: LeaderboardCategory;
  season: Season;
  entries: LeaderboardEntry[];
  currentPage: number;
  totalPages: number;
  totalEntries: number;
};

// 排行榜奖励
export type LeaderboardReward = {
  rank?: number;
  rankRange?: { min: number; max: number };
  rewards: {
    spiritStones: number;
    items?: Array<{ itemId: string; quantity: number }>;
    title?: string;
  };
};