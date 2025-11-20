import { redirect } from 'next/navigation'
import { getServerUser } from '@/lib/auth/server'
import { getPlayerByUserId } from '@/features/player/queries'
import { getAvailableTasks } from '@/features/tasks/queries'
import { TaskBoard } from './_components/TaskBoard'

/**
 * Tasks页面 - 认证由中间件处理
 */
export default async function TasksPage() {
  const user = await getServerUser()
  const player = await getPlayerByUserId(user.id)
  
  if (!player) {
    redirect('/register')
  }

  const tasks = await getAvailableTasks()

  return <TaskBoard initialTasks={tasks} />
}