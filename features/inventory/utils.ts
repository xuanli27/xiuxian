import type { Item, ItemQuality, InventoryItem } from './types'

/**
 * 背包系统工具函数
 */

/**
 * 物品品质颜色映射
 */
export const QUALITY_COLORS: Record<ItemQuality, string> = {
  COMMON: '#9E9E9E',     // 灰色
  UNCOMMON: '#4CAF50',   // 绿色
  RARE: '#2196F3',       // 蓝色
  EPIC: '#9C27B0',       // 紫色
  LEGENDARY: '#FF9800',  // 橙色
  MYTHIC: '#F44336',     // 红色
}

/**
 * 物品品质中文名
 */
export const QUALITY_NAMES: Record<ItemQuality, string> = {
  COMMON: '普通',
  UNCOMMON: '优秀',
  RARE: '稀有',
  EPIC: '史诗',
  LEGENDARY: '传说',
  MYTHIC: '神话',
}

/**
 * 计算物品的出售价格(原价的50%)
 */
export function calculateSellPrice(item: Item, quantity: number = 1): number {
  return Math.floor(item.price * 0.5 * quantity)
}

/**
 * 计算物品总价值
 */
export function calculateTotalValue(items: InventoryItem[]): number {
  return items.reduce((sum, item) => sum + (item.item.price * item.quantity), 0)
}

/**
 * 检查物品是否可以堆叠
 */
export function canStack(item: Item): boolean {
  return item.stackable && item.maxStack > 1
}

/**
 * 计算物品占用的背包格子数
 */
export function calculateSlotUsage(item: Item, quantity: number): number {
  if (!item.stackable) {
    return quantity
  }
  return Math.ceil(quantity / item.maxStack)
}

/**
 * 排序背包物品
 */
export function sortInventoryItems(
  items: InventoryItem[],
  sortBy: 'NAME' | 'TYPE' | 'QUALITY' | 'LEVEL' | 'QUANTITY' | 'VALUE',
  order: 'ASC' | 'DESC' = 'ASC'
): InventoryItem[] {
  const sorted = [...items].sort((a, b) => {
    let compareResult = 0
    
    switch (sortBy) {
      case 'NAME':
        compareResult = a.item.name.localeCompare(b.item.name, 'zh-CN')
        break
      case 'TYPE':
        compareResult = a.item.type.localeCompare(b.item.type)
        break
      case 'QUALITY':
        const qualityOrder = ['COMMON', 'UNCOMMON', 'RARE', 'EPIC', 'LEGENDARY', 'MYTHIC']
        compareResult = qualityOrder.indexOf(a.item.quality) - qualityOrder.indexOf(b.item.quality)
        break
      case 'LEVEL':
        compareResult = a.item.level - b.item.level
        break
      case 'QUANTITY':
        compareResult = a.quantity - b.quantity
        break
      case 'VALUE':
        const valueA = a.item.price * a.quantity
        const valueB = b.item.price * b.quantity
        compareResult = valueA - valueB
        break
    }
    
    return order === 'ASC' ? compareResult : -compareResult
  })
  
  return sorted
}

/**
 * 过滤背包物品
 */
export function filterInventoryItems(
  items: InventoryItem[],
  filters: {
    type?: string
    quality?: ItemQuality
    equipped?: boolean
    minLevel?: number
    maxLevel?: number
    searchText?: string
  }
): InventoryItem[] {
  return items.filter(item => {
    if (filters.type && item.item.type !== filters.type) return false
    if (filters.quality && item.item.quality !== filters.quality) return false
    if (filters.equipped !== undefined && item.equipped !== filters.equipped) return false
    if (filters.minLevel && item.item.level < filters.minLevel) return false
    if (filters.maxLevel && item.item.level > filters.maxLevel) return false
    if (filters.searchText) {
      const searchLower = filters.searchText.toLowerCase()
      const nameMatch = item.item.name.toLowerCase().includes(searchLower)
      const descMatch = item.item.description.toLowerCase().includes(searchLower)
      if (!nameMatch && !descMatch) return false
    }
    return true
  })
}

/**
 * 计算装备总属性
 */
export function calculateTotalStats(items: Item[]): {
  attack: number
  defense: number
  health: number
  mana: number
  speed: number
} {
  return items.reduce((total, item) => {
    if (!item.stats) return total
    
    return {
      attack: total.attack + (item.stats.attack || 0),
      defense: total.defense + (item.stats.defense || 0),
      health: total.health + (item.stats.health || 0),
      mana: total.mana + (item.stats.mana || 0),
      speed: total.speed + (item.stats.speed || 0),
    }
  }, {
    attack: 0,
    defense: 0,
    health: 0,
    mana: 0,
    speed: 0,
  })
}

/**
 * 生成物品工具提示文本
 */
export function generateItemTooltip(item: Item): string {
  let tooltip = `${item.name}\n`
  tooltip += `品质: ${QUALITY_NAMES[item.quality]}\n`
  tooltip += `等级: ${item.level}\n`
  tooltip += `${item.description}\n`
  
  if (item.stats) {
    tooltip += '\n属性:\n'
    if (item.stats.attack) tooltip += `攻击力: +${item.stats.attack}\n`
    if (item.stats.defense) tooltip += `防御力: +${item.stats.defense}\n`
    if (item.stats.health) tooltip += `生命值: +${item.stats.health}\n`
    if (item.stats.mana) tooltip += `法力值: +${item.stats.mana}\n`
  }
  
  if (item.effects && item.effects.length > 0) {
    tooltip += '\n效果:\n'
    item.effects.forEach(effect => {
      tooltip += `${effect.description}\n`
    })
  }
  
  tooltip += `\n价值: ${item.price}灵石`
  
  return tooltip
}

/**
 * 检查是否有足够的物品
 */
export function hasEnoughItems(
  items: InventoryItem[],
  itemId: string,
  requiredQuantity: number
): boolean {
  const item = items.find(i => i.item.id === itemId)
  return item ? item.quantity >= requiredQuantity : false
}

/**
 * 合并可堆叠的物品
 */
export function mergeStackableItems(items: InventoryItem[]): InventoryItem[] {
  const merged = new Map<string, InventoryItem>()
  
  items.forEach(item => {
    const existing = merged.get(item.item.id)
    
    if (existing && item.item.stackable) {
      existing.quantity += item.quantity
    } else {
      merged.set(item.item.id, { ...item })
    }
  })
  
  return Array.from(merged.values())
}