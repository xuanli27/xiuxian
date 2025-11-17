import { auth } from './auth'
import { redirect } from 'next/navigation'

/**
 * 服务端认证守卫
 * 用于保护Server Components和Server Actions
 */
export async function requireAuth() {
  const session = await auth()
  if (!session?.user) {
    redirect('/login')
  }
  return session
}

/**
 * 获取当前用户ID
 * 如果未登录则抛出错误
 */
export async function getCurrentUserId() {
  const session = await requireAuth()
  return session.user!.id
}

/**
 * 检查用户权限
 */
export async function checkPermission(permission: string) {
  const session = await requireAuth()
  // TODO: 实现权限检查逻辑
  return true
}