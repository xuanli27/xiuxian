'use server'

import { prisma } from '@/lib/db/prisma'
import { getCurrentUserId } from '@/lib/auth/guards'
import { revalidatePath } from 'next/cache'
import {
  addItemSchema,
  removeItemSchema,
  useItemSchema,
  equipItemSchema,
  unequipItemSchema,
  sellItemSchema,
} from './schemas'
import { calculateSellPrice } from './utils'
import type { InventoryActionResult } from './types'

/**
 * Inventory Server Actions
 */

/**
 * 添加物品到背包
 */
export async function addItemToInventory(input: {
  itemId: string
  quantity: number
}): Promise<InventoryActionResult> {
  const userId = await getCurrentUserId()
  
  // 验证输入
  const validated = addItemSchema.parse(input)
  
  // 获取玩家
  const player = await prisma.player.findUnique({
    where: { userId },
    select: { id: true, inventory: true }
  })
  
  if (!player) {
    throw new Error('玩家不存在')
  }
  
  // 解析当前背包
  const inventory = typeof player.inventory === 'object' && player.inventory !== null
    ? player.inventory as Record<string, any>
    : {}
  
  // 添加或更新物品
  if (inventory[validated.itemId]) {
    inventory[validated.itemId].quantity += validated.quantity
  } else {
    inventory[validated.itemId] = {
      quantity: validated.quantity,
      equipped: false,
      obtainedAt: new Date().toISOString()
    }
  }
  
  // 更新数据库
  await prisma.player.update({
    where: { id: player.id },
    data: { inventory: inventory as any }
  })
  
  revalidatePath('/inventory')
  
  return {
    success: true,
    message: `获得物品 x${validated.quantity}`,
    quantity: validated.quantity
  }
}

/**
 * 移除物品
 */
export async function removeItemFromInventory(input: {
  itemId: string
  quantity: number
}): Promise<InventoryActionResult> {
  const userId = await getCurrentUserId()
  
  // 验证输入
  const validated = removeItemSchema.parse(input)
  
  // 获取玩家
  const player = await prisma.player.findUnique({
    where: { userId },
    select: { id: true, inventory: true }
  })
  
  if (!player) {
    throw new Error('玩家不存在')
  }
  
  // 解析背包
  const inventory = typeof player.inventory === 'object' && player.inventory !== null
    ? player.inventory as Record<string, any>
    : {}
  
  // 检查物品是否存在
  if (!inventory[validated.itemId]) {
    throw new Error('物品不存在')
  }
  
  // 检查数量是否足够
  if (inventory[validated.itemId].quantity < validated.quantity) {
    throw new Error('物品数量不足')
  }
  
  // 减少数量或删除物品
  if (inventory[validated.itemId].quantity === validated.quantity) {
    delete inventory[validated.itemId]
  } else {
    inventory[validated.itemId].quantity -= validated.quantity
  }
  
  // 更新数据库
  await prisma.player.update({
    where: { id: player.id },
    data: { inventory: inventory as any }
  })
  
  revalidatePath('/inventory')
  
  return {
    success: true,
    message: `移除物品 x${validated.quantity}`,
    quantity: validated.quantity
  }
}

/**
 * 使用物品
 */
export async function useItem(input: {
  itemId: string
  quantity?: number
}): Promise<InventoryActionResult> {
  const userId = await getCurrentUserId()
  
  // 验证输入
  const validated = useItemSchema.parse(input)
  
  // 获取玩家
  const player = await prisma.player.findUnique({
    where: { userId }
  })
  
  if (!player) {
    throw new Error('玩家不存在')
  }
  
  // 解析背包
  const inventory = typeof player.inventory === 'object' && player.inventory !== null
    ? player.inventory as Record<string, any>
    : {}
  
  // 检查物品
  if (!inventory[validated.itemId]) {
    throw new Error('物品不存在')
  }
  
  if (inventory[validated.itemId].quantity < validated.quantity) {
    throw new Error('物品数量不足')
  }
  
  // TODO: 实现物品效果逻辑
  // 这里应该根据物品类型和效果执行相应操作
  
  // 消耗物品
  if (inventory[validated.itemId].quantity === validated.quantity) {
    delete inventory[validated.itemId]
  } else {
    inventory[validated.itemId].quantity -= validated.quantity
  }
  
  // 更新数据库
  await prisma.player.update({
    where: { id: player.id },
    data: { inventory: inventory as any }
  })
  
  revalidatePath('/inventory')
  
  return {
    success: true,
    message: `使用物品成功`,
    quantity: validated.quantity
  }
}

/**
 * 装备物品
 */
