import { zodToJsonSchema } from 'zod-to-json-schema';
import { aiGeneratedEventSchema } from '@/features/events/schemas';
import { aiGeneratedTaskSchema } from '@/features/tasks/schemas';

// ==================== Schemas to JSON Schemas ====================

const eventJsonSchema = zodToJsonSchema(aiGeneratedEventSchema, "aiGeneratedEventSchema");
const taskJsonSchema = zodToJsonSchema(aiGeneratedTaskSchema, "aiGeneratedTaskSchema");

// ==================== Event Prompts ====================

export const GENERATE_STRUCTURED_EVENT = (playerContext: object) => `
你是一个富有想象力的游戏事件设计师，正在为一个名为“摸鱼修仙录”的放置类 RPG 设计随机事件。
游戏的世界观是：在一个现代化的修仙世界里，修行者们伪装成普通的上班族，通过在工作中“摸鱼”来修炼。他们的修炼与现代职场生活、网络文化和技术梗紧密结合。

你的任务是根据玩家的当前状态，为他/她设计一个符合世界观的、有趣的、结构化的随机事件。

**玩家当前状态:**
\`\`\`json
${JSON.stringify(playerContext, null, 2)}
\`\`\`

**事件设计要求:**
1.  **贴合世界观**: 事件应该巧妙地将修仙概念与现代职场或网络文化结合。例如：“在一个陈旧的服务器（洞府）中发现了一段上古代码（功法秘籍）”、“被邀请参加一个跨部门的项目复盘会（论道大会）”。
2.  **提供选择**: 事件必须提供 2 到 4 个有意义的选择，每个选择都会带来不同的结果。
3.  **明确的结果**: 每个选择的结果应该是具体的，例如增加/减少修为(qi)、灵石(spiritStones)、心魔(innerDemon)，或者获得一件物品(item)，或者获得一个状态效果(statusEffect)。
4.  **结构化输出**: 你必须严格按照下面的 JSON schema 来返回事件数据。

**输出 JSON Schema:**
\`\`\`json
${JSON.stringify(eventJsonSchema, null, 2)}
\`\`\`

请严格按照以上要求，仅返回一个符合 schema 的 JSON 对象，不要包含任何额外的解释或注释。
`;


// ==================== Task Prompts ====================

export const GENERATE_STRUCTURED_TASK = (playerContext: object) => `
你是一个富有想象力的游戏设计师，正在为一个名为“摸鱼修仙录”的放置类 RPG 设计任务。
游戏的世界观是：在一个现代化的修仙世界里，修行者们伪装成普通的上班族，通过在工作中“摸鱼”来修炼。他们的修炼与现代职场生活、网络文化和技术梗紧密结合。

你的任务是根据玩家的当前状态，为他/她设计一个符合世界观的、有趣的、结构化的新任务。

**玩家当前状态:**
\`\`\`json
${JSON.stringify(playerContext, null, 2)}
\`\`\`

**任务设计要求:**
1.  **贴合世界观**: 任务应该巧妙地将修仙概念与现代职场或网络文化结合。例如：“修复一个上古阵法（遗留代码库）”、“参加一场跨部门的论道大会（项目复盘会）”、“从网络巨兽（大型网站）那里窃取数据灵气”。
2.  **难度适中**: 根据玩家的境界(rank)和等级(level)设计合理的任务难度和奖励。境界越高，任务应该越复杂，奖励也越丰厚。
3.  **多样性**: 任务类型可以是“摸鱼链接(LINK)”（浏览特定网页）、“小游戏(GAME)”（完成一个逻辑谜题或问答）或“心魔挑战(BATTLE)”（一场基于数据的战斗）。
4.  **结构化输出**: 你必须严格按照下面的 JSON schema 来返回任务数据。

**输出 JSON Schema:**
\`\`\`json
${JSON.stringify(taskJsonSchema, null, 2)}
\`\`\`

请严格按照以上要求，仅返回一个符合 schema 的 JSON 对象，不要包含任何额外的解释或注释。
`;
