import { redirect } from 'next/navigation'
import { getServerUser } from '@/lib/auth/server'
import { getPlayerByUserId } from '@/features/player/queries'
import { getPlayerInventory } from '@/features/inventory/queries'
import { Inventory } from './_components/Inventory'

/**
 * Inventory页面 - 背包
 */
export default async function InventoryPage() {
  const user = await getServerUser()
  const player = await getPlayerByUserId(user.id)
  
  if (!player) {
    redirect('/register')
  }

  const items = await getPlayerInventory(player.id)

  return (
    <Inventory
      initialItems={items}
      player={player}
    />
  )
}