export async function equipItem(input: {
  itemId: string
  slot: string
}): Promise<InventoryActionResult> {
  const userId = await getCurrentUserId()
  
  // 验证输入
  const validated = equipItemSchema.parse(input)
  
  // 获取玩家
  const player = await prisma.player.findUnique({
    where: { userId }
  })
  
  if (!player) {
    throw new Error('玩家不存在')
  }
  
  // 解析背包和装备
  const inventory = typeof player.inventory === 'object' && player.inventory !== null
    ? player.inventory as Record<string, any>
    : {}
  
  const equipped = typeof player.equipped === 'object' && player.equipped !== null
    ? player.equipped as Record<string, any>
    : {}
  
  // 检查物品
  if (!inventory[validated.itemId]) {
    throw new Error('物品不存在')
  }
  
  // 如果该槽位已有装备,先卸下
  if (equipped[validated.slot]) {
    const oldItemId = equipped[validated.slot].id
    if (inventory[oldItemId]) {
      inventory[oldItemId].equipped = false
    }
  }
  
  // 装备新物品
  equipped[validated.slot] = {
    id: validated.itemId,
    equippedAt: new Date().toISOString()
  }
  
  inventory[validated.itemId].equipped = true
  inventory[validated.itemId].equippedSlot = validated.slot
  
  // 更新数据库
  await prisma.player.update({
    where: { id: player.id },
    data: {
      inventory: inventory as any,
      equipped: equipped as any
    }
  })
  
  revalidatePath('/inventory')
  revalidatePath('/dashboard')
  
  return {
    success: true,
    message: '装备成功'
  }
}

/**
 * 卸下装备
 */
export async function unequipItem(input: {
  slot: string
}): Promise<InventoryActionResult> {
  const userId = await getCurrentUserId()
  
  // 验证输入
  const validated = unequipItemSchema.parse(input)
  
  // 获取玩家
  const player = await prisma.player.findUnique({
    where: { userId }
  })
  
  if (!player) {
    throw new Error('玩家不存在')
  }
  
  // 解析装备
  const inventory = typeof player.inventory === 'object' && player.inventory !== null
    ? player.inventory as Record<string, any>
    : {}
  
  const equipped = typeof player.equipped === 'object' && player.equipped !== null
    ? player.equipped as Record<string, any>
    : {}
  
  // 检查槽位
  if (!equipped[validated.slot]) {
    throw new Error('该槽位没有装备')
  }
  
  const itemId = equipped[validated.slot].id
  
  // 卸下装备
  if (inventory[itemId]) {
    inventory[itemId].equipped = false
    delete inventory[itemId].equippedSlot
  }
  
  delete equipped[validated.slot]
  
  // 更新数据库
  await prisma.player.update({
    where: { id: player.id },
    data: {
      inventory: inventory as any,
      equipped: equipped as any
    }
  })
  
  revalidatePath('/inventory')
  revalidatePath('/dashboard')
  
  return {
    success: true,
    message: '卸下装备成功'
  }
}

/**
 * 出售物品
 */
export async function sellItem(input: {
  itemId: string
  quantity: number
}): Promise<InventoryActionResult> {
  const userId = await getCurrentUserId()
  
  // 验证输入
  const validated = sellItemSchema.parse(input)
  
  // 获取玩家
  const player = await prisma.player.findUnique({
    where: { userId }
  })
  
  if (!player) {
    throw new Error('玩家不存在')
  }
  
  // 解析背包
  const inventory = typeof player.inventory === 'object' && player.inventory !== null
    ? player.inventory as Record<string, any>
    : {}
  
  // 检查物品
  if (!inventory[validated.itemId]) {
    throw new Error('物品不存在')
  }
  
  if (inventory[validated.itemId].quantity < validated.quantity) {
    throw new Error('物品数量不足')
  }
  
  if (inventory[validated.itemId].equipped) {
    throw new Error('装备中的物品无法出售')
  }
  
  // TODO: 从物品数据库获取价格
  const itemPrice = 100 // 临时价格
  const sellPrice = Math.floor(itemPrice * 0.5 * validated.quantity)
  
  // 移除物品
  if (inventory[validated.itemId].quantity === validated.quantity) {
    delete inventory[validated.itemId]
  } else {
    inventory[validated.itemId].quantity -= validated.quantity
  }
  
  // 增加灵石
  await prisma.player.update({
    where: { id: player.id },
    data: {
      inventory: inventory as any,
      spiritStones: {
        increment: sellPrice
      }
    }
  })
  
  revalidatePath('/inventory')
  
  return {
    success: true,
    message: `出售成功,获得${sellPrice}灵石`,
    quantity: validated.quantity
  }
}