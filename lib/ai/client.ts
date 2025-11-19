import { streamText, generateText, generateObject } from 'ai'
import { getAIModel } from './config'
import type { z } from 'zod'

const MODEL = getAIModel()

/**
 * 流式生成文本
 */
export async function streamAIText(prompt: string) {
  return await streamText({
    model: MODEL,
    prompt
  })
}

/**
 * 同步生成文本
 */
export async function generateAIText(prompt: string) {
  const { text } = await generateText({
    model: MODEL,
    prompt
  })
  return text
}

/**
 * 结构化数据生成
 * @param schema Zod schema
 * @param prompt 提示词
 */
export async function generateStructuredData<T extends z.ZodTypeAny>(
  schema: T,
  prompt: string
): Promise<z.infer<T>> {
  const { object } = await generateObject({
    model: MODEL,
    schema,
    prompt
  })
  return object
}

/**
 * 使用系统提示词生成
 */
export async function generateWithSystem(
  systemPrompt: string,
  userPrompt: string
) {
  const { text } = await generateText({
    model: MODEL,
    system: systemPrompt,
    prompt: userPrompt
  })
  return text
}