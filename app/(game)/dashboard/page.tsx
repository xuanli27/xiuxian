import { auth } from '@/lib/auth/auth'
import { redirect } from 'next/navigation'
import { getPlayerByUserId } from '@/features/player/queries'
import { getPlayerRealmInfo } from '@/features/cultivation/queries'
import { getPlayerTasks } from '@/features/tasks/queries'
import { Dashboard } from './_components/Dashboard'

/**
 * Dashboard页面 - 显示玩家修炼进度和境界信息
 */
export default async function DashboardPage() {
  const session = await auth()
  
  if (!session?.user) {
    redirect('/login')
  }

  const player = await getPlayerByUserId(session.user.id!)
  
  if (!player) {
    redirect('/onboarding')
  }

  const realmInfo = await getPlayerRealmInfo(player.id)
  const tasks = await getPlayerTasks(player.id)

  return (
    <Dashboard
      initialPlayer={player}
      initialRealmInfo={realmInfo}
      initialTasks={tasks}
    />
  )
}