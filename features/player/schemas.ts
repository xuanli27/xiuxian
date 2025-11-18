import { z } from 'zod'

/**
 * 玩家数据验证Schema
 */

export const createPlayerSchema = z.object({
  name: z.string()
    .min(2, '名称至少2个字符')
    .max(20, '名称最多20个字符')
    .regex(/^[\u4e00-\u9fa5a-zA-Z0-9]+$/, '只能包含中文、英文和数字'),
  spiritRoot: z.enum(['HEAVEN', 'EARTH', 'HUMAN', 'WASTE']),
})

export const updatePlayerSchema = z.object({
  name: z.string()
    .min(2, '名称至少2个字符')
    .max(20, '名称最多20个字符')
    .regex(/^[\u4e00-\u9fa5a-zA-Z0-9]+$/, '只能包含中文、英文和数字')
    .optional(),
  rank: z.enum(['MORTAL', 'QI_REFINING', 'FOUNDATION', 'GOLDEN_CORE', 'NASCENT_SOUL', 'SPIRIT_SEVERING', 'VOID_REFINING', 'MAHAYANA', 'IMMORTAL']).optional(),
  level: z.number().int().min(1).optional(),
  qi: z.number().min(0).optional(),
  maxQi: z.number().min(0).optional(),
  spiritStones: z.number().int().min(0).optional(),
})

export const levelUpSchema = z.object({
  playerId: z.number().int(),
})

export const addQiSchema = z.object({
  playerId: z.number().int(),
  amount: z.number().min(1),
})

export const addSpiritStonesSchema = z.object({
  playerId: z.number().int(),
  amount: z.number().int().min(1),
})

export type CreatePlayerInput = z.infer<typeof createPlayerSchema>
export type UpdatePlayerInput = z.infer<typeof updatePlayerSchema>
export type LevelUpInput = z.infer<typeof levelUpSchema>
export type AddQiInput = z.infer<typeof addQiSchema>
export type AddSpiritStonesInput = z.infer<typeof addSpiritStonesSchema>