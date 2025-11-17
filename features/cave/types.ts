/**
 * 洞府系统类型定义
 */

// 洞府等级
export enum CaveLevel {
  SIMPLE = 1,      // 简陋洞府
  BASIC = 2,       // 基础洞府
  INTERMEDIATE = 3, // 中级洞府
  ADVANCED = 4,    // 高级洞府
  SUPERIOR = 5,    // 上等洞府
  SUPREME = 6,     // 至尊洞府
}

// 建筑类型
export enum BuildingType {
  SPIRIT_FIELD = 'SPIRIT_FIELD',     // 灵田
  ALCHEMY_LAB = 'ALCHEMY_LAB',       // 炼丹房
  REFINING_ROOM = 'REFINING_ROOM',   // 炼器室
  MEDITATION_ROOM = 'MEDITATION_ROOM', // 修炼室
  STORAGE = 'STORAGE',               // 储物间
  SPIRIT_SPRING = 'SPIRIT_SPRING',   // 灵泉
  FORMATION = 'FORMATION',           // 阵法
}

// 建筑状态
export enum BuildingStatus {
  LOCKED = 'LOCKED',           // 未解锁
  AVAILABLE = 'AVAILABLE',     // 可建造
  BUILDING = 'BUILDING',       // 建造中
  ACTIVE = 'ACTIVE',           // 运行中
  UPGRADING = 'UPGRADING',     // 升级中
}

// 洞府信息
export type Cave = {
  playerId: number
  level: CaveLevel
  name: string
  spiritDensity: number  // 灵气浓度
  buildings: Building[]
  resources: CaveResources
  lastCollectAt: Date
  createdAt: Date
  updatedAt: Date
}

// 建筑信息
export type Building = {
  id: string
  type: BuildingType
  level: number
  status: BuildingStatus
  position: { x: number; y: number }
  
  // 建造/升级信息
  buildStartAt?: Date
  buildEndAt?: Date
  buildCost?: BuildingCost
  
  // 生产信息
  producing?: boolean
  productType?: string
  productQuantity?: number
  productEndAt?: Date
  
  // 建筑效果
  effects?: BuildingEffect[]
}

// 建筑消耗
export type BuildingCost = {
  spiritStones: number
  materials: Record<string, number>
  time: number  // 建造时间(分钟)
}

// 建筑效果
export type BuildingEffect = {
  type: 'CULTIVATION_SPEED' | 'PRODUCTION' | 'STORAGE' | 'DEFENSE'
  value: number
  description: string
}

// 洞府资源
export type CaveResources = {
  spiritualEnergy: number  // 灵气
  herbs: number            // 灵草
  ores: number             // 矿石
  pills: number            // 丹药
  artifacts: number        // 法宝
}

// 建筑配置
export type BuildingConfig = {
  type: BuildingType
  name: string
  description: string
  maxLevel: number
  unlockCaveLevel: CaveLevel
  baseCost: BuildingCost
  effects: BuildingEffect[]
}

// 升级结果
export type UpgradeResult = {
  success: boolean
  newLevel: number
  message: string
  cost?: BuildingCost
}

// 收集结果
export type CollectResult = {
  success: boolean
  resources: Partial<CaveResources>
  message: string
}

// 洞府统计
export type CaveStats = {
  totalBuildings: number
  activeBuildings: number
  productionRate: number
  defensePower: number
  storageCapacity: number
  dailyIncome: CaveResources
}