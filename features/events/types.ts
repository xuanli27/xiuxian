import { z } from 'zod'
import { processEventChoiceSchema, aiGeneratedEventSchema } from './schemas'
import type { Rank } from '@/types/database'

/**
 * AI生成事件类型
 */
export type AIEvent = z.infer<typeof aiGeneratedEventSchema>

/**
 * 处理事件选择的输入类型
 */
export type ProcessEventChoiceInput = z.infer<typeof processEventChoiceSchema>

/**
 * 事件上下文(用于AI生成)
 */
export type EventContext = {
  playerId: number
  playerState: {
    rank: Rank
    level: number
    qi: number
    spiritStones: number
    mindState: string
  }
  recentEvents: string[]
}