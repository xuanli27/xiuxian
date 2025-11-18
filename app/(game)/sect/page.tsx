import { auth } from '@/lib/auth/auth'
import { redirect } from 'next/navigation'
import { getPlayerByUserId } from '@/features/player/queries'
import { SectHall } from './_components/SectHall'

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

  return (
    <div className="container mx-auto px-4 py-8">
      <SectHall
        player={player}
      />
    </div>
  )
}