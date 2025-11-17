import { z } from 'zod'
import { ItemType, ItemQuality, EquipmentSlot } from './types'

/**
 * 背包系统数据验证Schema
 */

// 添加物品到背包
export const addItemSchema = z.object({
  itemId: z.string().uuid('无效的物品ID'),
  quantity: z.number()
    .int('数量必须是整数')
    .min(1, '数量至少为1')
    .max(9999, '单次添加不能超过9999'),
})

// 移除物品
export const removeItemSchema = z.object({
  itemId: z.string().uuid('无效的物品ID'),
  quantity: z.number()
    .int('数量必须是整数')
    .min(1, '数量至少为1'),
})

// 使用物品
export const useItemSchema = z.object({
  itemId: z.string().uuid('无效的物品ID'),
  quantity: z.number()
    .int('数量必须是整数')
    .min(1, '数量至少为1')
    .default(1),
  targetId: z.string().uuid().optional(), // 目标玩家ID(可选)
})

// 装备物品
export const equipItemSchema = z.object({
  itemId: z.string().uuid('无效的物品ID'),
  slot: z.nativeEnum(EquipmentSlot, {
    errorMap: () => ({ message: '无效的装备槽位' })
  }),
})

// 卸下装备
export const unequipItemSchema = z.object({
  slot: z.nativeEnum(EquipmentSlot, {
    errorMap: () => ({ message: '无效的装备槽位' })
  }),
})

// 出售物品
export const sellItemSchema = z.object({
  itemId: z.string().uuid('无效的物品ID'),
  quantity: z.number()
    .int('数量必须是整数')
    .min(1, '数量至少为1'),
})

// 交易物品
export const tradeItemSchema = z.object({
  itemId: z.string().uuid('无效的物品ID'),
  quantity: z.number()
    .int('数量必须是整数')
    .min(1, '数量至少为1'),
  targetPlayerId: z.number().int().positive('无效的玩家ID'),
  price: z.number()
    .int('价格必须是整数')
    .min(0, '价格不能为负'),
})

// 查询背包
export const getInventorySchema = z.object({
  playerId: z.number().int().positive(),
  type: z.nativeEnum(ItemType).optional(),
  quality: z.nativeEnum(ItemQuality).optional(),
  equipped: z.boolean().optional(),
})

// 排序背包
export const sortInventorySchema = z.object({
  sortBy: z.enum(['NAME', 'TYPE', 'QUALITY', 'LEVEL', 'QUANTITY', 'VALUE']),
  order: z.enum(['ASC', 'DESC']).default('ASC'),
})

// 类型推断
export type AddItemInput = z.infer<typeof addItemSchema>
export type RemoveItemInput = z.infer<typeof removeItemSchema>
export type UseItemInput = z.infer<typeof useItemSchema>
export type EquipItemInput = z.infer<typeof equipItemSchema>
export type UnequipItemInput = z.infer<typeof unequipItemSchema>
export type SellItemInput = z.infer<typeof sellItemSchema>
export type TradeItemInput = z.infer<typeof tradeItemSchema>
export type GetInventoryInput = z.infer<typeof getInventorySchema>
export type SortInventoryInput = z.infer<typeof sortInventorySchema>