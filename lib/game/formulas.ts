import { GAME_CONSTANTS } from './constants'

/**
 * 游戏公式计算库
 */

/**
 * 计算升级所需经验值
 */
export function calculateExpForLevel(level: number): number {
  return Math.floor(GAME_CONSTANTS.BALANCE.EXP_PER_LEVEL * Math.pow(1.5, level - 1))
}

/**
 * 计算玩家总属性
 */
export function calculateTotalStats(baseStats: {
  health: number
  mana: number
  attack: number
  defense: number
}, realmLevel: number, spiritRootBonus: number = 0) {
  const multiplier = 1 + (realmLevel - 1) * 0.2
  return {
    health: Math.floor((baseStats.health + spiritRootBonus) * multiplier),
    mana: Math.floor((baseStats.mana + spiritRootBonus) * multiplier),
    attack: Math.floor((baseStats.attack + spiritRootBonus) * multiplier),
    defense: Math.floor((baseStats.defense + spiritRootBonus) * multiplier)
  }
}

/**
 * 计算任务奖励
 */
export function calculateTaskRewards(
  difficulty: 'EASY' | 'MEDIUM' | 'HARD',
  taskType: 'DAILY' | 'WEEKLY' | 'ACHIEVEMENT'
) {
  const difficultyMultiplier = GAME_CONSTANTS.DIFFICULTIES[difficulty].multiplier
  const baseReward = GAME_CONSTANTS.BALANCE.CURRENCY_PER_TASK
  
  const typeMultiplier = taskType === 'DAILY' ? 1 : taskType === 'WEEKLY' ? 3 : 5
  
  return {
    experience: Math.floor(baseReward * difficultyMultiplier * typeMultiplier),
    currency: Math.floor(baseReward * difficultyMultiplier * typeMultiplier * 0.5)
  }
}

/**
 * 计算境界突破成功率
 */
export function calculateBreakthroughChance(
  currentExp: number,
  requiredExp: number,
  attempts: number = 0
): number {
  const baseChance = Math.min((currentExp / requiredExp) * 0.5, 0.5)
  const attemptBonus = Math.min(attempts * 0.05, 0.3)
  return Math.min(baseChance + attemptBonus, 0.9)
}

/**
 * 计算战斗伤害
 */
export function calculateDamage(
  attackerAttack: number,
  defenderDefense: number,
  critical: boolean = false
): number {
  const baseDamage = Math.max(attackerAttack - defenderDefense * 0.5, 1)
  return Math.floor(baseDamage * (critical ? 2 : 1))
}