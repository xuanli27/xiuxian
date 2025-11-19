import { generateAIText } from '../client'

/**
 * 剧情生成器
 */
export async function generateStory(
  playerRealm: string,
  event: string
): Promise<string> {
  const prompt = `你是一个修仙世界的说书人。玩家当前境界：${playerRealm}，遇到了以下事件：${event}
请生成一段生动的剧情描述，要求：
1. 符合修仙世界观
2. 与玩家境界相符
3. 富有画面感和代入感
4. 200字以内`
  return await generateAIText(prompt)
}