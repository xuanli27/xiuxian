'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/db/supabase'

// 邮箱密码登录
export async function emailPasswordLogin(formData: FormData) {
  const supabase = await createServerSupabaseClient()
  
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  
  if (!email || !password) {
    return { error: '请输入邮箱和密码' }
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  redirect('/auth/callback')
}

// 邮箱密码注册
export async function emailPasswordSignup(formData: FormData) {
  const supabase = await createServerSupabaseClient()
  
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  
  if (!email || !password) {
    return { error: '请输入邮箱和密码' }
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    }
  })

  if (error) {
    return { error: error.message }
  }

  redirect('/auth/callback')
}

// 直接注册(用于注册流程)
export async function signupWithCredentials(email: string, password: string) {
  const supabase = await createServerSupabaseClient()
  
  if (!email || !password) {
    return { error: '请输入邮箱和密码' }
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  return { success: true }
}

export async function signInWithOAuth(provider: 'google' | 'github') {
  const supabase = await createServerSupabaseClient()
  
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    },
  })

  if (error) {
    redirect('/login?error=oauth_failed')
  }

  if (data.url) {
    redirect(data.url)
  }
}

export async function signOut() {
  const supabase = await createServerSupabaseClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/login')
}

export async function createPlayerAccount(data: {
  mindState: string
  spiritRoot: string
  avatar: string
}) {
  const supabase = await createServerSupabaseClient()
  
  // 获取当前用户
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  
  if (userError || !user) {
    return { error: '未登录' }
  }

  // 检查是否已有角色
  const { data: existingPlayer } = await supabase
    .from('players')
    .select('id')
    .eq('user_id', user.id)
    .single()

  if (existingPlayer) {
    return { error: '已有角色' }
  }

  // 创建角色
  const { data: player, error } = await supabase
    .from('players')
    .insert({
      user_id: user.id,
      name: user.email?.split('@')[0] || '修仙者',
      spirit_root: data.spiritRoot,
      avatar: data.avatar,
    })
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  return { success: true, player }
}