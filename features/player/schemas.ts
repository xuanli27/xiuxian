import { z } from 'zod'

/**
 * 玩家数据验证Schema
 */

export const createPlayerSchema = z.object({
  name: z.string()
    .min(2, '名称至少2个字符')
    .max(20, '名称最多20个字符')
    .regex(/^[\u4e00-\u9fa5a-zA-Z0-9]+$/, '只能包含中文、英文和数字'),
  spiritRoot: z.enum(['METAL', 'WOOD', 'WATER', 'FIRE', 'EARTH']),
})

export const updatePlayerSchema = z.object({
  name: z.string()
    .min(2, '名称至少2个字符')
    .max(20, '名称最多20个字符')
    .regex(/^[\u4e00-\u9fa5a-zA-Z0-9]+$/, '只能包含中文、英文和数字')
    .optional(),
  realm: z.string().optional(),
  experience: z.number().int().min(0).optional(),
  currency: z.number().int().min(0).optional(),
})

export const levelUpSchema = z.object({
  playerId: z.string().uuid(),
})

export const addExperienceSchema = z.object({
  playerId: z.string().uuid(),
  amount: z.number().int().min(1),
})

export const addCurrencySchema = z.object({
  playerId: z.string().uuid(),
  amount: z.number().int().min(1),
})

export type CreatePlayerInput = z.infer<typeof createPlayerSchema>
export type UpdatePlayerInput = z.infer<typeof updatePlayerSchema>
export type LevelUpInput = z.infer<typeof levelUpSchema>
export type AddExperienceInput = z.infer<typeof addExperienceSchema>
export type AddCurrencyInput = z.infer<typeof addCurrencySchema>