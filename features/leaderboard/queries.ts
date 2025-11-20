import { cache } from 'react'
import { createServerSupabaseClient } from '@/lib/db/supabase'
import type { LeaderboardCategory, LeaderboardResponse, Season } from './types'
import type { LeaderboardEntry as DBLeaderboardEntry } from '@/types/database'

// 动态导入 Redis（仅在服务端）
const getRedis = async () => {
  if (typeof window !== 'undefined') return { redis: null, isRedisEnabled: () => false }
  const { redis, isRedisEnabled } = await import('@/lib/db/redis')
  return { redis, isRedisEnabled }
}

async function getActiveSeason(): Promise<Season> {
  const supabase = await createServerSupabaseClient()
  
  const { data: season, error } = await supabase
    .from('seasons')
    .select('*')
    .eq('is_active', true)
    .single()

  if (!error && season) {
    return season as Season
  }

  // 创建新赛季
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth() + 1
  const quarter = Math.ceil(month / 3)
  const id = `${year}-Q${quarter}`
  
  const { data: newSeason, error: createError } = await supabase
    .from('seasons')
    .insert({
      id,
      name: `${year}年第${quarter}季度`,
      start_date: new Date(year, (quarter - 1) * 3, 1).toISOString(),
      end_date: new Date(year, quarter * 3, 0).toISOString(),
      is_active: true,
    })
    .select()
    .single()

  if (createError) {
    throw new Error(`创建赛季失败: ${createError.message}`)
  }

  return newSeason as Season
}

const LEADERBOARD_CACHE_TTL = 300 // 5 minutes

export const getLeaderboard = cache(async (
  category: LeaderboardCategory,
  page: number = 1,
  pageSize: number = 20
): Promise<LeaderboardResponse> => {
  const season = await getActiveSeason()
  const cacheKey = `leaderboard:${season.id}:${category}:${page}:${pageSize}`

  const { redis, isRedisEnabled } = await getRedis()
  if (isRedisEnabled() && redis) {
    try {
      const cached = await redis.get(cacheKey)
      if (cached) return JSON.parse(cached)
    } catch (error) {
      console.error('Redis read error:', error)
    }
  }

  const supabase = await createServerSupabaseClient()
  
  let orderColumn: string
  switch (category) {
    case 'REALM':
      orderColumn = 'realm_score'
      break
    case 'POWER':
      orderColumn = 'power_score'
      break
    case 'WEALTH':
      orderColumn = 'wealth_score'
      break
    case 'CONTRIBUTION':
      orderColumn = 'contribution_score'
      break
  }

  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  const [entriesResult, countResult] = await Promise.all([
    supabase
      .from('leaderboard')
      .select('*')
      .eq('season_id', season.id)
      .order(orderColumn, { ascending: false })
      .range(from, to),
    supabase
      .from('leaderboard')
      .select('*', { count: 'exact', head: true })
      .eq('season_id', season.id)
  ])

  if (entriesResult.error) {
    throw new Error(`查询排行榜失败: ${entriesResult.error.message}`)
  }

  const entries = entriesResult.data || []
  const totalEntries = countResult.count || 0
  const totalPages = Math.ceil(totalEntries / pageSize)

  const result = {
    category,
    season,
    entries: entries.map((entry, index) => ({
      ...entry,
      ranking: from + index + 1,
    })),
    currentPage: page,
    totalPages,
    totalEntries,
  }

  const { redis: redisWrite, isRedisEnabled: isEnabled } = await getRedis()
  if (isEnabled() && redisWrite) {
    try {
      await redisWrite.set(cacheKey, JSON.stringify(result), 'EX', LEADERBOARD_CACHE_TTL)
    } catch (error) {
      console.error('Redis write error:', error)
    }
  }

  return result as unknown as LeaderboardResponse
})

export const getPlayerRank = cache(async (
  playerId: number,
  category: LeaderboardCategory
): Promise<{ rank: number } | null> => {
  const season = await getActiveSeason()
  const supabase = await createServerSupabaseClient()
  
  const { data: entry, error } = await supabase
    .from('leaderboard')
    .select('*')
    .eq('player_id', playerId)
    .eq('season_id', season.id)
    .single()

  if (error || !entry) return null

  let scoreColumn: string
  let scoreValue: number
  switch (category) {
    case 'REALM':
      scoreColumn = 'realm_score'
      scoreValue = entry.realm_score
      break
    case 'POWER':
      scoreColumn = 'power_score'
      scoreValue = entry.power_score
      break
    case 'WEALTH':
      scoreColumn = 'wealth_score'
      scoreValue = entry.wealth_score
      break
    case 'CONTRIBUTION':
      scoreColumn = 'contribution_score'
      scoreValue = entry.contribution_score
      break
  }

  const { count, error: countError } = await supabase
    .from('leaderboard')
    .select('*', { count: 'exact', head: true })
    .eq('season_id', season.id)
    .gt(scoreColumn, scoreValue)

  if (countError) {
    console.error('查询排名失败:', countError)
    return null
  }

  return { rank: (count || 0) + 1 }
})