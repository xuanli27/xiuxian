import { z } from 'zod'
import { BuildingType, CaveLevel } from './types'

/**
 * 洞府系统数据验证Schema
 */

// 创建洞府
export const createCaveSchema = z.object({
  name: z.string()
    .min(2, '洞府名称至少2个字符')
    .max(20, '洞府名称最多20个字符')
    .regex(/^[\u4e00-\u9fa5a-zA-Z0-9\s]+$/, '只能包含中文、英文、数字和空格'),
})

// 升级洞府
export const upgradeCaveSchema = z.object({
  playerId: z.number().int().positive(),
})

// 建造建筑
export const buildBuildingSchema = z.object({
  buildingType: z.nativeEnum(BuildingType, {
    errorMap: () => ({ message: '无效的建筑类型' })
  }),
  position: z.object({
    x: z.number().int().min(0).max(10),
    y: z.number().int().min(0).max(10),
  }),
})

// 升级建筑
export const upgradeBuildingSchema = z.object({
  buildingId: z.string().uuid('无效的建筑ID'),
})

// 拆除建筑
export const demolishBuildingSchema = z.object({
  buildingId: z.string().uuid('无效的建筑ID'),
  confirm: z.literal(true, {
    errorMap: () => ({ message: '必须确认拆除操作' })
  }),
})

// 加速建造
export const speedUpBuildSchema = z.object({
  buildingId: z.string().uuid('无效的建筑ID'),
  useSpiritStones: z.boolean().default(true),
})

// 开始生产
export const startProductionSchema = z.object({
  buildingId: z.string().uuid('无效的建筑ID'),
  productType: z.string().min(1),
  quantity: z.number().int().min(1).max(100),
  materials: z.array(z.object({
    itemId: z.string(),
    quantity: z.number().int().min(1)
  })).optional(),
})

// 收集产出
export const collectProductionSchema = z.object({
  buildingId: z.string().uuid('无效的建筑ID'),
})

// 收集所有资源
export const collectAllResourcesSchema = z.object({
  playerId: z.number().int().positive(),
})

// 改名洞府
export const renameCaveSchema = z.object({
  newName: z.string()
    .min(2, '洞府名称至少2个字符')
    .max(20, '洞府名称最多20个字符')
    .regex(/^[\u4e00-\u9fa5a-zA-Z0-9\s]+$/, '只能包含中文、英文、数字和空格'),
})

// 布置阵法
export const deployFormationSchema = z.object({
  formationType: z.string().min(1),
  position: z.object({
    x: z.number().int().min(0).max(10),
    y: z.number().int().min(0).max(10),
  }),
})

// 类型推断
export type CreateCaveInput = z.infer<typeof createCaveSchema>
export type UpgradeCaveInput = z.infer<typeof upgradeCaveSchema>
export type BuildBuildingInput = z.infer<typeof buildBuildingSchema>
export type UpgradeBuildingInput = z.infer<typeof upgradeBuildingSchema>
export type DemolishBuildingInput = z.infer<typeof demolishBuildingSchema>
export type SpeedUpBuildInput = z.infer<typeof speedUpBuildSchema>
export type StartProductionInput = z.infer<typeof startProductionSchema>
export type CollectProductionInput = z.infer<typeof collectProductionSchema>
export type CollectAllResourcesInput = z.infer<typeof collectAllResourcesSchema>
export type RenameCaveInput = z.infer<typeof renameCaveSchema>
export type DeployFormationInput = z.infer<typeof deployFormationSchema>

// 炼制物品
export const craftItemSchema = z.object({
  recipeId: z.string().min(1, '配方ID不能为空'),
})

export type CraftItemInput = z.infer<typeof craftItemSchema>