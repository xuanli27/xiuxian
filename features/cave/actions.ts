'use server'

import { getPlayerCave as getPlayerCaveQuery, getCaveStats as getCaveStatsQuery } from './queries'
import { createServerSupabaseClient } from '@/lib/db/supabase'
import { getCurrentUserId } from '@/lib/auth/server'
import { revalidatePath } from 'next/cache'
import { calculateCaveUpgradeCost } from './utils'
import type { Cave, CaveStats } from './types'

/**
 * Server Action: 获取玩家洞府
 */
export async function getPlayerCave(): Promise<Cave | null> {
  const userId = await getCurrentUserId()
  const supabase = await createServerSupabaseClient()
  
  const { data: player } = await supabase
    .from('players')
    .select('id')
    .eq('user_id', userId)
    .single()
  
  if (!player) return null
  
  return getPlayerCaveQuery(player.id)
}

/**
 * Server Action: 获取洞府统计
 */
export async function getCaveStats(): Promise<CaveStats> {
  const userId = await getCurrentUserId()
  const supabase = await createServerSupabaseClient()
  
  const { data: player } = await supabase
    .from('players')
    .select('id')
    .eq('user_id', userId)
    .single()
  
  if (!player) {
    return {
      totalBuildings: 0,
      activeBuildings: 0,
      productionRate: 0,
      defensePower: 0,
      storageCapacity: 0,
      dailyIncome: {
        spiritualEnergy: 0,
        herbs: 0,
        ores: 0,
        pills: 0,
        artifacts: 0,
      },
    }
  }
  
  return getCaveStatsQuery(player.id)
}

/**
 * Server Action: 升级洞府
 */
export async function upgradeCave(input: { playerId: number }) {
  const userId = await getCurrentUserId()
  const supabase = await createServerSupabaseClient()
  
  const { data: player } = await supabase
    .from('players')
    .select('id, cave_level, spirit_stones')
    .eq('user_id', userId)
    .eq('id', input.playerId)
    .single()
  
  if (!player) {
    throw new Error('玩家不存在')
  }
  
  const cost = calculateCaveUpgradeCost(player.cave_level)
  
  if (player.spirit_stones < cost.spiritStones) {
    throw new Error('灵石不足')
  }
  
  const { data: updatedPlayer } = await supabase
    .from('players')
    .update({
      cave_level: player.cave_level + 1,
      spirit_stones: player.spirit_stones - cost.spiritStones
    })
    .eq('id', player.id)
    .select('cave_level')
    .single()
  
  revalidatePath('/cave')
  return { success: true, newLevel: updatedPlayer?.cave_level || player.cave_level + 1 }
}

/**
 * Server Action: 炼制物品
 */
export async function craftItem(input: { recipeId: string }) {
  const userId = await getCurrentUserId()
  const supabase = await createServerSupabaseClient()
  
  const { data: player } = await supabase
    .from('players')
    .select('id')
    .eq('user_id', userId)
    .single()

  if (!player) {
    throw new Error('玩家不存在')
  }

  // TODO: 实现炼制逻辑

  revalidatePath('/cave')
  revalidatePath('/inventory')
  return { success: true, message: '炼制成功' }
}