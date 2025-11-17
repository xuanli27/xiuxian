'use server'

import { prisma } from '@/lib/db/prisma'
import { getCurrentUserId } from '@/lib/auth/guards'
import { revalidatePath } from 'next/cache'
import {
  createCaveSchema,
  upgradeCaveSchema,
  buildBuildingSchema,
  upgradeBuildingSchema,
  demolishBuildingSchema,
  speedUpBuildSchema,
  collectAllResourcesSchema,
} from './schemas'
import {
  calculateCaveUpgradeCost,
  calculateBuildCost,
  calculateUpgradeCost,
  calculateSpeedUpCost,
  generateBuildingId,
  canUnlockBuilding,
  getRemainingBuildTime,
} from './utils'
import { BuildingStatus } from './types'
import type { UpgradeResult, CollectResult } from './types'

/**
 * Cave Server Actions
 */

/**
 * 创建洞府
 */
export async function createCave(input: { name: string }) {
  const userId = await getCurrentUserId()
  
  // 验证输入
  const validated = createCaveSchema.parse(input)
  
  // 获取玩家
  const player = await prisma.player.findUnique({
    where: { userId }
  })
  
  if (!player) {
    throw new Error('玩家不存在')
  }
  
  // 初始化洞府数据
  const materials = typeof player.materials === 'object' && player.materials !== null
    ? player.materials as Record<string, any>
    : {}
  
  materials.cave = {
    name: validated.name,
    spiritDensity: 100,
    buildings: [],
    resources: {
      spiritualEnergy: 0,
      herbs: 0,
      ores: 0,
      pills: 0,
      artifacts: 0,
    },
    lastCollectAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  }
  
  // 更新玩家
  await prisma.player.update({
    where: { id: player.id },
    data: {
      caveLevel: 1,
      materials: materials as any,
    }
  })
  
  revalidatePath('/cave')
  
  return {
    success: true,
    message: `洞府"${validated.name}"创建成功!`
  }
}

/**
 * 升级洞府
 */
export async function upgradeCave(input: { playerId: number }): Promise<UpgradeResult> {
  const userId = await getCurrentUserId()
  
  // 验证输入
  const validated = upgradeCaveSchema.parse(input)
  
  // 获取玩家
  const player = await prisma.player.findUnique({
    where: { id: validated.playerId, userId }
  })
  
  if (!player) {
    throw new Error('玩家不存在')
  }
  
  if (player.caveLevel >= 6) {
    return {
      success: false,
      newLevel: player.caveLevel,
      message: '洞府已达到最高等级!'
    }
  }
  
  // 计算消耗
  const cost = calculateCaveUpgradeCost(player.caveLevel)
  
  // 检查资源
  if (player.spiritStones < cost.spiritStones) {
    return {
      success: false,
      newLevel: player.caveLevel,
      message: `灵石不足!需要${cost.spiritStones}灵石`,
      cost
    }
  }
  
  const newLevel = player.caveLevel + 1
  
  // 升级洞府
  await prisma.player.update({
    where: { id: player.id },
    data: {
      caveLevel: newLevel,
      spiritStones: {
        decrement: cost.spiritStones
      },
      history: {
        push: {
          type: 'CAVE_UPGRADE',
          timestamp: new Date().toISOString(),
          levelBefore: player.caveLevel,
          levelAfter: newLevel
        }
      }
    }
  })
  
  revalidatePath('/cave')
  
  return {
    success: true,
    newLevel,
    message: `洞府升级到${newLevel}级成功!`,
    cost
  }
}

/**
 * 建造建筑
 */
export async function buildBuilding(input: {
  buildingType: string
  position: { x: number; y: number }
}) {
  const userId = await getCurrentUserId()
  
  // 验证输入
  const validated = buildBuildingSchema.parse(input)
  
  // 获取玩家
  const player = await prisma.player.findUnique({
    where: { userId }
  })
  
  if (!player) {
    throw new Error('玩家不存在')
  }
  
  // 检查是否可以建造
  if (!canUnlockBuilding(player.caveLevel, validated.buildingType)) {
    throw new Error('洞府等级不足,无法建造此建筑')
  }
  
  // 计算消耗
  const cost = calculateBuildCost(validated.buildingType, 1)
  
  // 检查资源
  if (player.spiritStones < cost.spiritStones) {
    throw new Error(`灵石不足!需要${cost.spiritStones}灵石`)
  }
  
  // 解析洞府数据
  const materials = typeof player.materials === 'object' && player.materials !== null
    ? player.materials as Record<string, any>
    : {}
  
  const cave = materials.cave || {}
  const buildings = cave.buildings || []
  
  // 创建新建筑
  const now = new Date()
  const buildEndAt = new Date(now.getTime() + cost.time * 60 * 1000)
  
  const newBuilding = {
    id: generateBuildingId(),
    type: validated.buildingType,
    level: 1,
    status: BuildingStatus.BUILDING,
    position: validated.position,
    buildStartAt: now.toISOString(),
    buildEndAt: buildEndAt.toISOString(),
    buildCost: cost,
  }
  
  buildings.push(newBuilding)
  cave.buildings = buildings
  materials.cave = cave
  
  // 更新数据库
  await prisma.player.update({
    where: { id: player.id },
    data: {
      spiritStones: {
        decrement: cost.spiritStones
      },
      materials: materials as any,
      history: {
        push: {
          type: 'BUILD',
          timestamp: now.toISOString(),
          buildingType: validated.buildingType,
          position: validated.position
        }
      }
    }
  })
  
  revalidatePath('/cave')
  
  return {
    success: true,
    message: `开始建造${validated.buildingType}`,
    building: newBuilding
  }
}

