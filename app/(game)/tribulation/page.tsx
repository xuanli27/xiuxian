import { auth } from '@/lib/auth/auth'
import { redirect } from 'next/navigation'
import { getPlayerByUserId } from '@/features/player/queries'
import { Tribulation } from './_components/Tribulation'

/**
 * Tribulation页面 - 渡劫
 */
export default async function TribulationPage() {
  const session = await auth()
  
  if (!session?.user) {
    redirect('/login')
  }

  const player = await getPlayerByUserId(session.user.id!)
  
  if (!player) {
    redirect('/onboarding')
  }

  return (
    <Tribulation
      player={player}
    />
  )
}