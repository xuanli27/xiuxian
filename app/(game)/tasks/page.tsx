import { auth } from '@/lib/auth/auth'
import { redirect } from 'next/navigation'
import { getPlayerByUserId } from '@/features/player/queries'
import { getPlayerTasks } from '@/features/tasks/queries'
import { TaskBoard } from './_components/TaskBoard'

/**
 * Tasks页面 - 任务大厅
 */
export default async function TasksPage() {
  const session = await auth()
  
  if (!session?.user) {
    redirect('/login')
  }

  const player = await getPlayerByUserId(session.user.id)
  
  if (!player) {
    redirect('/onboarding')
  }

  // 获取玩家任务列表
  const tasks = await getPlayerTasks(player.id)

  return (
    <TaskBoard
      initialTasks={tasks}
    />
  )
}