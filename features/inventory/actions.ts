'use server'

import { getPlayerInventory as getPlayerInventoryQuery } from './queries'
import { createServerSupabaseClient } from '@/lib/db/supabase'
import { getCurrentUserId } from '@/lib/auth/server'
import { revalidatePath } from 'next/cache'
import type { InventoryItem } from './types'

/**
 * Server Action: 获取玩家背包
 */
export async function getPlayerInventory(): Promise<InventoryItem[]> {
  const userId = await getCurrentUserId()
  const supabase = await createServerSupabaseClient()
  
  const { data: player } = await supabase
    .from('players')
    .select('id')
    .eq('user_id', userId)
    .single()
  
  if (!player) return []
  
  return getPlayerInventoryQuery(player.id)
}

/**
 * Server Action: 使用物品
 */
export async function useItem(input: { itemId: string }) {
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
  
  // TODO: 实现物品使用逻辑
  
  revalidatePath('/inventory')
  return { success: true, message: '物品已使用' }
}

/**
 * Server Action: 装备物品
 */
export async function equipItem(input: { itemId: string; slot: string }) {
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
  
  // TODO: 实现装备逻辑
  
  revalidatePath('/inventory')
  return { success: true, message: '装备成功' }
}

/**
 * Server Action: 卸下装备
 */
export async function unequipItem(input: { slot: string }) {
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

  // TODO: 实现卸下装备逻辑

  revalidatePath('/inventory')
  return { success: true, message: '卸下成功' }
}