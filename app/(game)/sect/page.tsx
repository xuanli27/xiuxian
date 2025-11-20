import { redirect } from 'next/navigation'
import { getServerUser } from '@/lib/auth/server'
import { getPlayerByUserId } from '@/features/player/queries'
import { SectHall } from './_components/SectHall'

/**
 * Sect页面 - 宗门
 */
export default async function SectPage() {
  const user = await getServerUser()
  const player = await getPlayerByUserId(user.id)
  
  if (!player) {
    redirect('/register')
  }

  return <SectHall player={player} />
}