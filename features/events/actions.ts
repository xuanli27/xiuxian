'use server'

import { revalidatePath } from 'next/cache'
import { createServerSupabaseClient } from '@/lib/db/supabase'
import { redis, isRedisEnabled } from '@/lib/db/redis'
import { aiGeneratedEventSchema } from './schemas'
import { generateNextEvent } from '@/lib/ai/generators/event-generator'
import { getCurrentUserId } from '@/lib/auth/supabase-auth'
import { z } from 'zod'
import type { InventoryData, StatusEffect } from '@/types/json-fields'

type AIEvent = z.infer<typeof aiGeneratedEventSchema>

const EVENT_CACHE_TTL = 300 // 5 minutes

/**
 * 生成新事件
 */
export async function generateNewEvent() {
  const userId = await getCurrentUserId()
  const supabase = await createServerSupabaseClient()
  
  const { data: player, error } = await supabase
    .from('players')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (error || !player) throw new Error('Player not found')

  const cacheKey = `player:${player.id}:newEvent`

  if (isRedisEnabled() && redis) {
    const cachedEvent = await redis.get(cacheKey)
    if (cachedEvent) {
      return { success: true, event: JSON.parse(cachedEvent) }
    }
  }

  const playerContext = {
    rank: player.rank,
    level: player.level,
    qi: player.qi,
    spiritStones: player.spirit_stones,
    innerDemon: player.inner_demon,
    mindState: player.mind_state,
  }

  const event = await generateNextEvent(playerContext)

  if (isRedisEnabled() && redis) {
    await redis.set(cacheKey, JSON.stringify(event), 'EX', EVENT_CACHE_TTL)
  }

  return { success: true, event }
}

/**
 * 处理事件选择
 */
export async function processEventChoice(input: { event: AIEvent, choiceId: string }) {
  const userId = await getCurrentUserId()
  const supabase = await createServerSupabaseClient()
  
  const { data: player, error } = await supabase
    .from('players')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (error || !player) throw new Error('Player not found')
  
  // 清除缓存
  const cacheKey = `player:${player.id}:newEvent`
  if (isRedisEnabled() && redis) {
    await redis.del(cacheKey)
  }

  const { event, choiceId } = input
  const choice = event.choices.find(c => c.id === choiceId)

  if (!choice) throw new Error('Invalid choice')

  let narration = `你选择了"${choice.text}"。`
  const playerUpdates: Record<string, unknown> = {}
  const statusEffectsToCreate: Array<{
    player_id: number
    effect_id: string
    name: string
    description: string
    modifiers: Record<string, number>
    expires_at: string | null
  }> = []

  for (const outcome of choice.outcomes) {
    narration += ` ${outcome.description}`
    switch (outcome.type) {
      case 'qi':
        playerUpdates.qi = (player.qi || 0) + (outcome.value as number)
        break
      case 'spiritStones':
        playerUpdates.spirit_stones = (player.spirit_stones || 0) + (outcome.value as number)
        break
      case 'innerDemon':
        playerUpdates.inner_demon = (player.inner_demon || 0) + (outcome.value as number)
        break
      case 'item':
        const currentInventory = (player.inventory as unknown as Record<string, number>) || {}
        const itemId = outcome.value as string
        currentInventory[itemId] = (currentInventory[itemId] || 0) + 1
        playerUpdates.inventory = currentInventory
        break
      case 'statusEffect':
        const effect = outcome.value as unknown as StatusEffect
        statusEffectsToCreate.push({
          player_id: player.id,
          effect_id: effect.effectId,
          name: effect.name,
          description: effect.description,
          modifiers: effect.modifiers as Record<string, number>,
          expires_at: effect.duration ? new Date(Date.now() + effect.duration * 1000).toISOString() : null,
        })
        break
    }
  }

  // 更新玩家
  const { error: updateError } = await supabase
    .from('players')
    .update(playerUpdates)
    .eq('id', player.id)

  if (updateError) {
    throw new Error(`更新玩家失败: ${updateError.message}`)
  }

  // 创建状态效果
  if (statusEffectsToCreate.length > 0) {
    const { error: effectError } = await supabase
      .from('player_status_effects')
      .insert(statusEffectsToCreate)
    
    if (effectError) {
      console.error('创建状态效果失败:', effectError)
    }
  }
  
  // 记录事件日志
  const { error: logError } = await supabase
    .from('event_logs')
    .insert({
      player_id: player.id,
      event_id: event.id,
      event_type: event.type,
      title: event.title,
      description: event.description,
      choice_id: choice.id,
      choice_text: choice.text,
      result: JSON.parse(JSON.stringify({ narration, updates: playerUpdates, effects: statusEffectsToCreate })),
    })

  if (logError) {
    console.error('记录事件日志失败:', logError)
  }

  revalidatePath('/(game)', 'layout')

  return {
    success: true,
    result: {
      narration,
      playerUpdates: { ...player, ...playerUpdates },
    },
  }
}

export async function getPlayerEventHistory(playerId: number, limit = 10) {
  const supabase = await createServerSupabaseClient()
  
  const { data, error } = await supabase
    .from('event_logs')
    .select('*')
    .eq('player_id', playerId)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('查询事件历史失败:', error)
    return []
  }

  return data || []
}

export async function getPlayerStatusEffects(playerId: number) {
  const supabase = await createServerSupabaseClient()
  const now = new Date().toISOString()
  
  const { data, error } = await supabase
    .from('player_status_effects')
    .select('*')
    .eq('player_id', playerId)
    .or(`expires_at.is.null,expires_at.gt.${now}`)
    .order('started_at', { ascending: false })

  if (error) {
    console.error('查询状态效果失败:', error)
    return []
  }

  return data || []
}