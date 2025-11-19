'use server'

import { getLeaderboard as getLeaderboardQuery } from './queries'
import type { LeaderboardCategory, LeaderboardResponse } from './types'

/**
 * Server Action: 获取排行榜数据
 */
export async function getLeaderboard(
  category: LeaderboardCategory,
  page: number = 1,
  pageSize: number = 20
): Promise<LeaderboardResponse> {
  return getLeaderboardQuery(category, page, pageSize)
}