import type { Rank } from '@prisma/client'

/**
 * 修炼系统工具函数
 */

/**
 * 境界等级映射
 */
const RANK_LEVELS: Record<Rank, number> = {
  MORTAL: 0,
  QI_REFINING: 1,
  FOUNDATION: 2,
  GOLDEN_CORE: 3,
  NASCENT_SOUL: 4,
  SPIRIT_SEVERING: 5,
  VOID_REFINING: 6,
  MAHAYANA: 7,
  IMMORTAL: 8,
}

/**
 * 获取下一个境界
 */
export function getNextRank(currentRank: Rank): Rank | null {
  const ranks: Rank[] = [
    'MORTAL',
    'QI_REFINING',
    'FOUNDATION',
    'GOLDEN_CORE',
    'NASCENT_SOUL',
    'SPIRIT_SEVERING',
    'VOID_REFINING',
    'MAHAYANA',
    'IMMORTAL',
  ]

  const currentIndex = ranks.indexOf(currentRank)
  if (currentIndex === -1 || currentIndex >= ranks.length - 1) {
    return null // 已经是最高境界
  }

  return ranks[currentIndex + 1]
}

/**
 * 计算突破成功率
 * @param expProgress 经验进度 (0-1)
 * @param luck 幸运值 (0-100)
 * @param useItems 是否使用突破道具
 * @returns 成功率 (0-1)
 */
export function calculateBreakthroughChance(
  expProgress: number,
  luck: number = 50,
  useItems: boolean = false
): number {
  // 基础成功率: 经验进度的70%
  let baseChance = expProgress * 0.7

  // 幸运值加成: ±10%
  const luckBonus = (luck - 50) / 500
  baseChance += luckBonus

  // 使用突破丹增加20%成功率
  if (useItems) {
    baseChance += 0.2
  }

  // 限制在5%-95%之间
  return Math.max(0.05, Math.min(0.95, baseChance))
}

/**
 * 计算修炼经验收益
 * @param duration 修炼时长(分钟)
 * @param spiritRoot 灵根品质(影响效率)
 * @param boost 加速倍数
 * @returns 获得的经验值
 */
export function calculateCultivationExp(
  duration: number,
  spiritRootQuality: number = 1,
  boost: number = 1
): number {
  // 基础经验: 每分钟1点
  const baseExp = duration * 1

  // 灵根加成: 1-3倍
  const rootMultiplier = 1 + (spiritRootQuality - 1) * 0.5

  // 加速道具倍数
  const totalExp = baseExp * rootMultiplier * boost

  return Math.floor(totalExp)
}

/**
 * 计算境界等级差距
 */
export function getRankLevelDifference(rank1: Rank, rank2: Rank): number {
  return RANK_LEVELS[rank1] - RANK_LEVELS[rank2]
}

/**
 * 判断是否可以挑战该境界的敌人
 */
export function canChallengeRank(playerRank: Rank, enemyRank: Rank): boolean {
  const diff = getRankLevelDifference(playerRank, enemyRank)
  // 只能挑战比自己低2个境界到高1个境界的敌人
  return diff >= -1 && diff <= 2
}

/**
 * 格式化修炼时长
 */
export function formatCultivationDuration(minutes: number): string {
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
 * 获取境界颜色(用于UI显示)
 */
export function getRealmColor(rank: Rank): string {
  const colors: Record<Rank, string> = {
    MORTAL: '#8B8B8B',
    QI_REFINING: '#4A90E2',
    FOUNDATION: '#50C878',
    GOLDEN_CORE: '#FFD700',
    NASCENT_SOUL: '#FF6B6B',
    SPIRIT_SEVERING: '#9B59B6',
    VOID_REFINING: '#E74C3C',
    MAHAYANA: '#F39C12',
    IMMORTAL: '#1ABC9C',
  }
  return colors[rank]
}

/**
 * 计算突破消耗的资源
 */
export function calculateBreakthroughCost(currentRank: Rank): {
  qi: number
  spiritStones: number
} {
  const level = RANK_LEVELS[currentRank]
  return {
    qi: Math.floor(100 * Math.pow(2, level)),
    spiritStones: Math.floor(50 * Math.pow(1.5, level)),
  }
}