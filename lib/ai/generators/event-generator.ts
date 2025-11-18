import { generateText } from 'ai';
import { getAIModel } from '../config';
import type { GameEvent, EventChoice } from '@/types/events';
import type { EventContext } from '@/features/events/types';

const MODEL = getAIModel();

const SYSTEM_PROMPT = `你是"摸鱼修仙录"游戏的事件生成器。这是一个修仙题材的放置游戏，核心玩法是事件流驱动。

你的任务是根据玩家当前状态和历史，生成有趣的修仙事件。事件应该：
1. 符合修仙世界观（境界、功法、灵石等）
2. 与玩家当前状态相关（境界、心性、资源）
3. 提供2-4个有意义的选择
4. 每个选择都有不同的后果
5. 保持"摸鱼"的轻松氛围

事件类型：
- MAJOR: 重大事件，影响深远
- MINOR: 日常小事，轻松有趣
- CHAIN: 连锁事件，有后续发展`;

export async function generateNextEvent(context: EventContext): Promise<GameEvent> {
  const userPrompt = buildEventPrompt(context);
  
  const { text } = await generateText({
    model: MODEL,
    system: SYSTEM_PROMPT,
    prompt: userPrompt,
  });

  return parseEventFromAI(text);
}

function buildEventPrompt(context: EventContext): string {
  const { playerState, recentEvents } = context;
  
  return `
玩家当前状态：
- 境界：${playerState.rank}
- 等级：${playerState.level}
- 灵气：${playerState.qi}
- 灵石：${playerState.spiritStones}
- 心性：${playerState.mindState}

最近事件：
${recentEvents.length > 0 ? recentEvents.join('\n') : '无'}

请生成一个新的修仙事件，返回JSON格式：
{
  "id": "唯一ID",
  "eventType": "MAJOR/MINOR/CHAIN",
  "trigger": {
    "type": "TIME/LOCATION/CONDITION",
    "value": "触发条件"
  },
  "content": {
    "title": "事件标题",
    "description": "事件描述（50-150字）",
    "imageUrl": "可选的图片URL"
  },
  "choices": [
    {
      "id": "选项ID",
      "text": "选项文本",
      "actionId": "动作ID（用于服务端处理）"
    }
  ]
}

只返回JSON，不要其他文字。
`;
}

function parseEventFromAI(aiResponse: string): GameEvent {
  try {
    const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('AI响应中未找到JSON');
    }
    
    const parsed = JSON.parse(jsonMatch[0]);
    return parsed as GameEvent;
  } catch (error) {
    console.error('解析AI事件失败:', error);
    return getFallbackEvent();
  }
}

function getFallbackEvent(): GameEvent {
  return {
    id: `fallback-${Date.now()}`,
    eventType: 'MINOR',
    trigger: {
      type: 'AUTO',
    },
    content: {
      title: '平静的一天',
      description: '今日无事发生，你在洞府中静心修炼。',
    },
    choices: [
      {
        id: 'continue',
        text: '继续修炼',
        actionId: 'continue_cultivation',
      },
    ],
  };
}