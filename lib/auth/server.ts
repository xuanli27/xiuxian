import { createServerSupabaseClient } from '@/lib/db/supabase'
import { redirect } from 'next/navigation'

export async function getCurrentUserId(): Promise<string> {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user?.id) {
    throw new Error('未登录')
  }
  return user.id
}

export async function requireAuth(): Promise<string> {
  const userId = await getCurrentUserId()
  if (!userId) {
    throw new Error('未登录')
  }
  return userId
}

export async function getServerUser() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }
  
  return user
}