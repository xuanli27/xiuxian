'use server'

import { getPlayerInventory as getPlayerInventoryQuery } from './queries'
import { prisma } from '@/lib/db/prisma'
import { getCurrentUserId } from '@/lib/auth/guards'
import { revalidatePath } from 'next/cache'
import type { InventoryItem } from './types'

/**
 * Server Action: 获取玩家背包
 */
export async function getPlayerInventory(): Promise<InventoryItem[]> {
  const userId = await getCurrentUserId()
  const player = await prisma.player.findUnique({
    where: { userId },
    select: { id: true }
  })
  
  if (!player) return []
  
  return getPlayerInventoryQuery(player.id)
}

/**
 * Server Action: 使用物品
 */
export async function useItem(input: { itemId: string }) {
  const userId = await getCurrentUserId()
  const player = await prisma.player.findUnique({
    where: { userId }
  })
  
  if (!player) {
    throw new Error('玩家不存在')
  }
  
  // TODO: 实现物品使用逻辑
  
  revalidatePath('/inventory')
  return { success: true, message: '物品已使用' }
}

/**
 * Server Action: 装备物品
 */
export async function equipItem(input: { itemId: string; slot: string }) {
  const userId = await getCurrentUserId()
  const player = await prisma.player.findUnique({
    where: { userId }
  })
  
  if (!player) {
    throw new Error('玩家不存在')
  }
  
  // TODO: 实现装备逻辑
  
  revalidatePath('/inventory')
  return { success: true, message: '装备成功' }
}

/**
 * Server Action: 卸下装备
 */
export async function unequipItem(input: { slot: string }) {
  const userId = await getCurrentUserId()
  const player = await prisma.player.findUnique({
    where: { userId }
  })

  if (!player) {
    throw new Error('玩家不存在')
  }

  // TODO: 实现卸下装备逻辑

  revalidatePath('/inventory')
  return { success: true, message: '卸下成功' }
}