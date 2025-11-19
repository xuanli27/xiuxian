import { generateAIText } from '../client'

/**
 * 名称生成器
 */
export async function generateName(
  type: 'technique' | 'item' | 'npc',
  theme?: string
): Promise<string> {
  const themeText = theme ? `主题：${theme}` : ''
  const prompt = `生成一个${type === 'technique' ? '功法' : type === 'item' ? '物品' : 'NPC'}的名字。${themeText}
要求：符合修仙世界观，简洁有力，富有意境。只返回名字，不要其他内容。`
  return await generateAIText(prompt)
}