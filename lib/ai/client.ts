import { streamText, generateText } from 'ai'
import { getAIModel } from './config'

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