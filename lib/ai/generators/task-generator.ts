import { generateAIText } from '../client'
import { PROMPTS, buildSystemPrompt } from '../prompts'
import type { AITaskGeneration } from '../types'

/**
 * AI任务生成器
 */
export async function generateTask(context: string): Promise<AITaskGeneration> {
  const prompt = PROMPTS.GENERATE_TASK(context)
  const systemPrompt = buildSystemPrompt('taskGenerator')
  
  const response = await generateAIText(prompt)
  
  try {
    // 清理可能的markdown代码块标记
    const cleaned = response.replace(/```json\n?|\n?```/g, '').trim()
    return JSON.parse(cleaned) as AITaskGeneration
  } catch (error) {
    console.error('Failed to parse AI task generation:', error)
    throw new Error('任务生成失败,请重试')
  }
}

/**
 * 批量生成任务
 */
export async function generateMultipleTasks(
  contexts: string[],
  count: number = 3
): Promise<AITaskGeneration[]> {
  const tasks: AITaskGeneration[] = []
  
  for (let i = 0; i < Math.min(count, contexts.length); i++) {
    try {
      const task = await generateTask(contexts[i])
      tasks.push(task)
    } catch (error) {
      console.error(`Failed to generate task ${i + 1}:`, error)
    }
  }
  
  return tasks
}