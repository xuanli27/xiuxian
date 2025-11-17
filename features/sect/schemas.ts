import { z } from 'zod'

/**
 * 门派系统数据验证Schema
 */

// 加入门派
export const joinSectSchema = z.object({
  playerId: z.number().int().positive(),
})

// 离开门派
export const leaveSectSchema = z.object({
  playerId: z.number().int().positive(),
  confirm: z.literal(true, {
    errorMap: () => ({ message: '必须确认离开门派操作' })
  }),
})

// 捐献资源
export const donateSchema = z.object({
  amount: z.number()
    .int('捐献数量必须是整数')
    .min(1, '至少捐献1个单位')
    .max(10000, '单次捐献不能超过10000'),
  resourceType: z.enum(['SPIRIT_STONES', 'MATERIALS', 'PILLS'], {
    errorMap: () => ({ message: '无效的资源类型' })
  }),
})

// 申请晋升
export const requestPromotionSchema = z.object({
  playerId: z.number().int().positive(),
})

// 接取门派任务
export const acceptSectMissionSchema = z.object({
  missionId: z.string().uuid('无效的任务ID'),
})

// 完成门派任务
export const completeSectMissionSchema = z.object({
  missionId: z.string().uuid('无效的任务ID'),
  proof: z.string().optional(), // 完成证明
})

// 兑换商店物品
export const redeemShopItemSchema = z.object({
  itemId: z.string().uuid('无效的物品ID'),
  quantity: z.number()
    .int('数量必须是整数')
    .min(1, '至少兑换1个')
    .max(99, '单次兑换不能超过99个'),
})

// 查询门派成员
export const getSectMembersSchema = z.object({
  page: z.number().int().min(1).default(1),
  pageSize: z.number().int().min(1).max(100).default(20),
  sortBy: z.enum(['CONTRIBUTION', 'RANK', 'JOIN_DATE', 'LAST_ACTIVE']).default('CONTRIBUTION'),
  order: z.enum(['ASC', 'DESC']).default('DESC'),
})

// 查询贡献记录
export const getContributionRecordsSchema = z.object({
  playerId: z.number().int().positive(),
  limit: z.number().int().min(1).max(100).default(20),
  type: z.enum(['TASK', 'DONATION', 'MISSION', 'EVENT']).optional(),
})

// 类型推断
export type JoinSectInput = z.infer<typeof joinSectSchema>
export type LeaveSectInput = z.infer<typeof leaveSectSchema>
export type DonateInput = z.infer<typeof donateSchema>
export type RequestPromotionInput = z.infer<typeof requestPromotionSchema>
export type AcceptSectMissionInput = z.infer<typeof acceptSectMissionSchema>
export type CompleteSectMissionInput = z.infer<typeof completeSectMissionSchema>
export type RedeemShopItemInput = z.infer<typeof redeemShopItemSchema>
export type GetSectMembersInput = z.infer<typeof getSectMembersSchema>
export type GetContributionRecordsInput = z.infer<typeof getContributionRecordsSchema>