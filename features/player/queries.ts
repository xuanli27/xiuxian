import { createServerSupabaseClient } from '@/lib/db/supabase'
import { getCurrentUserId } from '@/lib/auth/supabase-auth'
import { cache } from 'react'
import type { Player } from '@/types/database'

/**
 * 获取当前登录用户的玩家信息
 */
export async function getCurrentPlayer(): Promise<Player | null> {
  const userId = await getCurrentUserId()
  const supabase = await createServerSupabaseClient()
  
  const { data, error } = await supabase
    .from('players')
    .select('*')
    .eq('user_id', userId)
    .single()
  
  if (error) {
    console.error('获取玩家失败:', error)
    return null
  }
  
  return data
}

/**
 * 根据用户ID获取玩家
 */
export const getPlayerByUserId = cache(async (userId: string): Promise<Player | null> => {
  const supabase = await createServerSupabaseClient()
  
  const { data, error } = await supabase
    .from('players')
    .select('*')
    .eq('user_id', userId)
    .single()
  
  if (error) {
    console.error('获取玩家失败:', error)
    return null
  }
  
  return data
})

/**
 * 根据玩家ID获取玩家
 */
export const getPlayerById = cache(async (id: number): Promise<Player | null> => {
  const supabase = await createServerSupabaseClient()
  
  const { data, error } = await supabase
    .from('players')
    .select('*')
    .eq('id', id)
    .single()
  
  if (error) {
    console.error('获取玩家失败:', error)
    return null
  }
  
  return data
})

/**
 * 获取所有玩家(用于排行榜)
 */
export const getAllPlayers = cache(async (limit: number = 100): Promise<Player[]> => {
  const supabase = await createServerSupabaseClient()
  
  const { data, error } = await supabase
    .from('players')
    .select('*')
    .order('level', { ascending: false })
    .limit(limit)
  
  if (error) {
    console.error('获取玩家列表失败:', error)
    return []
  }
  
  return data || []
})

/**
 * 根据境界筛选玩家
 */
export const getPlayersByRealm = cache(async (rank: string): Promise<Player[]> => {
  const supabase = await createServerSupabaseClient()
  
  const { data, error } = await supabase
    .from('players')
    .select('*')
    .eq('rank', rank)
    .order('level', { ascending: false })
  
  if (error) {
    console.error('获取玩家列表失败:', error)
    return []
  }
  
  return data || []
})

/**
 * 获取玩家统计数据
 */
export const getPlayerStats = cache(async (playerId: number) => {
  const supabase = await createServerSupabaseClient()
  
  const { data, error } = await supabase
    .from('players')
    .select('id, name, rank, level, qi, max_qi, spirit_root, spirit_stones, contribution')
    .eq('id', playerId)
    .single()
  
  if (error) {
    console.error('获取玩家统计失败:', error)
    return null
  }
  
  return {
    id: data.id,
    name: data.name,
    rank: data.rank,
    level: data.level,
    qi: data.qi,
    maxQi: data.max_qi,
    spiritRoot: data.spirit_root,
    spiritStones: data.spirit_stones,
    contribution: data.contribution,
  }
})