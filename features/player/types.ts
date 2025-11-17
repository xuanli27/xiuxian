import { Player } from '@prisma/client'

/**
 * 玩家相关类型定义
 */

export type PlayerWithUser = Player & {
  user: {
    name: string | null
    email: string | null
  }
}

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