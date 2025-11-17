import { z } from 'zod'
import { TribulationType, TribulationDifficulty } from './types'

/**
 * 渡劫系统数据验证Schema
 */

// 开始渡劫
export const startTribulationSchema = z.object({
  playerId: z.number().int().positive(),
  preparation: z.object({
    items: z.array(z.object({
      itemId: z.string(),
      quantity: z.number().int().min(1)
    })).optional(),
    pills: z.array(z.string()).optional(),
  }).optional(),
})

// 渡劫行动
export const tribulationActionSchema = z.object({
  tribulationId: z.string().uuid('无效的渡劫ID'),
  action: z.enum(['DEFEND', 'ATTACK', 'DODGE', 'HEAL', 'USE_ITEM']),
  itemId: z.string().optional(),
})

// 使用物品
export const useTribulationItemSchema = z.object({
  tribulationId: z.string().uuid('无效的渡劫ID'),
  itemId: z.string().uuid('无效的物品ID'),
})

// 放弃渡劫
export const abandonTribulationSchema = z.object({
  tribulationId: z.string().uuid('无效的渡劫ID'),
  confirm: z.literal(true, {
    errorMap: () => ({ message: '必须确认放弃渡劫' })
  }),
})

// 查询渡劫历史
export const getTribulationHistorySchema = z.object({
  playerId: z.number().int().positive(),
  limit: z.number().int().min(1).max(100).default(20),
})

// 获取渡劫统计
export const getTribulationStatsSchema = z.object({
  playerId: z.number().int().positive(),
})

// 类型推断
export type StartTribulationInput = z.infer<typeof startTribulationSchema>
export type TribulationActionInput = z.infer<typeof tribulationActionSchema>
export type UseTribulationItemInput = z.infer<typeof useTribulationItemSchema>
export type AbandonTribulationInput = z.infer<typeof abandonTribulationSchema>
export type GetTribulationHistoryInput = z.infer<typeof getTribulationHistorySchema>
export type GetTribulationStatsInput = z.infer<typeof getTribulationStatsSchema>