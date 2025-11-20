import { redirect } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/db/supabase'
import { getLeaderboard } from '@/features/leaderboard/queries'
import { LeaderboardCategory } from '@/features/leaderboard/types'
import { Leaderboard } from './_components/Leaderboard'

/**
 * Leaderboard页面 - 排行榜
 */
export default async function LeaderboardPage() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  // 获取排行榜数据
  const leaderboardData = await getLeaderboard(LeaderboardCategory.POWER)

  return (
    <>
      <h1 className="text-3xl font-bold mb-6">排行榜</h1>
      <Leaderboard
        initialLeaderboardData={leaderboardData}
      />
    </>
  )
}