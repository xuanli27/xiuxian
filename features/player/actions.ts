'use server'

import { createServerSupabaseClient } from '@/lib/db/supabase'
import { getCurrentUserId } from '@/lib/auth/supabase-auth'
import { revalidatePath } from 'next/cache'
import {
  createPlayerSchema,
  updatePlayerSchema,
  addQiSchema,
  addSpiritStonesSchema
} from './schemas'

/**
 * 获取当前登录用户的玩家信息
 */
export async function getCurrentPlayer() {
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
 * 创建新玩家
 */
export async function createPlayer(input: { name: string; spiritRoot: string }) {
  const userId = await getCurrentUserId()
  const validated = createPlayerSchema.parse(input)
  const supabase = await createServerSupabaseClient()

  // 检查是否已有玩家
  const { data: existing } = await supabase
    .from('players')
    .select('id')
    .eq('user_id', userId)
    .single()

  if (existing) {
    throw new Error('玩家已存在')
  }

  // 创建玩家
  const { data: player, error } = await supabase
    .from('players')
    .insert({
      user_id: userId,
      name: validated.name,
      spirit_root: validated.spiritRoot,
      rank: 'QI_REFINING',
      level: 1,
      qi: 0,
      max_qi: 100,
      inner_demon: 0,
      contribution: 0,
      spirit_stones: 0,
      cave_level: 1,
    })
    .select()
    .single()

  if (error) {
    throw new Error(`创建玩家失败: ${error.message}`)
  }

  revalidatePath('/')
  return { success: true, player }
}

/**
 * 更新玩家信息
 */
export async function updatePlayer(input: {
  name?: string
  rank?: string
  level?: number
  qi?: number
  maxQi?: number
  spiritStones?: number
}) {
  const userId = await getCurrentUserId()
  const validated = updatePlayerSchema.parse(input)
  const supabase = await createServerSupabaseClient()

  // 转换字段名
  const updateData: any = {}
  if (validated.name) updateData.name = validated.name
  if (validated.rank) updateData.rank = validated.rank
  if (validated.level) updateData.level = validated.level
  if (validated.qi !== undefined) updateData.qi = validated.qi
  if (validated.maxQi) updateData.max_qi = validated.maxQi
  if (validated.spiritStones !== undefined) updateData.spirit_stones = validated.spiritStones

  const { data: player, error } = await supabase
    .from('players')
    .update(updateData)
    .eq('user_id', userId)
    .select()
    .single()

  if (error) {
    throw new Error(`更新玩家失败: ${error.message}`)
  }

  revalidatePath('/')
  return { success: true, player }
}

/**
 * 增加灵气
 */
export async function addQi(playerId: number, amount: number) {
  const userId = await getCurrentUserId()
  const validated = addQiSchema.parse({ playerId, amount })
  const supabase = await createServerSupabaseClient()

  // 获取玩家
  const { data: player, error: fetchError } = await supabase
    .from('players')
    .select('*')
    .eq('id', validated.playerId)
    .single()

  if (fetchError || !player) {
    throw new Error('玩家不存在')
  }

  // 验证所有权
  if (player.user_id !== userId) {
    throw new Error('无权操作此玩家')
  }

  // 增加灵气
  const newQi = Math.min(Number(player.qi) + validated.amount, Number(player.max_qi))
  const { data: updated, error } = await supabase
    .from('players')
    .update({ qi: newQi })
    .eq('id', validated.playerId)
    .select()
    .single()

  if (error) {
    throw new Error(`更新灵气失败: ${error.message}`)
  }

  revalidatePath('/')
  return { success: true, player: updated, leveledUp: false }
}

/**
 * 增加灵石
 */
export async function addSpiritStones(playerId: number, amount: number) {
  const userId = await getCurrentUserId()
  const validated = addSpiritStonesSchema.parse({ playerId, amount })
  const supabase = await createServerSupabaseClient()

  // 获取玩家验证所有权
  const { data: existingPlayer, error: fetchError } = await supabase
    .from('players')
    .select('user_id, spirit_stones')
    .eq('id', validated.playerId)
    .single()

  if (fetchError || !existingPlayer || existingPlayer.user_id !== userId) {
    throw new Error('玩家不存在或无权操作')
  }

  // 更新灵石
  const { data: player, error } = await supabase
    .from('players')
    .update({ spirit_stones: existingPlayer.spirit_stones + validated.amount })
    .eq('id', validated.playerId)
    .select()
    .single()

  if (error) {
    throw new Error(`更新灵石失败: ${error.message}`)
  }

  revalidatePath('/')
  return { success: true, player }
}

/**
 * 境界突破
 */
export async function levelUpRealm(playerId: number) {
  const userId = await getCurrentUserId()
  const supabase = await createServerSupabaseClient()

  const { data: player, error } = await supabase
    .from('players')
    .select('*')
    .eq('id', playerId)
    .single()

  if (error || !player) {
    throw new Error('玩家不存在')
  }

  // TODO: 实现境界升级逻辑

  revalidatePath('/')
  return { success: true, message: '境界突破成功!' }
}

/**
 * 更新玩家进度
 */
export async function updatePlayerProgress(input: {
  playerId: number
  qi: number
  innerDemon: number
  spiritStones: number
  caveLevel: number
}) {
  const userId = await getCurrentUserId()
  const supabase = await createServerSupabaseClient()

  // 验证玩家所有权
  const { data: player, error: fetchError } = await supabase
    .from('players')
    .select('user_id')
    .eq('id', input.playerId)
    .single()

  if (fetchError || !player || player.user_id !== userId) {
    throw new Error('无权操作此玩家')
  }

  // 更新进度
  const { data: updated, error } = await supabase
    .from('players')
    .update({
      qi: input.qi,
      inner_demon: input.innerDemon,
      spirit_stones: input.spiritStones,
      cave_level: input.caveLevel,
    })
    .eq('id', input.playerId)
    .select()
    .single()

  if (error) {
    throw new Error(`更新进度失败: ${error.message}`)
  }

  return { success: true, player: updated }
}