import type { BuildingType, CaveLevel, BuildingCost, Building } from './types'

/**
 * 洞府系统工具函数
 */

/**
 * 洞府等级名称映射
 */
export const CAVE_LEVEL_NAMES: Record<CaveLevel, string> = {
  1: '简陋洞府',
  2: '基础洞府',
  3: '中级洞府',
  4: '高级洞府',
  5: '上等洞府',
  6: '至尊洞府',
}

/**
 * 建筑类型名称映射
 */
export const BUILDING_TYPE_NAMES: Record<BuildingType, string> = {
  SPIRIT_FIELD: '灵田',
  ALCHEMY_LAB: '炼丹房',
  REFINING_ROOM: '炼器室',
  MEDITATION_ROOM: '修炼室',
  STORAGE: '储物间',
  SPIRIT_SPRING: '灵泉',
  FORMATION: '护山阵法',
}

/**
 * 计算洞府升级消耗
 */
export function calculateCaveUpgradeCost(currentLevel: CaveLevel): BuildingCost {
  return {
    spiritStones: currentLevel * 1000,
    materials: {
      'spirit_wood': currentLevel * 10,
      'spirit_stone': currentLevel * 5,
    },
    time: currentLevel * 60, // 分钟
  }
}

/**
 * 计算建筑建造消耗
 */
export function calculateBuildCost(
  buildingType: BuildingType,
  level: number = 1
): BuildingCost {
  const baseCosts: Record<BuildingType, BuildingCost> = {
    SPIRIT_FIELD: {
      spiritStones: 100,
      materials: { 'soil': 10, 'seeds': 5 },
      time: 30,
    },
    ALCHEMY_LAB: {
      spiritStones: 500,
      materials: { 'furnace': 1, 'cauldron': 1 },
      time: 120,
    },
    REFINING_ROOM: {
      spiritStones: 500,
      materials: { 'forge': 1, 'anvil': 1 },
      time: 120,
    },
    MEDITATION_ROOM: {
      spiritStones: 200,
      materials: { 'cushion': 1, 'incense': 5 },
      time: 60,
    },
    STORAGE: {
      spiritStones: 150,
      materials: { 'wood': 20 },
      time: 45,
    },
    SPIRIT_SPRING: {
      spiritStones: 1000,
      materials: { 'spirit_crystal': 10 },
      time: 240,
    },
    FORMATION: {
      spiritStones: 2000,
      materials: { 'formation_flag': 8 },
      time: 360,
    },
  }

  const baseCost = baseCosts[buildingType]
  const multiplier = Math.pow(1.5, level - 1)

  return {
    spiritStones: Math.floor(baseCost.spiritStones * multiplier),
    materials: Object.fromEntries(
      Object.entries(baseCost.materials).map(([key, value]) => [
        key,
        Math.floor(value * multiplier),
      ])
    ),
    time: Math.floor(baseCost.time * multiplier),
  }
}

/**
 * 计算建筑升级消耗
 */
export function calculateUpgradeCost(building: Building): BuildingCost {
  return calculateBuildCost(building.type, building.level + 1)
}

/**
 * 计算加速建造消耗的灵石
 */
export function calculateSpeedUpCost(remainingMinutes: number): number {
  // 每分钟消耗10灵石
  return Math.ceil(remainingMinutes * 10)
}

/**
 * 检查建筑是否完成
 */
export function isBuildingComplete(building: Building): boolean {
  if (!building.buildEndAt) return true
  return new Date() >= building.buildEndAt
}

/**
 * 计算建筑剩余时间(分钟)
 */
export function getRemainingBuildTime(building: Building): number {
  if (!building.buildEndAt) return 0
  const now = new Date()
  const remaining = building.buildEndAt.getTime() - now.getTime()
  return Math.max(0, Math.ceil(remaining / (1000 * 60)))
}

/**
 * 格式化建造时间
 */
export function formatBuildTime(minutes: number): string {
  if (minutes < 60) {
    return `${minutes}分钟`
  } else if (minutes < 1440) {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return mins > 0 ? `${hours}小时${mins}分钟` : `${hours}小时`
  } else {
    const days = Math.floor(minutes / 1440)
    const hours = Math.floor((minutes % 1440) / 60)
    return hours > 0 ? `${days}天${hours}小时` : `${days}天`
  }
}

/**
 * 获取建筑最大等级
 */
export function getMaxBuildingLevel(buildingType: BuildingType): number {
  const maxLevels: Record<BuildingType, number> = {
    SPIRIT_FIELD: 10,
    ALCHEMY_LAB: 10,
    REFINING_ROOM: 10,
    MEDITATION_ROOM: 10,
    STORAGE: 15,
    SPIRIT_SPRING: 5,
    FORMATION: 5,
  }
  return maxLevels[buildingType]
}

/**
 * 检查洞府等级是否可以建造该建筑
 */
export function canUnlockBuilding(
  caveLevel: CaveLevel,
  buildingType: BuildingType
): boolean {
  const requiredLevels: Record<BuildingType, CaveLevel> = {
    SPIRIT_FIELD: 1,
    MEDITATION_ROOM: 1,
    STORAGE: 1,
    ALCHEMY_LAB: 2,
    REFINING_ROOM: 2,
    SPIRIT_SPRING: 3,
    FORMATION: 4,
  }
  return caveLevel >= requiredLevels[buildingType]
}

/**
 * 计算灵气浓度加成
 */
export function calculateSpiritDensityBonus(buildings: Building[]): number {
  let bonus = 0
  
  buildings.forEach(building => {
    if (building.type === 'SPIRIT_SPRING' && building.status === 'ACTIVE') {
      bonus += building.level * 10
    }
    if (building.type === 'FORMATION' && building.status === 'ACTIVE') {
      bonus += building.level * 5
    }
  })
  
  return bonus
}

/**
 * 计算储存容量
 */
export function calculateStorageCapacity(buildings: Building[]): number {
  let capacity = 1000 // 基础容量
  
  buildings.forEach(building => {
    if (building.type === 'STORAGE' && building.status === 'ACTIVE') {
      capacity += building.level * 100
    }
  })
  
  return capacity
}

/**
 * 获取建筑描述
 */
export function getBuildingDescription(buildingType: BuildingType): string {
  const descriptions: Record<BuildingType, string> = {
    SPIRIT_FIELD: '种植灵草灵药,每日产出灵草',
    ALCHEMY_LAB: '炼制各种丹药,提升修炼效率',
    REFINING_ROOM: '炼制法宝装备,增强战斗力',
    MEDITATION_ROOM: '提供修炼加成,加快境界突破',
    STORAGE: '扩充储存空间,存放更多物品',
    SPIRIT_SPRING: '提升洞府灵气浓度,加快资源产出',
    FORMATION: '保护洞府安全,抵御外敌入侵',
  }
  return descriptions[buildingType]
}

/**
 * 生成建筑ID
 */
export function generateBuildingId(): string {
  return `building_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}