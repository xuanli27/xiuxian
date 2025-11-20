import { createServerSupabaseClient } from '@/lib/db/supabase'
import { cache } from 'react'
import { getCurrentUserId } from '@/lib/auth/supabase-auth'
import type { Task } from '@/types/database'

export const getAvailableTasks = cache(async (): Promise<Task[]> => {
  const userId = await getCurrentUserId()
  const supabase = await createServerSupabaseClient()
  
  const { data: player } = await supabase
    .from('players')
    .select('id')
    .eq('user_id', userId)
    .single()

  if (!player) return []

  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('player_id', player.id)
    .in('status', ['PENDING', 'IN_PROGRESS', 'COMPLETED'])
    .order('created_at', { ascending: false })

  if (error) {
    console.error('获取任务失败:', error)
    return []
  }

  return data || []
})

export const getTaskHistory = cache(async () => {
  return []
})

export const getPlayerTasks = cache(async (playerId: number): Promise<Task[]> => {
  const supabase = await createServerSupabaseClient()
  
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('player_id', playerId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('获取任务失败:', error)
    return []
  }

  return data || []
})