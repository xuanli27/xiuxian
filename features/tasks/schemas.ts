import { z } from 'zod';

export const acceptTaskSchema = z.object({
  taskId: z.string(),
});

export const completeTaskSchema = z.object({
  taskId: z.string(),
  result: z.any().optional(),
});

export const aiGeneratedTaskSchema = z.object({
  title: z.string().describe("任务的标题, 简短且明确"),
  description: z.string().describe("任务的详细描述, 说明背景和要求"),
  type: z.enum(['LINK', 'GAME', 'BATTLE']).describe("任务类型 (LINK, GAME, BATTLE)"),
  difficulty: z.enum(['EASY', 'MEDIUM', 'HARD']).describe("任务难度 (EASY, MEDIUM, HARD)"),
  category: z.enum(['DAILY', 'WEEKLY', 'ACHIEVEMENT']).describe("任务分类 (DAILY, WEEKLY, ACHIEVEMENT)"),
  rewardQi: z.number().int().positive().describe("奖励的修为值"),
  rewardContribution: z.number().int().positive().describe("奖励的贡献点"),
  rewardStones: z.number().int().positive().describe("奖励的灵石"),
  duration: z.number().int().positive().describe("任务的建议完成时间（分钟）"),
  // For specific task types
  url: z.string().url().optional().describe("如果type是LINK, 需要提供一个URL"),
  enemy: z.record(z.any()).optional().describe("如果type是BATTLE, 需要提供敌人的数据"),
  quiz: z.record(z.any()).optional().describe("如果type是GAME, 并且是问答游戏, 需要提供问题数据"),
});