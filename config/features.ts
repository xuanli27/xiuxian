/**
 * 功能开关配置
 */

export type FeatureFlag = {
  enabled: boolean
  description: string
  releaseDate?: string
  beta?: boolean
}

// 功能开关
export const FEATURES: Record<string, FeatureFlag> = {
  // 核心功能
  cultivation: {
    enabled: true,
    description: '修炼系统 - 打坐、突破、闭关',
  },
  
  tasks: {
    enabled: true,
    description: '任务系统 - 每日任务、门派任务',
  },
  
  inventory: {
    enabled: true,
    description: '背包系统 - 物品管理、装备系统',
  },
  
  cave: {
    enabled: true,
    description: '洞府系统 - 建筑、生产',
  },
  
  sect: {
    enabled: true,
    description: '门派系统 - 贡献、晋升',
  },
  
  tribulation: {
    enabled: true,
    description: '渡劫系统 - 天劫挑战',
  },
  
  leaderboard: {
    enabled: true,
    description: '排行榜系统 - 各类排名',
  },
  
  // AI功能
  aiTaskGeneration: {
    enabled: true,
    description: 'AI任务生成 - 使用Gemini生成动态任务',
    beta: true,
  },
  
  aiStoryGeneration: {
    enabled: true,
    description: 'AI剧情生成 - 动态生成修仙故事',
    beta: true,
  },
  
  aiNameGeneration: {
    enabled: true,
    description: 'AI名称生成 - 生成修仙风格名称',
    beta: true,
  },
  
  // 社交功能
  chat: {
    enabled: false,
    description: '聊天系统 - 玩家之间交流',
    releaseDate: '2025-12-01',
  },
  
  guild: {
    enabled: false,
    description: '公会系统 - 玩家组建公会',
    releaseDate: '2025-12-15',
  },
  
  pvp: {
    enabled: false,
    description: 'PVP系统 - 玩家对战',
    releaseDate: '2026-01-01',
  },
  
  // 交易功能
  marketplace: {
    enabled: false,
    description: '交易市场 - 玩家之间交易物品',
    releaseDate: '2025-12-01',
  },
  
  auction: {
    enabled: false,
    description: '拍卖行 - 物品拍卖',
    releaseDate: '2026-01-15',
  },
  
  // 高级功能
  pets: {
    enabled: false,
    description: '灵宠系统 - 捕获和培养灵兽',
    releaseDate: '2026-02-01',
  },
  
  mounts: {
    enabled: false,
    description: '坐骑系统 - 飞行和移动加速',
    releaseDate: '2026-02-15',
  },
  
  formations: {
    enabled: false,
    description: '阵法系统 - 布置和使用阵法',
    releaseDate: '2026-03-01',
  },
  
  // 付费功能
  vip: {
    enabled: false,
    description: 'VIP系统 - 会员特权',
    releaseDate: '2026-01-01',
  },
  
  shop: {
    enabled: false,
    description: '商城系统 - 购买道具和特权',
    releaseDate: '2026-01-01',
  },
}

// 检查功能是否启用
export function isFeatureEnabled(feature: string): boolean {
  return FEATURES[feature]?.enabled ?? false
}

// 获取所有启用的功能
export function getEnabledFeatures(): string[] {
  return Object.keys(FEATURES).filter(key => FEATURES[key].enabled)
}

// 获取所有Beta功能
export function getBetaFeatures(): string[] {
  return Object.keys(FEATURES).filter(key => FEATURES[key].beta)
}

// 获取即将发布的功能
export function getUpcomingFeatures(): Array<{ name: string; releaseDate: string }> {
  return Object.entries(FEATURES)
    .filter(([_, config]) => config.releaseDate && !config.enabled)
    .map(([name, config]) => ({
      name,
      releaseDate: config.releaseDate!,
    }))
    .sort((a, b) => a.releaseDate.localeCompare(b.releaseDate))
}

export default FEATURES