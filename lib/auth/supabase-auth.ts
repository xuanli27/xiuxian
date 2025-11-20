import { createServerSupabaseClient } from '@/lib/db/supabase'

// 获取当前用户
export async function getCurrentUser() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

// 获取当前用户ID
export async function getCurrentUserId() {
  const user = await getCurrentUser()
  if (!user) throw new Error('未登录')
  return user.id
}

// 登录
export async function signInWithPassword(email: string, password: string) {
  const supabase = await createServerSupabaseClient()
  return await supabase.auth.signInWithPassword({ email, password })
}

// 注册
export async function signUp(email: string, password: string) {
  const supabase = await createServerSupabaseClient()
  return await supabase.auth.signUp({ email, password })
}

// 登出
export async function signOut() {
  const supabase = await createServerSupabaseClient()
  return await supabase.auth.signOut()
}

// OAuth 登录
export async function signInWithOAuth(provider: 'google' | 'github') {
  const supabase = await createServerSupabaseClient()
  return await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback`
    }
  })
}