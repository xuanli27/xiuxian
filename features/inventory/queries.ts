import { cache } from 'react'
import { prisma } from '@/lib/db/prisma'
import type { InventoryItem, EquipmentSet, InventoryStats, Item } from './types'

/**
 * 背包系统数据查询函数
 */

/**
 * 获取玩家背包
 */
export const getPlayerInventory = cache(async (playerId: number): Promise<InventoryItem[]> => {
  const player = await prisma.player.findUnique({
    where: { id: playerId },
    select: { inventory: true }
  })

  if (!player) return []

  // 从JSON字段解析背包数据
  const inventory = typeof player.inventory === 'object' && player.inventory !== null
    ? player.inventory as Record<string, any>
    : {}

  // 转换为InventoryItem数组
  const items: InventoryItem[] = Object.entries(inventory).map(([itemId, data]: [string, any]) => ({
    item: {
      id: itemId,
      name: data.name || '未知物品',
      description: data.description || '',
      type: data.type || 'MATERIAL',
      quality: data.quality || 'COMMON',
      level: data.level || 1,
      stackable: data.stackable !== false,
      maxStack: data.maxStack || 999,
      price: data.price || 0,
      slot: data.slot,
      stats: data.stats,
      effects: data.effects,
      tradeable: data.tradeable !== false,
      sellable: data.sellable !== false,
    },
    quantity: data.quantity || 1,
    equipped: data.equipped || false,
    slot: data.equippedSlot,
  }))

  return items
})

/**
 * 获取玩家装备
 */
export const getPlayerEquipment = cache(async (playerId: number): Promise<EquipmentSet> => {
  const player = await prisma.player.findUnique({
    where: { id: playerId },
    select: { equipped: true }
  })

  if (!player) return {}

  // 从JSON字段解析装备数据
  const equipped = typeof player.equipped === 'object' && player.equipped !== null
    ? player.equipped as Record<string, any>
    : {}

  return {
    weapon: equipped.weapon,
    armor: equipped.armor,
    accessory: equipped.accessory,
    boots: equipped.boots,
    ring: equipped.ring,
    necklace: equipped.necklace,
  }
})

/**
 * 获取背包统计
 */
export const getInventoryStats = cache(async (playerId: number): Promise<InventoryStats> => {
  const items = await getPlayerInventory(playerId)
  const equipment = await getPlayerEquipment(playerId)

  const usedSlots = items.reduce((sum, item) => {
    return sum + (item.item.stackable ? 1 : item.quantity)
  }, 0)

  const totalValue = items.reduce((sum, item) => {
    return sum + (item.item.price * item.quantity)
  }, 0)

  // 计算装备战力
  const equippedPower = Object.values(equipment).reduce((sum, item) => {
    if (!item || !item.stats) return sum
    const stats = item.stats
    return sum + 
      (stats.attack || 0) +
      (stats.defense || 0) * 0.5 +
      (stats.health || 0) * 0.1 +
      (stats.mana || 0) * 0.1
  }, 0)

  return {
    totalItems: items.length,
    usedSlots,
    maxSlots: 100, // 默认背包容量
    totalValue,
    equippedPower: Math.floor(equippedPower),
  }
})

/**
 * 查找特定物品
 */
export const findItemInInventory = cache(async (
  playerId: number,
  itemId: string
): Promise<InventoryItem | null> => {
  const items = await getPlayerInventory(playerId)
  return items.find(item => item.item.id === itemId) || null
})

/**
 * 检查背包是否有空间
 */
export const hasInventorySpace = cache(async (
  playerId: number,
  requiredSlots: number = 1
): Promise<boolean> => {
  const stats = await getInventoryStats(playerId)
  return (stats.maxSlots - stats.usedSlots) >= requiredSlots
})

/**
 * 获取可出售物品列表
 */
export const getSellableItems = cache(async (playerId: number): Promise<InventoryItem[]> => {
  const items = await getPlayerInventory(playerId)
  return items.filter(item => item.item.sellable && !item.equipped)
})

/**
 * 获取可交易物品列表
 */
export const getTradeableItems = cache(async (playerId: number): Promise<InventoryItem[]> => {
  const items = await getPlayerInventory(playerId)
  return items.filter(item => item.item.tradeable && !item.equipped)
})