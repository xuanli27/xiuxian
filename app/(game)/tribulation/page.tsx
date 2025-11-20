import { redirect } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/db/supabase'
import { getPlayerByUserId } from '@/features/player/queries'
import { Tribulation } from './_components/Tribulation'

/**
 * Tribulation页面 - 渡劫
 */
export default async function TribulationPage() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  const player = await getPlayerByUserId(user.id)
  
  if (!player) {
    redirect('/register')
  }

  return (
    <Tribulation
      player={player}
    />
  )
}