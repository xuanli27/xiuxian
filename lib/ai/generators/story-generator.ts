import { generateAIText } from '../client'
import { PROMPTS, buildSystemPrompt } from '../prompts'

/**
 * 剧情生成器
 */
export async function generateStory(
  playerRealm: string,
  event: string
): Promise<string> {
  const prompt = PROMPTS.GENERATE_STORY(playerRealm, event)
  return await generateAIText(prompt)
}