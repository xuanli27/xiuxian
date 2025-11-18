import { auth } from '@/lib/auth/auth'
import { redirect } from 'next/navigation'
import { getPlayerByUserId } from '@/features/player/queries'
import { getPlayerRealmInfo, getCultivationStats } from '@/features/cultivation/queries'
import { Cultivation } from './_components/Cultivation'

/**
 * Cultivation页面 - 修炼场
 */
export default async function CultivationPage() {
  const session = await auth()
  
  if (!session?.user) {
    redirect('/login')
  }

  const player = await getPlayerByUserId(session.user.id!)
  
  if (!player) {
    redirect('/onboarding')
  }

  // 获取境界信息和修炼统计
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