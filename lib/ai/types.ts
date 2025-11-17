/**
 * AI相关类型定义
 */

export type AITaskGeneration = {
  title: string
  description: string
  type: 'DAILY' | 'WEEKLY' | 'ACHIEVEMENT'
  difficulty: 'EASY' | 'MEDIUM' | 'HARD'
  rewards: {
    experience: number
    currency: number
    items?: string[]
  }
}

export type AIStoryGeneration = {
  content: string
  mood?: 'exciting' | 'peaceful' | 'dangerous' | 'mysterious'
}

export type AINameGeneration = {
  name: string
  meaning?: string
}

export type AIDialogueGeneration = {
  speaker: string
  content: string
  emotion?: 'happy' | 'sad' | 'angry' | 'neutral'
}

export type AIAdvice = {
  category: 'cultivation' | 'resources' | 'strategy' | 'warning'
  content: string
  priority: 'high' | 'medium' | 'low'
}