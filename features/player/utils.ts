import { GAME_CONSTANTS } from '@/lib/game/constants'

/**
 * Player工具函数
 */

/**
 * 获取境界名称
 */
export function getRealmName(realmId: string): string {
  const realm = GAME_CONSTANTS.REALMS.find(r => r.id === realmId)
  return realm?.name || '未知境界'
}

/**
 * 获取灵根名称
 */
export function getSpiritRootName(spiritRootId: string): string {
  const root = GAME_CONSTANTS.SPIRIT_ROOTS.find(r => r.id === spiritRootId)
  return root?.name || '未知灵根'
}

/**
 * 计算境界进度百分比
 */
export function calculateRealmProgress(currentExp: number, requiredExp: number): number {
  return Math.min((currentExp / requiredExp) * 100, 100)
}

/**
 * 获取下一境界信息
 */
export function getNextRealm(currentRealmId: string) {
  const currentIndex = GAME_CONSTANTS.REALMS.findIndex(r => r.id === currentRealmId)
  if (currentIndex === -1 || currentIndex >= GAME_CONSTANTS.REALMS.length - 1) {
    return null
  }
  return GAME_CONSTANTS.REALMS[currentIndex + 1]
}

/**
 * 判断是否可以突破境界
 */
export function canBreakthrough(currentExp: number, requiredExp: number): boolean {
  return currentExp >= requiredExp
}

/**
 * 格式化玩家统计数据
 */
export function formatPlayerStats(player: {
  health: number
  mana: number
  attack: number
  defense: number
}) {
  return {
    生命值: player.health,
    法力值: player.mana,
    攻击力: player.attack,
    防御力: player.defense,
  }
}