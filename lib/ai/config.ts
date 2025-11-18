import { createOpenAI } from '@ai-sdk/openai';
import { createOpenAICompatible } from '@ai-sdk/openai-compatible';
import { createGoogleGenerativeAI } from '@ai-sdk/google';

type AIProvider = 'openai' | 'google' | 'azure' | 'custom';

const AI_PROVIDER = (process.env.AI_PROVIDER || 'openai') as AIProvider;

export function getAIModel() {
  switch (AI_PROVIDER) {
    case 'google':
      const google = createGoogleGenerativeAI({
        apiKey: process.env.GOOGLE_API_KEY!,
        baseURL: process.env.GOOGLE_BASE_URL,
      });
      return google(process.env.GOOGLE_MODEL || 'gemini-2.0-flash-exp');
    
    case 'azure':
      const azure = createOpenAI({
        apiKey: process.env.AZURE_API_KEY!,
        baseURL: process.env.AZURE_BASE_URL!,
      });
      return azure(process.env.AZURE_MODEL || 'gpt-4');
    
    case 'custom':
      // 使用 OpenAI Compatible 格式，支持非标准端点（如 /v1/responses）
      const custom = createOpenAICompatible({
        name: 'custom-provider',
        apiKey: process.env.OPENAI_API_KEY!,
        baseURL: process.env.OPENAI_BASE_URL!,
      });
      return custom.chatModel(process.env.OPENAI_MODEL || 'gpt-4o-mini');
    case 'openai':
    default:
      // 标准 OpenAI API（/v1/chat/completions）
      const openai = createOpenAI({
        apiKey: process.env.OPENAI_API_KEY!,
        baseURL: process.env.OPENAI_BASE_URL,
      });
      return openai(process.env.OPENAI_MODEL || 'gpt-4o-mini');
  }
}