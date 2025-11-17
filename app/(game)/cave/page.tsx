import { auth } from '@/lib/auth/auth'
import { redirect } from 'next/navigation'
import { getPlayerByUserId } from '@/features/player/queries'
import { getPlayerCave } from '@/features/cave/queries'
import { CaveManager } from '@/components/cave/CaveManager'

/**
 * Cave页面 - 洞府
 */
export default async function CavePage() {
  const session = await auth()
  
  if (!session?.user) {
    redirect('/login')
  }

  const player = await getPlayerByUserId(session.user.id)
  
  if (!player) {
    redirect('/onboarding')
  }

  // 获取洞府数据
  const cave = await getPlayerCave(player.id)

  if (!cave) {
    // 如果洞府不存在,可以显示一个创建洞府的界面
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold">你还没有洞府</h1>
        <p className="mt-4 text-content-400">快去开辟一个属于你的洞天福地吧!</p>
        {/* TODO: 添加创建洞府的组件 */}
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <CaveManager
        initialCave={cave}
        player={player}
      />
    </div>
  )
}