'use server'

import { createServerSupabaseClient } from '@/lib/db/supabase'
import { DAILY_MOYU_TASKS, WEEKLY_MOYU_TASKS } from '@/data/tasks/moyu-tasks'

export async function seedInitialTasks(playerId: number) {
  const supabase = await createServerSupabaseClient()
  
  // 检查是否已有任务
  const { data: existing } = await supabase
    .from('tasks')
    .select('id')
    .eq('player_id', playerId)
    .limit(1)
  
  if (existing && existing.length > 0) {
    return { success: true, message: '任务已存在' }
  }
  
  // 随机选择3个日常任务
  const dailyTasks = DAILY_MOYU_TASKS.sort(() => Math.random() - 0.5).slice(0, 3)
  
  const tasksToInsert = dailyTasks.map(task => ({
    player_id: playerId,
    title: task.title,
    description: task.description,
    type: task.type,
    difficulty: task.difficulty,
    category: task.category,
    reward_qi: task.rewardQi,
    reward_contribution: task.rewardContribution,
    reward_stones: task.rewardStones,
    duration: task.duration * 60,
    status: 'PENDING',
    url: task.url || null,
  }))
  
  const { error } = await supabase
    .from('tasks')
    .insert(tasksToInsert)
  
  if (error) {
    throw new Error(`初始化任务失败: ${error.message}`)
  }
  
  return { success: true, message: '初始任务已创建' }
}