/**
 * 加速建造
 */
export async function speedUpBuild(input: {
  buildingId: string
  useSpiritStones?: boolean
}) {
  const userId = await getCurrentUserId()
  
  // 验证输入
  const validated = speedUpBuildSchema.parse(input)
  
  // 获取玩家
  const player = await prisma.player.findUnique({
    where: { userId }
  })
  
  if (!player) {
    throw new Error('玩家不存在')
  }
  
  // 解析洞府数据
  const materials = typeof player.materials === 'object' && player.materials !== null
    ? player.materials as Record<string, any>
    : {}
  
  const cave = materials.cave || {}
  const buildings = cave.buildings || []
  
  // 查找建筑
  const buildingIndex = buildings.findIndex((b: any) => b.id === validated.buildingId)
  if (buildingIndex === -1) {
    throw new Error('建筑不存在')
  }
  
  const building = buildings[buildingIndex]
  
  if (building.status !== BuildingStatus.BUILDING && building.status !== BuildingStatus.UPGRADING) {
    throw new Error('建筑不在建造或升级中')
  }
  
  // 计算剩余时间和消耗
  const remainingMinutes = getRemainingBuildTime(building)
  const cost = calculateSpeedUpCost(remainingMinutes)
  
  // 检查资源
  if (player.spiritStones < cost) {
    throw new Error(`灵石不足!需要${cost}灵石`)
  }
  
  // 立即完成建造
  building.status = BuildingStatus.ACTIVE
  building.buildEndAt = new Date().toISOString()
  buildings[buildingIndex] = building
  
  cave.buildings = buildings
  materials.cave = cave
  
  // 更新数据库
  await prisma.player.update({
    where: { id: player.id },
    data: {
      spiritStones: {
        decrement: cost
      },
      materials: materials as any
    }
  })
  
  revalidatePath('/cave')
  
  return {
    success: true,
    message: '建造加速完成!',
    cost
  }
}

/**
 * 收集所有资源
 */
export async function collectAllResources(input: {
  playerId: number
}): Promise<CollectResult> {
  const userId = await getCurrentUserId()
  
  // 验证输入
  const validated = collectAllResourcesSchema.parse(input)
  
  // 获取玩家
  const player = await prisma.player.findUnique({
    where: { id: validated.playerId, userId }
  })
  
  if (!player) {
    throw new Error('玩家不存在')
  }
  
  // TODO: 计算离线收益
  // 这里应该根据建筑类型和等级计算产出
  
  const materials = typeof player.materials === 'object' && player.materials !== null
    ? player.materials as Record<string, any>
    : {}
  
  const cave = materials.cave || {}
  const resources = cave.resources || {
    spiritualEnergy: 0,
    herbs: 0,
    ores: 0,
    pills: 0,
    artifacts: 0,
  }
  
  // 简单的资源收集(基于洞府等级)
  const collected = {
    spiritualEnergy: player.caveLevel * 10,
    herbs: player.caveLevel * 5,
    ores: player.caveLevel * 3,
    pills: 0,
    artifacts: 0,
  }
  
  resources.spiritualEnergy += collected.spiritualEnergy
  resources.herbs += collected.herbs
  resources.ores += collected.ores
  
  cave.resources = resources
  cave.lastCollectAt = new Date().toISOString()
  materials.cave = cave
  
  // 更新数据库
  await prisma.player.update({
    where: { id: player.id },
    data: {
      materials: materials as any
    }
  })
  
  revalidatePath('/cave')
  
  return {
    success: true,
    resources: collected,
    message: '资源收集完成!'
  }
}