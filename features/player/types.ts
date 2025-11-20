import type { Player } from '@/types/database'

/**
 * 玩家相关类型定义
 */

export type { Player }

export type PlayerStats = {
  health: number
  mana: number
  attack: number
  defense: number
}

export type PlayerUpdate = {
  name?: string
  realm?: string
  spiritRoot?: string
  experience?: number
  currency?: number
}