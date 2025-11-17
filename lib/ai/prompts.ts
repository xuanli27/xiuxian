/**
 * AI提示词模板库
 */

export const PROMPTS = {
  /**
   * 任务生成提示词
   */
  GENERATE_TASK: (context: string) => `
你是一个修仙世界的任务发布者。基于以下上下文生成一个修仙任务:

上下文: ${context}

请生成一个JSON格式的任务,包含以下字段:
- title: 任务标题(简短有趣)
- description: 任务描述(100-200字)
- type: 任务类型(DAILY/WEEKLY/ACHIEVEMENT)
- difficulty: 难度(EASY/MEDIUM/HARD)
- rewards: 奖励对象 {experience: number, currency: number, items?: string[]}

要求:
1. 符合修仙世界观
2. 任务要有趣且有挑战性
3. 奖励合理平衡
4. 只返回JSON,不要其他文字
`,

  /**
   * 剧情生成提示词
   */
  GENERATE_STORY: (playerRealm: string, event: string) => `
你是一个修仙小说作者。基于以下信息生成一段剧情:

玩家境界: ${playerRealm}
事件: ${event}

要求:
1. 50-100字的精彩剧情描述
2. 符合修仙世界观和境界设定
3. 语言优美,引人入胜
4. 只返回剧情文本
`,

  /**
   * 名称生成提示词
   */
  GENERATE_NAME: (type: 'technique' | 'item' | 'npc', theme?: string) => `
你是一个修仙世界的命名大师。请生成一个${type === 'technique' ? '功法' : type === 'item' ? '物品' : 'NPC'}的名称。

${theme ? `主题: ${theme}` : ''}

要求:
1. 名称要有修仙风格
2. 4-8个字
3. 朗朗上口
4. 只返回名称
`,

  /**
   * 对话生成提示词
   */
  GENERATE_DIALOGUE: (npcRole: string, context: string) => `
你扮演一个修仙世界的${npcRole}。基于以下情境生成对话:

情境: ${context}

要求:
1. 符合角色身份和修仙世界观
2. 对话自然流畅
3. 20-50字
4. 只返回对话内容
`,

  /**
   * 建议生成提示词
   */
  GENERATE_ADVICE: (playerData: string) => `
你是一个修仙世界的前辈高人。基于玩家当前状态给出修炼建议:

玩家状态: ${playerData}

要求:
1. 给出3-5条具体建议
2. 包含修炼方向、资源获取、风险提示等
3. 符合修仙世界观
4. 每条建议20-30字
5. 返回JSON数组格式: ["建议1", "建议2", ...]
`
} as const

/**
 * 构建系统提示词
 */
export function buildSystemPrompt(role: string): string {
  const systemPrompts = {
    taskGenerator: '你是一个专业的游戏任务设计师,擅长创造有趣且平衡的任务。',
    storyWriter: '你是一个资深的修仙小说作者,擅长创造引人入胜的剧情。',
    nameCreator: '你是一个修仙世界的命名大师,擅长创造有意境的名称。',
    npcActor: '你是一个经验丰富的角色扮演者,能够完美演绎各种角色。',
    advisor: '你是一个智慧的修仙前辈,善于给出恰当的建议。'
  }
  
  return systemPrompts[role as keyof typeof systemPrompts] || '你是一个有用的助手。'
}