'use server'

import { getAvailableTasks as getAvailableTasksQuery } from './queries'
import { createServerSupabaseClient } from '@/lib/db/supabase'
import { getCurrentUserId } from '@/lib/auth/supabase-auth'
import { revalidatePath } from 'next/cache'
import { getRandomMoyuTasks } from '@/data/tasks/moyu-tasks'

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
    .select('id')
    .eq('user_id', userId)
    .single()

  if (error || !player) throw new Error("玩家不存在")

  // 从预设任务中随机选择
  const [randomTask] = getRandomMoyuTasks(1)

  const { data: newTask, error: insertError } = await supabase
    .from('tasks')
    .insert({
      player_id: player.id,
      title: randomTask.title,
      description: randomTask.description,
      difficulty: randomTask.difficulty,
      type: randomTask.type,
      category: randomTask.category,
      status: 'PENDING',
      duration: randomTask.duration * 60,
      reward_qi: randomTask.rewardQi,
      reward_stones: randomTask.rewardStones,
      reward_contribution: randomTask.rewardContribution,
      url: randomTask.url || null,
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