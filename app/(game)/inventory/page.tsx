import { auth } from '@/lib/auth/auth'
import { redirect } from 'next/navigation'
import { getPlayerByUserId } from '@/features/player/queries'
import { getPlayerInventory } from '@/features/inventory/queries'
import { Inventory } from './_components/Inventory'

/**
 * Inventory页面 - 背包
 */
export default async function InventoryPage() {
  const session = await auth()
  
  if (!session?.user) {
    redirect('/login')
  }

  const player = await getPlayerByUserId(session.user.id)
  
  if (!player) {
    redirect('/onboarding')
  }

  // 获取玩家背包数据
  const items = await getPlayerInventory(player.id)

  return (
    <div className="container mx-auto px-4 py-8">
      <Inventory 
        initialItems={items}
        player={player}
      />
    </div>
  )
}