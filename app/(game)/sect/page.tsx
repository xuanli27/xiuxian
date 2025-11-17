import { auth } from '@/lib/auth/auth'
import { redirect } from 'next/navigation'
import { getPlayerByUserId } from '@/features/player/queries'
import { SectHall } from '@/components/sect/SectHall'

/**
 * Sect页面 - 宗门大殿
 */
export default async function SectPage() {
  const session = await auth()
  
  if (!session?.user) {
    redirect('/login')
  }

  const player = await getPlayerByUserId(session.user.id!)
  
  if (!player) {
    redirect('/onboarding')
  }

  if (!player.sectId) {
    // 如果玩家没有宗门,可以显示一个加入宗门的界面
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold">你还没有加入任何部门</h1>
        <p className="mt-4 text-content-400">快去寻找一个适合你的项目组吧!</p>
        {/* TODO: 添加加入宗门的组件 */}
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <SectHall
        player={player}
      />
    </div>
  )
}