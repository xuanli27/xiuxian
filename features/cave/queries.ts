import { cache } from 'react'
import { prisma } from '@/lib/db/prisma'
import type { Cave, Building, CaveStats, CaveResources } from './types'
import { BuildingStatus } from './types'

/**
 * 洞府系统数据查询函数
 */

/**
 * 获取玩家洞府信息
 */
export const getPlayerCave = cache(async (playerId: number): Promise<Cave | null> => {
  const player = await prisma.player.findUnique({
    where: { id: playerId },
    select: {
      id: true,
      caveLevel: true,
      materials: true,
      lastLoginTime: true,
      createTime: true,
    }
  })

  if (!player) return null

  // 从materials JSON字段解析洞府数据
  const materials = typeof player.materials === 'object' && player.materials !== null
    ? player.materials as Record<string, any>
    : {}

  const caveData = materials.cave || {}

  return {
    playerId: player.id,
    level: player.caveLevel,
    name: caveData.name || '无名洞府',
    spiritDensity: caveData.spiritDensity || 100,
    buildings: caveData.buildings || [],
    resources: caveData.resources || {
      spiritualEnergy: 0,
      herbs: 0,
      ores: 0,
      pills: 0,
      artifacts: 0,
    },
    lastCollectAt: caveData.lastCollectAt ? new Date(caveData.lastCollectAt) : player.createTime,
    createdAt: player.createTime,
    updatedAt: player.lastLoginTime,
  }
})

/**
 * 获取洞府建筑列表
 */
export const getCaveBuildings = cache(async (playerId: number): Promise<Building[]> => {
  const cave = await getPlayerCave(playerId)
  return cave?.buildings || []
})

/**
 * 获取特定建筑
 */
export const getBuilding = cache(async (
  playerId: number,
  buildingId: string
): Promise<Building | null> => {
  const buildings = await getCaveBuildings(playerId)
  return buildings.find(b => b.id === buildingId) || null
})

/**
 * 获取洞府统计
 */
export const getCaveStats = cache(async (playerId: number): Promise<CaveStats> => {
  const cave = await getPlayerCave(playerId)
  
  if (!cave) {
    return {
      totalBuildings: 0,
      activeBuildings: 0,
      productionRate: 0,
      defensePower: 0,
      storageCapacity: 1000,
      dailyIncome: {
        spiritualEnergy: 0,
        herbs: 0,
        ores: 0,
        pills: 0,
        artifacts: 0,
      }
    }
  }

  const totalBuildings = cave.buildings.length
  const activeBuildings = cave.buildings.filter(b => 
    b.status === BuildingStatus.ACTIVE
  ).length

  // 计算生产速率
  const productionRate = cave.buildings.reduce((sum, building) => {
    if (building.status === BuildingStatus.ACTIVE && building.effects) {
      const productionEffect = building.effects.find(e => e.type === 'PRODUCTION')
      return sum + (productionEffect?.value || 0)
    }
    return sum
  }, 0)

  // 计算防御力
  const defensePower = cave.buildings.reduce((sum, building) => {
    if (building.effects) {
      const defenseEffect = building.effects.find(e => e.type === 'DEFENSE')
      return sum + (defenseEffect?.value || 0)
    }
    return sum
  }, 0)

  // 计算储存容量
  const storageCapacity = 1000 + cave.buildings.reduce((sum, building) => {
    if (building.effects) {
      const storageEffect = building.effects.find(e => e.type === 'STORAGE')
      return sum + (storageEffect?.value || 0)
    }
    return sum
  }, 0)

  // 计算每日收入
  const baseIncome = cave.level * 10
  const dailyIncome: CaveResources = {
    spiritualEnergy: baseIncome * cave.spiritDensity / 100,
    herbs: Math.floor(baseIncome * 0.5),
    ores: Math.floor(baseIncome * 0.3),
    pills: 0,
    artifacts: 0,
  }

  return {
    totalBuildings,
    activeBuildings,
    productionRate,
    defensePower,
    storageCapacity,
    dailyIncome,
  }
})

/**
 * 检查建筑是否可以建造
 */
export const canBuildBuilding = cache(async (
  playerId: number,
  buildingType: string
): Promise<boolean> => {
  const cave = await getPlayerCave(playerId)
  if (!cave) return false

  // TODO: 检查洞府等级要求
  // TODO: 检查资源是否足够
  // TODO: 检查是否已达到建筑数量上限

  return true
})

/**
 * 计算离线收益
 */
export const calculateOfflineRewards = cache(async (
  playerId: number
): Promise<CaveResources> => {
  const cave = await getPlayerCave(playerId)
  if (!cave) {
    return {
      spiritualEnergy: 0,
      herbs: 0,
      ores: 0,
      pills: 0,
      artifacts: 0,
    }
  }

  const now = new Date()
  const lastCollect = cave.lastCollectAt
  const hoursOffline = Math.floor((now.getTime() - lastCollect.getTime()) / (1000 * 60 * 60))
  
  // 最多计算24小时的离线收益
  const effectiveHours = Math.min(hoursOffline, 24)

  const stats = await getCaveStats(playerId)
  const hourlyIncome = {
    spiritualEnergy: stats.dailyIncome.spiritualEnergy / 24,
    herbs: stats.dailyIncome.herbs / 24,
    ores: stats.dailyIncome.ores / 24,
    pills: stats.dailyIncome.pills / 24,
    artifacts: stats.dailyIncome.artifacts / 24,
  }

  return {
    spiritualEnergy: Math.floor(hourlyIncome.spiritualEnergy * effectiveHours),
    herbs: Math.floor(hourlyIncome.herbs * effectiveHours),
    ores: Math.floor(hourlyIncome.ores * effectiveHours),
    pills: Math.floor(hourlyIncome.pills * effectiveHours),
    artifacts: Math.floor(hourlyIncome.artifacts * effectiveHours),
  }
})