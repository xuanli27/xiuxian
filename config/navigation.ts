/**
 * 导航配置
 */

export type NavItem = {
  title: string
  href: string
  icon?: string
  description?: string
  disabled?: boolean
  external?: boolean
  badge?: string
}

// 主导航
export const MAIN_NAV: NavItem[] = [
  {
    title: '首页',
    href: '/',
    icon: '🏠',
  },
  {
    title: '仪表盘',
    href: '/dashboard',
    icon: '📊',
    description: '查看修炼进度和境界',
  },
  {
    title: '任务大厅',
    href: '/tasks',
    icon: '📝',
    description: '接取和完成任务',
  },
  {
    title: '修炼场',
    href: '/cultivation',
    icon: '🧘',
    description: '修炼和突破境界',
  },
  {
    title: '洞府',
    href: '/cave',
    icon: '🏠',
    description: '管理洞府和建筑',
  },
  {
    title: '背包',
    href: '/inventory',
    icon: '🎒',
    description: '管理物品和装备',
  },
  {
    title: '门派',
    href: '/sect',
    icon: '🏛️',
    description: '门派事务和贡献',
  },
  {
    title: '渡劫',
    href: '/tribulation',
    icon: '⚡',
    description: '挑战天劫突破',
  },
  {
    title: '排行榜',
    href: '/leaderboard',
    icon: '🏆',
    description: '查看各类排行榜',
  },
]

// 游戏内主导航 - 精简为4个核心功能
export const GAME_NAV: NavItem[] = [
  {
    title: '紫府',
    href: '/dashboard',
    icon: '🏔️',
    description: '你的修仙世界中心',
  },
  {
    title: '修炼',
    href: '/cultivation',
    icon: '🧘',
    description: '闭关修炼，提升境界',
  },
  {
    title: '任务',
    href: '/tasks',
    icon: '📜',
    description: '历练任务，获取资源',
  },
  {
    title: '洞府',
    href: '/cave',
    icon: '🏡',
    description: '经营洞府，炼制丹药',
  },
]

// 次级功能 - 通过仪表盘入口访问
export const SECONDARY_NAV: NavItem[] = [
  {
    title: '百宝囊',
    href: '/inventory',
    icon: '🎒',
    description: '查看物品和装备',
  },
  {
    title: '仙欲宗',
    href: '/sect',
    icon: '⛩️',
    description: '宗门事务与贡献',
  },
  {
    title: '天机阁',
    href: '/leaderboard',
    icon: '📊',
    description: '修士排行榜',
  },
  {
    title: '天劫',
    href: '/tribulation',
    icon: '⚡',
    description: '渡劫突破境界',
    badge: '危险',
  },
  {
    title: '奇遇',
    href: '/events',
    icon: '✨',
    description: '随机事件与机缘',
  },
]

// 用户菜单
export const USER_NAV: NavItem[] = [
  {
    title: '个人资料',
    href: '/profile',
    icon: '👤',
  },
  {
    title: '设置',
    href: '/settings',
    icon: '⚙️',
  },
  {
    title: '帮助',
    href: '/help',
    icon: '❓',
  },
]

// 快速操作
export const QUICK_ACTIONS: NavItem[] = [
  {
    title: '开始修炼',
    href: '/cultivation',
    icon: '🧘',
  },
  {
    title: '接取任务',
    href: '/tasks',
    icon: '📝',
  },
  {
    title: '查看排名',
    href: '/leaderboard',
    icon: '🏆',
  },
  {
    title: '尝试渡劫',
    href: '/tribulation',
    icon: '⚡',
    badge: '危险',
  },
]

// 导出所有导航配置
export const NAVIGATION = {
  main: MAIN_NAV,
  game: GAME_NAV,
  secondary: SECONDARY_NAV,
  user: USER_NAV,
  quickActions: QUICK_ACTIONS,
}

export default NAVIGATION