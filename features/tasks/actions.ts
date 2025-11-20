'use server'

import { getAvailableTasks as getAvailableTasksQuery } from './queries'
import { createServerSupabaseClient } from '@/lib/db/supabase'
import { getCurrentUserId } from '@/lib/auth/supabase-auth'
import { revalidatePath } from 'next/cache'
import { generateStructuredData } from '@/lib/ai/client'
import { z } from 'zod'

const taskSchema = z.object({
  title: z.string(),
  description: z.string(),
  difficulty: z.enum(['EASY', 'MEDIUM', 'HARD', 'EXTREME']),
  type: z.enum(['COMBAT', 'GATHER', 'CRAFT', 'NEGOTIATE']),
  rewardSpiritStones: z.number(),
  rewardSectContribution: z.number(),
})

export async function getAvailableTasks() {
  const userId = await getCurrentUserId()
  const supabase = await createServerSupabaseClient()
  
  const { data: player } = await supabase
    .from('players')
    .select('id')
    .eq('user_id', userId)
    .single()
  
  if (!player) return []
  
  return getAvailableTasksQuery()
}

export async function generateNextTask() {
  const userId = await getCurrentUserId()
  const supabase = await createServerSupabaseClient()
  
  const { data: player, error } = await supabase
    .from('players')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (error || !player) throw new Error("玩家不存在")

  const prompt = `Generate a Xianxia (cultivation) themed task for a player at level ${player.level}.
  The task should be related to their current cultivation stage.
  Make it sound like a quest from a sect elder or a mysterious encounter.
  Difficulty should be appropriate for their level.`

  const taskData = await generateStructuredData(taskSchema, prompt)

  const { data: newTask, error: insertError } = await supabase
    .from('tasks')
    .insert({
      player_id: player.id,
      title: taskData.title,
      description: taskData.description,
      difficulty: taskData.difficulty,
      type: taskData.type,
      status: 'PENDING',
      duration: 3600,
      reward_qi: 100,
      reward_stones: taskData.rewardSpiritStones,
      reward_contribution: taskData.rewardSectContribution
    })
    .select()
    .single()

  if (insertError) {
    throw new Error(`创建任务失败: ${insertError.message}`)
  }

  revalidatePath('/(game)/tasks')
  return newTask
}

export async function acceptTask(taskId: string) {
  const userId = await getCurrentUserId()
  const supabase = await createServerSupabaseClient()
  
  const { data: player } = await supabase
    .from('players')
    .select('id')
    .eq('user_id', userId)
    .single()

  if (!player) throw new Error("玩家不存在")

  const { data: task, error: fetchError } = await supabase
    .from('tasks')
    .select('*')
    .eq('id', taskId)
    .single()
    
  if (fetchError || !task) throw new Error("任务不存在")
  if (task.player_id !== player.id) throw new Error("这不是你的任务")
  if (task.status !== 'PENDING') throw new Error("任务状态不正确")

  const { error } = await supabase
    .from('tasks')
    .update({ status: 'IN_PROGRESS' })
    .eq('id', taskId)

  if (error) {
    throw new Error(`接受任务失败: ${error.message}`)
  }

  revalidatePath('/(game)/tasks')
  return { success: true }
}

export async function completeTask(taskId: string) {
  const userId = await getCurrentUserId()
  const supabase = await createServerSupabaseClient()
  
  const { data: player } = await supabase
    .from('players')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (!player) throw new Error("玩家不存在")

  const { data: task, error: fetchError } = await supabase
    .from('tasks')
    .select('*')
    .eq('id', taskId)
    .single()
    
  if (fetchError || !task) throw new Error("任务不存在")
  if (task.player_id !== player.id) throw new Error("这不是你的任务")
  if (task.status !== 'IN_PROGRESS') throw new Error("任务状态不正确")

  // 使用RPC函数完成任务(事务操作)
  const { data, error } = await supabase.rpc('complete_task', {
    p_task_id: taskId,
    p_player_id: player.id,
    p_reward_qi: task.reward_qi,
    p_reward_contribution: task.reward_contribution,
    p_reward_stones: task.reward_stones
  })

  if (error) {
    throw new Error(`完成任务失败: ${error.message}`)
  }

  revalidatePath('/(game)/tasks')
  return {
    success: true,
    rewards: {
      spiritStones: task.reward_stones,
      sectContribution: task.reward_contribution
    }
  }
}

export const generateNewTaskForPlayer = generateNextTask