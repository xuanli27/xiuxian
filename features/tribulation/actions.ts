'use server'

import { getTribulationDashboardData as getTribulationDashboardDataQuery } from './queries'
import { createServerSupabaseClient } from '@/lib/db/supabase'
import { getCurrentUserId } from '@/lib/auth/server'
import { revalidatePath } from 'next/cache'
import type { TribulationDashboard } from './types'

/**
 * Server Action: 获取渡劫面板数据
 */
export async function getTribulationDashboardData(): Promise<TribulationDashboard> {
  const userId = await getCurrentUserId()
  const supabase = await createServerSupabaseClient()
  
  const { data: player } = await supabase
    .from('players')
    .select('id')
    .eq('user_id', userId)
    .single()
  
  if (!player) {
    return {
      needsTribulation: false,
      preparation: {
        recommendedHealth: 1000,
        recommendedDefense: 100,
        recommendedItems: [],
        successChance: 0,
        risks: []
      },
      history: [],
      stats: {
        totalAttempts: 0,
        successfulAttempts: 0,
        failedAttempts: 0,
        successRate: 0,
        highestWaveReached: 0,
        averageWavesCompleted: 0
      }
    }
  }
  
  return getTribulationDashboardDataQuery(player.id)
}

/**
 * Server Action: 开始渡劫
 */
export async function startTribulation(input: { playerId: number }) {
  const userId = await getCurrentUserId()
  const supabase = await createServerSupabaseClient()
  
  const { data: player } = await supabase
    .from('players')
    .select('id')
    .eq('user_id', userId)
    .eq('id', input.playerId)
    .single()
  
  if (!player) {
    throw new Error('玩家不存在')
  }
  
  // TODO: 实现渡劫逻辑
  
  revalidatePath('/tribulation')
  return {
    success: true,
    message: '渡劫成功',
    totalWaves: 9,
    wavesCompleted: 9
  }
}