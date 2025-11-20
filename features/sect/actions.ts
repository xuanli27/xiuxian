'use server'

import {
  getSectInfo as getSectInfoQuery,
  getPlayerSectStats as getPlayerSectStatsQuery,
  getSectPositions as getSectPositionsQuery
} from './queries'
import { createServerSupabaseClient } from '@/lib/db/supabase'
import { getCurrentUserId } from '@/lib/auth/server'
import { revalidatePath } from 'next/cache'
import type { SectInfo, PlayerSectStats, SectPosition } from './types'

/**
 * Server Action: 获取宗门信息
 */
export async function getSectInfo(): Promise<SectInfo> {
  return getSectInfoQuery()
}

/**
 * Server Action: 获取玩家宗门统计
 */
export async function getPlayerSectStats(): Promise<PlayerSectStats> {
  const userId = await getCurrentUserId()
  const supabase = await createServerSupabaseClient()
  
  const { data: player } = await supabase
    .from('players')
    .select('id')
    .eq('user_id', userId)
    .single()
  
  if (!player) {
    return {
      totalContribution: 0,
      rank: 'OUTER',
      joinedAt: new Date(),
    }
  }
  
  return getPlayerSectStatsQuery(player.id)
}

/**
 * Server Action: 获取宗门职位列表
 */
export async function getSectPositions(): Promise<SectPosition[]> {
  return getSectPositionsQuery()
}

/**
 * Server Action: 申请晋升
 */
export async function requestPromotion(input: { playerId: number }) {
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
  
  // TODO: 实现晋升逻辑
  
  revalidatePath('/sect')
  return { success: true, message: '晋升申请已提交' }
}

/**
 * Server Action: 购买物品
 */
export async function purchaseItem(_itemId: string) {
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
  
  // TODO: 实现购买逻辑
  
  revalidatePath('/sect')
  return { success: true, message: '购买成功' }
}