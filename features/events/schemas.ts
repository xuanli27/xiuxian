import { z } from 'zod';

export const processEventChoiceSchema = z.object({
  playerId: z.number().int().positive(),
  eventId: z.string().min(1),
  choiceId: z.string().min(1),
});

export const eventContextSchema = z.object({
  playerId: z.number().int().positive(),
  playerState: z.object({
    rank: z.string(),
    level: z.number().int().positive(),
    qi: z.number(),
    spiritStones: z.number().int(),
    mindState: z.string(),
  }),
  recentEvents: z.array(z.string()),
});
// Zod schema for validating AI-generated event data
export const aiGeneratedEventSchema = z.object({
  id: z.string().describe("事件的唯一标识符, 例如 'mysterious_cave'"),
  title: z.string().describe("事件的标题, 简短且引人入胜"),
  description: z.string().describe("事件的详细描述, 描绘场景和情况"),
  type: z.enum(['MAJOR', 'MINOR', 'CHAIN']).describe("事件类型"),
  choices: z.array(z.object({
    id: z.string().describe("选项的唯一标识符, 例如 'enter_cave'"),
    text: z.string().describe("选项的描述文本"),
    outcomes: z.array(z.object({
    type: z.enum(['qi', 'spiritStones', 'innerDemon', 'item', 'statusEffect']).describe("结果类型"),
    value: z.union([
      z.number(),
      z.string(),
      z.object({
        id: z.string(),
        name: z.string(),
        description: z.string(),
        duration: z.number().optional().describe("效果持续时间（秒），可选"),
        modifiers: z.record(z.any()).optional().describe("具体的数值修正，可选"),
      })
    ]).describe("结果的数值、物品ID或状态效果对象"),
    description: z.string().describe("该结果的叙述性描述"),
  })),
  })).min(2).max(4).describe("玩家可以做出的选择, 至少2个, 最多4个"),
});