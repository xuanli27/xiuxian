import { z } from 'zod'
import { Rank } from '@prisma/client'

/**
 * 修炼系统数据验证Schema
 */

// 开始修炼
export const startMeditationSchema = z.object({
  duration: z.number()
    .int('持续时间必须是整数')
    .min(1, '至少修炼1分钟')
    .max(1440, '单次修炼不能超过24小时'),
  boost: z.number()
    .min(1)
    .max(10)
    .default(1)
    .optional(),
})

// 开始闭关
export const startRetreatSchema = z.object({
  duration: z.number()
    .int('持续时间必须是整数')
    .min(60, '闭关至少需要1小时')
    .max(10080, '单次闭关不能超过7天'),
  resources: z.array(z.object({
    itemId: z.string(),
    quantity: z.number().int().min(1)
  })).optional(),
})

// 境界突破
export const breakthroughSchema = z.object({
  playerId: z.number().int().positive(),
  useItems: z.array(z.object({
    itemId: z.string(),
    quantity: z.number().int().min(1)
  })).optional(),
})

// 查询修炼记录
export const getCultivationRecordsSchema = z.object({
  playerId: z.number().int().positive(),
  limit: z.number().int().min(1).max(100).default(20),
  type: z.enum(['MEDITATION', 'BREAKTHROUGH', 'RETREAT']).optional(),
})

// 类型推断
export type StartMeditationInput = z.infer<typeof startMeditationSchema>
export type StartRetreatInput = z.infer<typeof startRetreatSchema>
export type BreakthroughInput = z.infer<typeof breakthroughSchema>
export type GetCultivationRecordsInput = z.infer<typeof getCultivationRecordsSchema>