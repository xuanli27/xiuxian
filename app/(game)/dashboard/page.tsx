import { auth } from '@/lib/auth/auth'
import { redirect } from 'next/navigation'
import { getPlayerByUserId } from '@/features/player/queries'
import { getPlayerRealmInfo } from '@/features/cultivation/queries'
import { Dashboard } from '@/components/dashboard/Dashboard'

/**
 * Dashboard页面 - 显示玩家修炼进度和境界信息
 */
export default async function DashboardPage() {
  // 获取当前用户会话
  const session = await auth()
  
  if (!session?.user) {
    redirect('/login')
  }

  // 获取玩家数据
  const player = await getPlayerByUserId(session.user.id)
  
  if (!player) {
    // 如果玩家不存在,重定向到创建角色页面
    redirect('/onboarding')
  }

  // 获取境界信息
  const realmInfo = await getPlayerRealmInfo(player.id)

  return (
    <div className="container mx-auto px-4 py-8">
      <Dashboard 
        player={player}
        realmInfo={realmInfo}
      />
    </div>
  )
}