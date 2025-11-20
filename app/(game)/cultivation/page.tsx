import { redirect } from 'next/navigation'
import { getServerUser } from '@/lib/auth/server'
import { getPlayerByUserId } from '@/features/player/queries'
import { getPlayerRealmInfo, getCultivationStats } from '@/features/cultivation/queries'
import { Cultivation } from './_components/Cultivation'

/**
 * Cultivation页面 - 修炼场
 */
export default async function CultivationPage() {
  const user = await getServerUser()
  const player = await getPlayerByUserId(user.id)
  
  if (!player) {
    redirect('/register')
  }

  const realmInfo = await getPlayerRealmInfo(player.id)
  const stats = await getCultivationStats(player.id)

  return (
    <Cultivation
      initialPlayer={player}
      initialRealmInfo={realmInfo}
      initialStats={stats}
    />
  )
}