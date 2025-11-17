import { Session } from 'next-auth'

/**
 * 检查用户是否已登录
 */
export function isAuthenticated(session: Session | null): session is Session {
  return !!session?.user
}

/**
 * 获取用户显示名称
 */
export function getUserDisplayName(session: Session | null): string {
  if (!session?.user) return '游客'
  return session.user.name || session.user.email || '修仙者'
}

/**
 * 检查用户是否有权限访问资源
 */
export function canAccessResource(
  session: Session | null,
  resourceUserId: string
): boolean {
  if (!session?.user?.id) return false
  return session.user.id === resourceUserId
}