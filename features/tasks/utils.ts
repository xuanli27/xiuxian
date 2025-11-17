import { GAME_CONSTANTS } from '@/lib/game/constants'

/**
 * Task工具函数
 */

/**
 * 获取任务类型名称
 */
export function getTaskTypeName(type: string): string {
  const types = {
    DAILY: '每日任务',
    WEEKLY: '每周任务',
    ACHIEVEMENT: '成就任务'
  }
  return types[type as keyof typeof types] || '未知类型'
}

/**
 * 获取任务难度名称
 */
export function getTaskDifficultyName(difficulty: string): string {
  const difficulties = {
    EASY: '简单',
    MEDIUM: '中等',
    HARD: '困难'
  }
  return difficulties[difficulty as keyof typeof difficulties] || '未知难度'
}

/**
 * 获取任务状态名称
 */
export function getTaskStatusName(status: string): string {
  const statuses = {
    PENDING: '待接取',
    IN_PROGRESS: '进行中',
    COMPLETED: '已完成',
    FAILED: '已失败'
  }
  return statuses[status as keyof typeof statuses] || '未知状态'
}

/**
 * 获取任务状态颜色
 */
export function getTaskStatusColor(status: string): string {
  const colors = {
    PENDING: 'text-gray-500',
    IN_PROGRESS: 'text-blue-500',
    COMPLETED: 'text-green-500',
    FAILED: 'text-red-500'
  }
  return colors[status as keyof typeof colors] || 'text-gray-500'
}

/**
 * 获取任务难度颜色
 */
export function getTaskDifficultyColor(difficulty: string): string {
  const colors = {
    EASY: 'text-green-500',
    MEDIUM: 'text-yellow-500',
    HARD: 'text-red-500'
  }
  return colors[difficulty as keyof typeof colors] || 'text-gray-500'
}

/**
 * 计算任务进度百分比
 */
export function calculateTaskProgress(current: number, target: number): number {
  return Math.min((current / target) * 100, 100)
}

/**
 * 检查任务是否可以完成
 */
export function canCompleteTask(status: string, progress: number = 100): boolean {
  return status === 'IN_PROGRESS' && progress >= 100
}

/**
 * 格式化任务奖励
 */
export function formatTaskRewards(rewards: {
  experience: number
  currency: number
  items?: string[]
}): string {
  const parts: string[] = []
  
  if (rewards.experience > 0) {
    parts.push(`${rewards.experience} 经验`)
  }
  
  if (rewards.currency > 0) {
    parts.push(`${rewards.currency} 灵石`)
  }
  
  if (rewards.items && rewards.items.length > 0) {
    parts.push(`${rewards.items.length} 个物品`)
  }
  
  return parts.join(', ')
}

/**
 * 判断任务是否过期
 */
export function isTaskExpired(task: {
  type: string
  acceptedAt: Date | null
  completedAt: Date | null
}): boolean {
  if (!task.acceptedAt || task.completedAt) return false
  
  const now = new Date()
  const acceptedTime = new Date(task.acceptedAt).getTime()
  const elapsed = now.getTime() - acceptedTime
  
  // 每日任务24小时过期,每周任务7天过期
  const expireTime = task.type === 'DAILY' ? 86400000 : 604800000
  
  return elapsed > expireTime
}