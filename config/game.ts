/**
 * 游戏配置
 */

import type { Rank, SectRank } from '@/types/enums'

// 游戏基础配置
export const GAME_CONFIG = {
  // 游戏名称
  name: '摸鱼修仙录',
  version: '1.0.0',
  
  // 游戏设置
  settings: {
    autoSave: true,
    autoSaveInterval: 60000, // 60秒自动保存一次
    maxPlayers: 10000,
    maintenanceMode: false,
  },
  
  // 时间设置
  time: {
    tickRate: 1000, // 游戏tick间隔(毫秒)
    dailyResetHour: 0, // 每日重置时间(小时)
    seasonDuration: 90, // 赛季持续天数
  },
}

// 境界配置
export const REALM_CONFIG = {
  names: {
    MORTAL: '凡人',
    QI_REFINING: '练气期',
    FOUNDATION: '筑基期',
    GOLDEN_CORE: '金丹期',
    NASCENT_SOUL: '元婴期',
    SPIRIT_SEVERING: '化神期',
    VOID_REFINING: '炼虚期',
    MAHAYANA: '大乘期',
    IMMORTAL: '仙人',
  } as Record<Rank, string>,
  
  // 境界经验需求
  expRequirements: {
    MORTAL: 0,
    QI_REFINING: 100,
    FOUNDATION: 500,
    GOLDEN_CORE: 2000,
    NASCENT_SOUL: 5000,
    SPIRIT_SEVERING: 10000,
    VOID_REFINING: 20000,
    MAHAYANA: 50000,
    IMMORTAL: 100000,
  } as Record<Rank, number>,
}

// 门派配置
export const SECT_CONFIG = {
  name: '仙欲宗',
  motto: '能坐着绝不站着，能躺着绝不坐着',
  
  ranks: {
    names: {
      OUTER: '外门弟子',
      INNER: '内门弟子',
      ELITE: '精英弟子',
      ELDER: '长老',
      MASTER: '掌门',
    } as Record<SectRank, string>,
    
    // 晋升所需贡献
    requirements: {
      OUTER: 0,
      INNER: 500,
      ELITE: 2000,
      ELDER: 5000,
      MASTER: 10000,
    } as Record<SectRank, number>,
  },
}

// 修炼配置
export const CULTIVATION_CONFIG = {
  // 基础修炼速度(每分钟获得的灵气)
  baseSpeed: 1,
  
  // 灵根品质加成
  spiritRootBonus: {
    HEAVEN: 3.0,   // 天灵根
    EARTH: 2.0,    // 地灵根
    HUMAN: 1.5,    // 人灵根
    WASTE: 1.0,    // 废灵根
  },
  
  // 突破成功率基础值
  breakthroughBaseChance: 0.5,
  
  // 心魔影响系数
  innerDemonPenalty: 0.001,
}

// 洞府配置
export const CAVE_CONFIG = {
  // 洞府等级名称
  levelNames: {
    1: '简陋洞府',
    2: '基础洞府',
    3: '中级洞府',
    4: '高级洞府',
    5: '上等洞府',
    6: '至尊洞府',
  },
  
  // 基础容量
  baseCapacity: 1000,
  
  // 每级增加的容量
  capacityPerLevel: 500,
  
  // 建筑数量限制
  maxBuildings: 20,
}

// 背包配置
export const INVENTORY_CONFIG = {
  // 默认背包容量
  defaultCapacity: 100,
  
  // 最大堆叠数量
  maxStackSize: 999,
  
  // 出售价格折扣
  sellPriceMultiplier: 0.5,
}

// 任务配置
export const TASK_CONFIG = {
  // 每日任务数量
  dailyTaskLimit: 10,
  
  // 任务难度奖励倍数
  difficultyMultipliers: {
    EASY: 1.0,
    MEDIUM: 2.0,
    HARD: 3.5,
    EXTREME: 5.0,
  },
  
  // 任务类型
  types: ['LINK', 'GAME', 'BATTLE'] as const,
}

// 渡劫配置
export const TRIBULATION_CONFIG = {
  // 渡劫波数配置
  waves: {
    MORTAL: 3,
    QI_REFINING: 3,
    FOUNDATION: 6,
    GOLDEN_CORE: 9,
    NASCENT_SOUL: 9,
    SPIRIT_SEVERING: 9,
    VOID_REFINING: 9,
    MAHAYANA: 9,
    IMMORTAL: 9,
  } as Record<Rank, number>,
  
  // 最低灵气要求(百分比)
  minQiPercentage: 0.8,
  
  // 成功基础概率
  baseSuccessRate: 0.7,
}

// 排行榜配置
export const LEADERBOARD_CONFIG = {
  // 每页显示数量
  pageSize: 20,
  
  // 赛季时长(天)
  seasonDuration: 90,
  
  // 奖励发放延迟(小时)
  rewardDelay: 24,
  
  // 排行榜类型
  categories: [
    'REALM',
    'POWER',
    'WEALTH',
    'CONTRIBUTION',
    'CAVE',
    'CULTIVATION',
  ] as const,
}

// 经济配置
export const ECONOMY_CONFIG = {
  // 初始灵石
  startingSpiritStones: 100,
  
  // 初始贡献
  startingContribution: 0,
  
  // 每日补贴(按门派等级)
  dailyAllowance: {
    OUTER: 10,
    INNER: 30,
    ELITE: 60,
    ELDER: 100,
    MASTER: 200,
  } as Record<SectRank, number>,
}

// 导出所有配置
export const CONFIG = {
  game: GAME_CONFIG,
  realm: REALM_CONFIG,
  sect: SECT_CONFIG,
  cultivation: CULTIVATION_CONFIG,
  cave: CAVE_CONFIG,
  inventory: INVENTORY_CONFIG,
  task: TASK_CONFIG,
  tribulation: TRIBULATION_CONFIG,
  leaderboard: LEADERBOARD_CONFIG,
  economy: ECONOMY_CONFIG,
}

export default CONFIG