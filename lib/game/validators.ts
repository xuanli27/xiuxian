/**
 * 游戏业务验证逻辑
 */

import { GAME_CONSTANTS } from './constants'

/**
 * 验证是否可以升级境界
 */
export function canLevelUp(currentExp: number, requiredExp: number): boolean {
  return currentExp >= requiredExp
}

/**
 * 验证是否可以接取任务
 */
export function canAcceptTask(
  playerLevel: number,
  taskLevel: number,
  currentTaskCount: number,
  maxTasks: number = 10
): boolean {
  if (currentTaskCount >= maxTasks) return false
  if (playerLevel < taskLevel) return false
  return true
}

/**
 * 验证任务是否可以完成
 */
export function canCompleteTask(
  taskStatus: string,
  taskRequirements: Record<string, number>,
  playerProgress: Record<string, number>
): boolean {
  if (taskStatus === 'COMPLETED') return false
  
  // 验证所有要求是否满足
  for (const [key, value] of Object.entries(taskRequirements)) {
    if (!playerProgress[key] || playerProgress[key] < value) {
      return false
    }
  }
  
  return true
}

/**
 * 验证是否有足够货币
 */
export function hasEnoughCurrency(
  playerCurrency: number,
  requiredCurrency: number
): boolean {
  return playerCurrency >= requiredCurrency
}

/**
 * 验证境界名称是否有效
 */
export function isValidRealm(realm: string): boolean {
  return GAME_CONSTANTS.REALMS.some(r => r.id === realm)
}

/**
 * 验证灵根类型是否有效
 */
export function isValidSpiritRoot(spiritRoot: string): boolean {
  return GAME_CONSTANTS.SPIRIT_ROOTS.some(sr => sr.id === spiritRoot)
}

/**
 * 验证玩家名称
 */
export function isValidPlayerName(name: string): boolean {
  if (name.length < 2 || name.length > 20) return false
  // 只允许中文、英文、数字
  return /^[\u4e00-\u9fa5a-zA-Z0-9]+$/.test(name)
}