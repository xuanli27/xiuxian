/**
 * 背包系统类型定义
 */

// 物品品质
export enum ItemQuality {
  COMMON = 'COMMON',       // 普通(白色)
  UNCOMMON = 'UNCOMMON',   // 优秀(绿色)
  RARE = 'RARE',           // 稀有(蓝色)
  EPIC = 'EPIC',           // 史诗(紫色)
  LEGENDARY = 'LEGENDARY', // 传说(橙色)
  MYTHIC = 'MYTHIC',       // 神话(红色)
}

// 物品类型
export enum ItemType {
  EQUIPMENT = 'EQUIPMENT',   // 装备
  CONSUMABLE = 'CONSUMABLE', // 消耗品
  MATERIAL = 'MATERIAL',     // 材料
  QUEST = 'QUEST',           // 任务物品
  PILL = 'PILL',             // 丹药
  TREASURE = 'TREASURE',     // 法宝
}

// 装备部位
export enum EquipmentSlot {
  WEAPON = 'WEAPON',       // 武器
  ARMOR = 'ARMOR',         // 护甲
  ACCESSORY = 'ACCESSORY', // 饰品
  BOOTS = 'BOOTS',         // 鞋子
  RING = 'RING',           // 戒指
  NECKLACE = 'NECKLACE',   // 项链
}

// 物品基础信息
export type Item = {
  id: string
  name: string
  description: string
  type: ItemType
  quality: ItemQuality
  icon?: string
  level: number
  stackable: boolean
  maxStack: number
  price: number
  
  // 装备属性
  slot?: EquipmentSlot
  stats?: ItemStats
  
  // 消耗品效果
  effects?: ItemEffect[]
  
  // 其他
  tradeable: boolean
  sellable: boolean
}

// 物品属性
export type ItemStats = {
  attack?: number
  defense?: number
  health?: number
  mana?: number
  speed?: number
  critRate?: number
  critDamage?: number
  
  // 修炼相关
  cultivationSpeed?: number
  breakthroughChance?: number
  expBonus?: number
}

// 物品效果
export type ItemEffect = {
  type: 'HEAL' | 'BUFF' | 'DEBUFF' | 'EXP' | 'CURRENCY'
  value: number
  duration?: number
  description: string
}

// 背包物品
export type InventoryItem = {
  item: Item
  quantity: number
  equipped: boolean
  slot?: EquipmentSlot
}

// 装备配置
export type EquipmentSet = {
  weapon?: Item
  armor?: Item
  accessory?: Item
  boots?: Item
  ring?: Item
  necklace?: Item
}

// 背包操作结果
export type InventoryActionResult = {
  success: boolean
  message: string
  item?: Item
  quantity?: number
}

// 背包统计
export type InventoryStats = {
  totalItems: number
  usedSlots: number
  maxSlots: number
  totalValue: number
  equippedPower: number
}