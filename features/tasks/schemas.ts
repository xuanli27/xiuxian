import { z } from 'zod'

/**
 * 任务数据验证Schema
 */

export const createTaskSchema = z.object({
  title: z.string().min(2, '标题至少2个字符').max(100, '标题最多100个字符'),
  description: z.string().min(10, '描述至少10个字符').max(500, '描述最多500个字符'),
  type: z.enum(['DAILY', 'WEEKLY', 'ACHIEVEMENT']),
  difficulty: z.enum(['EASY', 'MEDIUM', 'HARD']),
  rewards: z.object({
    experience: z.number().int().min(0),
    currency: z.number().int().min(0),
    items: z.array(z.string()).optional(),
  }),
  requirements: z.record(z.any()).optional(),
})

export const acceptTaskSchema = z.object({
  taskId: z.string().uuid(),
  playerId: z.string().uuid(),
})

export const completeTaskSchema = z.object({
  taskId: z.string().uuid(),
  playerId: z.string().uuid(),
})

export const updateTaskProgressSchema = z.object({
  taskId: z.string().uuid(),
  progress: z.record(z.any()),
})

export const generateTaskSchema = z.object({
  context: z.string().min(10),
  count: z.number().int().min(1).max(10).default(3),
})

export type CreateTaskInput = z.infer<typeof createTaskSchema>
export type AcceptTaskInput = z.infer<typeof acceptTaskSchema>
export type CompleteTaskInput = z.infer<typeof completeTaskSchema>
export type UpdateTaskProgressInput = z.infer<typeof updateTaskProgressSchema>
export type GenerateTaskInput = z.infer<typeof generateTaskSchema>