import { redirect } from 'next/navigation'
import { getServerUser } from '@/lib/auth/server'
import { getPlayerByUserId } from '@/features/player/queries'
import { getAvailableTasks } from '@/features/tasks/queries'
import { seedInitialTasks } from '@/features/tasks/seed'
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

  let tasks = await getAvailableTasks()
  
  // 如果没有任务，初始化一些任务
  if (!tasks || tasks.length === 0) {
    await seedInitialTasks(player.id)
    tasks = await getAvailableTasks()
  }

  return <TaskBoard initialTasks={tasks} />
}