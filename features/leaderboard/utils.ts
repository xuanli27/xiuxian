import { redis } from '@/lib/db/redis'
import type { LeaderboardCategory } from './types'

/**
 * 清除排行榜缓存
 */
export async function invalidateLeaderboardCache(
  category?: LeaderboardCategory,
  season?: string
) {
  // 如果 Redis 未配置，直接返回
  if (!redis) {
    return
  }

  try {
    if (category && season) {
      // 清除特定类别和赛季的所有分页缓存
      const pattern = `leaderboard:${category}:${season}:*`
      const keys = await redis.keys(pattern)
      if (keys.length > 0) {
        await redis.del(...keys)
      }
    } else if (category) {
      // 清除特定类别的所有缓存
      const pattern = `leaderboard:${category}:*`
      const keys = await redis.keys(pattern)
      if (keys.length > 0) {
        await redis.del(...keys)
      }
    } else {
      // 清除所有排行榜缓存
      const pattern = 'leaderboard:*'
      const keys = await redis.keys(pattern)
      if (keys.length > 0) {
        await redis.del(...keys)
      }
    }
  } catch (error) {
    console.error('Failed to invalidate leaderboard cache:', error)
  }
}