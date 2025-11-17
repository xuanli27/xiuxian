import type { Rank } from '@prisma/client'
import type { TribulationType, TribulationDifficulty, TribulationWave } from './types'

/**
 * 渡劫系统工具函数
 */

/**
 * 渡劫类型名称映射
 */
export const TRIBULATION_TYPE_NAMES: Record<TribulationType, string> = {
  THUNDER: '雷劫',
  FIRE: '火劫',
  WIND: '风劫',
  HEART_DEMON: '心魔劫',
  HEAVENLY: '天道劫',
}

/**
 * 渡劫难度名称映射
 */
export const TRIBULATION_DIFFICULTY_NAMES: Record<TribulationDifficulty, string> = {
  MINOR: '小劫',
  MAJOR: '大劫',
  CATASTROPHIC: '大天劫',
}

/**
 * 计算渡劫波数
 */
export function calculateTribulationWaves(rank: Rank): number {
  const waves: Record<Rank, number> = {
    MORTAL: 3,
    QI_REFINING: 3,
    FOUNDATION: 6,
    GOLDEN_CORE: 9,
    NASCENT_SOUL: 9,
    SPIRIT_SEVERING: 9,
    VOID_REFINING: 9,
    MAHAYANA: 9,
    IMMORTAL: 9,
  }
  return waves[rank]
}

/**
 * 计算渡劫威力
 */
export function calculateTribulationPower(rank: Rank, wave: number): number {
  const rankLevels: Record<Rank, number> = {
    MORTAL: 1,
    QI_REFINING: 2,
    FOUNDATION: 3,
    GOLDEN_CORE: 4,
    NASCENT_SOUL: 5,
    SPIRIT_SEVERING: 6,
    VOID_REFINING: 7,
    MAHAYANA: 8,
    IMMORTAL: 9,
  }

  const basepower = rankLevels[rank] * 100
  const waveMultiplier = 1 + (wave - 1) * 0.2
  return Math.floor(basepower * waveMultiplier)
}

/**
 * 生成渡劫波次
 */
export function generateTribulationWaves(rank: Rank): TribulationWave[] {
  const totalWaves = calculateTribulationWaves(rank)
  const waves: TribulationWave[] = []

  const types: TribulationType[] = ['THUNDER', 'FIRE', 'WIND', 'HEART_DEMON', 'HEAVENLY']

  for (let i = 1; i <= totalWaves; i++) {
    const typeIndex = Math.floor((i - 1) / 2) % types.length
    const type = types[typeIndex]
    const power = calculateTribulationPower(rank, i)
    const damage = Math.floor(power * 1.5)

    waves.push({
      wave: i,
      type,
      power,
      damage,
      description: `第${i}波${TRIBULATION_TYPE_NAMES[type]}`,
    })
  }

  return waves
}

/**
 * 计算行动成功率
 */
export function calculateActionSuccessRate(
  action: 'DEFEND' | 'ATTACK' | 'DODGE' | 'HEAL' | 'USE_ITEM',
  playerPower: number,
  tribulationPower: number
): number {
  const powerRatio = playerPower / tribulationPower

  const baseRates: Record<string, number> = {
    DEFEND: 0.7,
    ATTACK: 0.5,
    DODGE: 0.6,
    HEAL: 0.9,
    USE_ITEM: 0.95,
  }

  const baseRate = baseRates[action]
  const adjustedRate = baseRate * (0.5 + powerRatio * 0.5)

  return Math.max(0.1, Math.min(0.95, adjustedRate))
}

/**
 * 计算渡劫伤害
 */
export function calculateTribulationDamage(
  tribulationPower: number,
  defense: number
): number {
  const baseDamage = tribulationPower * 1.5
  const reducedDamage = baseDamage * (1 - defense / (defense + 100))
  return Math.floor(Math.max(1, reducedDamage))
}

/**
 * 计算渡劫奖励
 */
export function calculateTribulationRewards(rank: Rank, wavesCompleted: number) {
  const rankLevels: Record<Rank, number> = {
    MORTAL: 1,
    QI_REFINING: 2,
    FOUNDATION: 3,
    GOLDEN_CORE: 4,
    NASCENT_SOUL: 5,
    SPIRIT_SEVERING: 6,
    VOID_REFINING: 7,
    MAHAYANA: 8,
    IMMORTAL: 9,
  }

  const level = rankLevels[rank]
  const baseExp = level * 100
  const baseStones = level * 50

  return {
    experience: Math.floor(baseExp * wavesCompleted * 0.5),
    spiritStones: Math.floor(baseStones * wavesCompleted * 0.5),
  }
}

/**
 * 格式化渡劫进度
 */
export function formatTribulationProgress(current: number, total: number): string {
  return `${current}/${total}波`
}

/**
 * 获取渡劫类型颜色
 */
export function getTribulationTypeColor(type: TribulationType): string {
  const colors: Record<TribulationType, string> = {
    THUNDER: '#9C27B0',  // 紫色
    FIRE: '#F44336',     // 红色
    WIND: '#4CAF50',     // 绿色
    HEART_DEMON: '#212121', // 黑色
    HEAVENLY: '#FFD700',  // 金色
  }
  return colors[type]
}

/**
 * 生成渡劫ID
 */
export function generateTribulationId(): string {
  return `trib_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

/**
 * 判断是否渡劫成功
 */
export function isTribulationSuccess(wavesCompleted: number, totalWaves: number): boolean {
  return wavesCompleted >= totalWaves
}

/**
 * 计算渡劫惩罚
 */
export function calculateTribulationPenalty(rank: Rank, wavesFailed: number) {
  const rankLevels: Record<Rank, number> = {
    MORTAL: 1,
    QI_REFINING: 2,
    FOUNDATION: 3,
    GOLDEN_CORE: 4,
    NASCENT_SOUL: 5,
    SPIRIT_SEVERING: 6,
    VOID_REFINING: 7,
    MAHAYANA: 8,
    IMMORTAL: 9,
  }

  const level = rankLevels[rank]

  return {
    healthLost: Math.floor(level * 50 * wavesFailed),
    expLost: Math.floor(level * 100 * wavesFailed),
    innerDemonGained: Math.floor(level * 10 * wavesFailed),
  }
}