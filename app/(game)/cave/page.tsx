import { redirect } from 'next/navigation'
import { getServerUser } from '@/lib/auth/server'
import { getPlayerByUserId } from '@/features/player/queries'
import { getPlayerCave } from '@/features/cave/queries'
import { CaveManager } from './_components/CaveManager'

/**
 * Cave页面 - 洞府
 */
export default async function CavePage() {
  const user = await getServerUser()
  const player = await getPlayerByUserId(user.id)
  
  if (!player) {
    redirect('/register')
  }

  const cave = await getPlayerCave(player.id)

  if (!cave) {
    return (
      <div className="text-center">
        <h1 className="text-3xl font-bold">你还没有洞府</h1>
        <p className="mt-4 text-content-400">快去开辟一个属于你的洞天福地吧!</p>
      </div>
    )
  }

  return (
    <CaveManager
      initialCave={cave}
      player={player}
    />
  )
}