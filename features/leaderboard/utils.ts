import type { LeaderboardCategory } from './types'

/**
 * 排行榜系统工具函数
 */

/**
 * 排行榜类型名称映射
 */
export const LEADERBOARD_CATEGORY_NAMES: Record<LeaderboardCategory, string> = {
  REALM: '境界榜',
  POWER: '战力榜',
  WEALTH: '财富榜',
  CONTRIBUTION: '贡献榜',
  CAVE: '洞府榜',
  CULTIVATION: '修炼速度榜',
}

/**
 * 排行榜类型描述
 */
export const LEADERBOARD_CATEGORY_DESCRIPTIONS: Record<LeaderboardCategory, string> = {
  REALM: '按境界和等级排名',
  POWER: '按综合战力排名',
  WEALTH: '按灵石财富排名',
  CONTRIBUTION: '按门派贡献排名',
  CAVE: '按洞府等级排名',
  CULTIVATION: '按修炼速度排名',
}

/**
 * 获取排名徽章
 */
export function getRankBadge(rank: number): string {
  if (rank === 1) return '🥇'
  if (rank === 2) return '🥈'
  if (rank === 3) return '🥉'
  if (rank <= 10) return '🏆'
  if (rank <= 50) return '⭐'
  if (rank <= 100) return '💫'
  return ''
}

/**
 * 获取排名颜色
 */
export function getRankColor(rank: number): string {
  if (rank === 1) return '#FFD700'      // 金色
  if (rank === 2) return '#C0C0C0'      // 银色
  if (rank === 3) return '#CD7F32'      // 铜色
  if (rank <= 10) return '#9C27B0'      // 紫色
  if (rank <= 50) return '#2196F3'      // 蓝色
  if (rank <= 100) return '#4CAF50'     // 绿色
  return '#757575'                       // 灰色
}

/**
 * 格式化排名变化
 */
export function formatRankChange(change: number): string {
  if (change > 0) return `↑${change}`
  if (change < 0) return `↓${Math.abs(change)}`
  return '—'
}

/**
 * 计算排名变化颜色
 */
export function getRankChangeColor(change: number): string {
  if (change > 0) return '#4CAF50'  // 绿色(上升)
  if (change < 0) return '#F44336'  // 红色(下降)
  return '#9E9E9E'                   // 灰色(持平)
}

/**
 * 格式化排名显示
 */
export function formatRankDisplay(rank: number): string {
  if (rank <= 3) {
    return `${getRankBadge(rank)}`
  }
  return `#${rank}`
}

/**
 * 计算赛季ID
 */
export function calculateSeasonId(date: Date = new Date()): string {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const quarter = Math.ceil(month / 3)
  return `${year}-Q${quarter}`
}

/**
 * 获取赛季名称
 */
export function getSeasonName(seasonId: string): string {
  const [year, quarter] = seasonId.split('-')
  const quarterNum = quarter.replace('Q', '')
  return `${year}年第${quarterNum}季度`
}

/**
 * 检查赛季是否有效
 */
export function isSeasonActive(seasonId: string): boolean {
  return seasonId === calculateSeasonId()
}

/**
 * 获取排行榜图标
 */
export function getLeaderboardIcon(category: LeaderboardCategory): string {
  const icons: Record<LeaderboardCategory, string> = {
    REALM: '🌟',
    POWER: '⚔️',
    WEALTH: '💰',
    CONTRIBUTION: '🏛️',
    CAVE: '🏠',
    CULTIVATION: '🧘',
  }
  return icons[category]
}

/**
 * 计算奖励等级
 */
export function getRewardTier(rank: number): 'LEGENDARY' | 'EPIC' | 'RARE' | 'UNCOMMON' | 'COMMON' {
  if (rank === 1) return 'LEGENDARY'
  if (rank <= 3) return 'EPIC'
  if (rank <= 10) return 'RARE'
  if (rank <= 50) return 'UNCOMMON'
  return 'COMMON'
}

/**
 * 格式化数值显示
 */
export function formatLeaderboardValue(
  category: LeaderboardCategory,
  value: number
): string {
  switch (category) {
    case 'WEALTH':
      if (value >= 10000) {
        return `${(value / 10000).toFixed(1)}万`
      }
      return value.toString()
    case 'POWER':
      return value.toLocaleString()
    case 'CONTRIBUTION':
      return value.toLocaleString()
    default:
      return value.toString()
  }
}

/**
 * 获取排名范围标签
 */
export function getRankRangeLabel(rank: number): string {
  if (rank === 1) return '榜首'
  if (rank <= 3) return '前三甲'
  if (rank <= 10) return '前十强'
  if (rank <= 50) return '前五十'
  if (rank <= 100) return '前百名'
  return '榜上有名'
}