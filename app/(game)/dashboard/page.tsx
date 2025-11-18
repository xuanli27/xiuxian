import { auth } from '@/lib/auth/auth'
import { redirect } from 'next/navigation'
import { Dashboard } from './_components/Dashboard'

/**
 * Dashboard页面 - 显示玩家修炼进度和境界信息
 * 数据获取已移至客户端组件,通过React Query管理
 */
export default async function DashboardPage() {
  const session = await auth()
  
  if (!session?.user) {
    redirect('/login')
  }

  // 简单的认证检查,数据获取交给客户端的Dashboard组件
  return <Dashboard />
}