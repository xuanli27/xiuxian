import type { SectRank } from '@prisma/client'
import type { SectPosition } from './types'

/**
 * 门派系统工具函数
 */

/**
 * 门派等级名称映射
 */
export const SECT_RANK_NAMES: Record<SectRank, string> = {
  OUTER: '外门弟子',
  INNER: '内门弟子',
  ELITE: '精英弟子',
  ELDER: '长老',
  MASTER: '掌门',
}

/**
 * 门派等级颜色
 */
export const SECT_RANK_COLORS: Record<SectRank, string> = {
  OUTER: '#9E9E9E',     // 灰色
  INNER: '#4CAF50',     // 绿色
  ELITE: '#2196F3',     // 蓝色
  ELDER: '#9C27B0',     // 紫色
  MASTER: '#FF9800',    // 橙色
}

/**
 * 获取下一个门派等级
 */
export function getNextSectRank(currentRank: SectRank): SectRank | null {
  const ranks: SectRank[] = ['OUTER', 'INNER', 'ELITE', 'ELDER', 'MASTER']
  const currentIndex = ranks.indexOf(currentRank)
  
  if (currentIndex === -1 || currentIndex >= ranks.length - 1) {
    return null
  }
  
  return ranks[currentIndex + 1]
}

/**
 * 计算晋升所需贡献
 */
export function getPromotionRequirement(currentRank: SectRank): number {
  const requirements: Record<SectRank, number> = {
    OUTER: 0,
    INNER: 500,
    ELITE: 2000,
    ELDER: 5000,
    MASTER: 10000,
  }
  
  const nextRank = getNextSectRank(currentRank)
  if (!nextRank) return Infinity
  
  return requirements[nextRank]
}

/**
 * 计算门派等级差距
 */
export function getSectRankDifference(rank1: SectRank, rank2: SectRank): number {
  const levels: Record<SectRank, number> = {
    OUTER: 0,
    INNER: 1,
    ELITE: 2,
    ELDER: 3,
    MASTER: 4,
  }
  
  return levels[rank1] - levels[rank2]
}

/**
 * 计算每日灵石补贴
 */
export function calculateDailyAllowance(sectRank: SectRank): number {
  const allowances: Record<SectRank, number> = {
    OUTER: 10,
    INNER: 30,
    ELITE: 60,
    ELDER: 100,
    MASTER: 200,
  }
  
  return allowances[sectRank]
}

/**
 * 计算捐献获得的贡献值
 */
export function calculateContributionFromDonation(
  amount: number,
  resourceType: 'SPIRIT_STONES' | 'MATERIALS' | 'PILLS'
): number {
  const rates: Record<string, number> = {
    SPIRIT_STONES: 1,    // 1灵石 = 1贡献
    MATERIALS: 2,        // 1材料 = 2贡献
    PILLS: 5,            // 1丹药 = 5贡献
  }
  
  return Math.floor(amount * rates[resourceType])
}

/**
 * 格式化贡献值
 */
export function formatContribution(contribution: number): string {
  if (contribution >= 10000) {
    return `${(contribution / 10000).toFixed(1)}万`
  } else if (contribution >= 1000) {
    return `${(contribution / 1000).toFixed(1)}千`
  }
  return contribution.toString()
}

/**
 * 检查是否有权限
 */
export function hasPermission(
  playerRank: SectRank,
  requiredRank: SectRank
): boolean {
  const levels: Record<SectRank, number> = {
    OUTER: 0,
    INNER: 1,
    ELITE: 2,
    ELDER: 3,
    MASTER: 4,
  }
  
  return levels[playerRank] >= levels[requiredRank]
}

/**
 * 获取门派特权描述
 */
export function getSectBenefits(sectRank: SectRank): string[] {
  const benefits: Record<SectRank, string[]> = {
    OUTER: [
      '基础修炼功法',
      '接取普通任务',
      '使用公共设施',
    ],
    INNER: [
      '中级修炼功法',
      '每日30灵石补贴',
      '接取中级任务',
      '使用内门藏书阁',
    ],
    ELITE: [
      '高级修炼功法',
      '每日60灵石补贴',
      '接取高级任务',
      '专属修炼室',
      '购买稀有物品',
    ],
    ELDER: [
      '顶级修炼功法',
      '每日100灵石补贴',
      '接取任何任务',
      '长老殿权限',
      '指导弟子',
      '参与宗门决策',
    ],
    MASTER: [
      '无上修炼功法',
      '每日200灵石补贴',
      '所有任务奖励翻倍',
      '掌门专属特权',
      '管理宗门',
      '所有权限',
    ],
  }
  
  return benefits[sectRank]
}

/**
 * 计算任务贡献奖励
 */
export function calculateMissionContribution(
  difficulty: 'EASY' | 'MEDIUM' | 'HARD' | 'EXTREME'
): number {
  const baseRewards: Record<string, number> = {
    EASY: 10,
    MEDIUM: 30,
    HARD: 80,
    EXTREME: 200,
  }
  
  return baseRewards[difficulty]
}

/**
 * 生成门派任务ID
 */
export function generateMissionId(): string {
  return `mission_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

/**
 * 获取门派排名徽章
 */
export function getRankBadge(rank: number): string {
  if (rank === 1) return '🥇'
  if (rank === 2) return '🥈'
  if (rank === 3) return '🥉'
  if (rank <= 10) return '🏆'
  if (rank <= 50) return '⭐'
  return ''
}