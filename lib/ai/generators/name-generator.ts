import { generateAIText } from '../client'
import { PROMPTS } from '../prompts'

/**
 * 名称生成器
 */
export async function generateName(
  type: 'technique' | 'item' | 'npc',
  theme?: string
): Promise<string> {
  const prompt = PROMPTS.GENERATE_NAME(type, theme)
  return await generateAIText(prompt)
}