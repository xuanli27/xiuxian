# 🎯 摸鱼修仙录 - 技术最佳实践指南

## 📋 目录

1. [Next.js 15 最佳实践](#nextjs-15-最佳实践)
2. [Drizzle ORM 最佳实践](#drizzle-orm-最佳实践)
3. [Vercel AI SDK 最佳实践](#vercel-ai-sdk-最佳实践)
4. [Server Actions 最佳实践](#server-actions-最佳实践)
5. [性能优化建议](#性能优化建议)

---

## 🚀 Next.js 15 最佳实践

### Server Actions 设计模式

#### 1. 内联 Server Action (紧密耦合)

适用于仅在单个组件中使用的操作:

```typescript
// app/dashboard/page.tsx
export default function DashboardPage() {
  // Server Action 内联定义
  async function updateQi() {
    'use server'
    
    const session = await auth();
    if (!session?.user?.id) return;
    
    // 执行数据库操作
    await db.update(players)
      .set({ qi: sql`${players.qi} + 10` })
      .where(eq(players.userId, session.user.id));
    
    revalidatePath('/dashboard');
  }

  return (
    <form action={updateQi}>
      <button type="submit">修炼</button>
    </form>
  );
}
```

#### 2. 独立文件定义 (可复用)

适用于需要在多个地方调用的操作:

```typescript
// app/actions/player.ts
'use server';

import { auth } from '@/lib/auth/auth';
import { db } from '@/lib/db';
import { players } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function updatePlayerQi(amount: number) {
  const session = await auth();
  
  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }
  
  const [updated] = await db
    .update(players)
    .set({ 
      qi: sql`${players.qi} + ${amount}`,
      updatedAt: new Date()
    })
    .where(eq(players.userId, session.user.id))
    .returning();
  
  revalidatePath('/dashboard');
  return updated;
}
```

#### 3. 表单处理模式

```typescript
// app/actions/game.ts
'use server';

import { auth } from '@/lib/auth/auth';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function completeTask(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }
  
  const taskId = formData.get('taskId') as string;
  
  try {
    // 执行任务完成逻辑
    await db.update(tasks)
      .set({ completed: true, completedAt: new Date() })
      .where(eq(tasks.id, parseInt(taskId)));
    
    revalidatePath('/tasks');
  } catch (error) {
    // 错误处理
    return { error: '任务完成失败' };
  }
  
  // redirect必须在try/catch外部
  redirect('/tasks');
}
```

---

## 🗄️ Drizzle ORM 最佳实践

### 数据库连接配置

#### Vercel Postgres 连接

```typescript
// lib/db/index.ts
import { drizzle } from 'drizzle-orm/vercel-postgres';
import { sql } from '@vercel/postgres';
import * as schema from './schema';

// Vercel会自动检测POSTGRES_URL环境变量
export const db = drizzle(sql, { schema });
```

#### 使用连接池 (生产环境推荐)

```typescript
// lib/db/index.ts
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

// 创建连接池
const client = postgres(process.env.POSTGRES_URL!, {
  max: 10, // 最大连接数
  idle_timeout: 20, // 空闲超时(秒)
  connect_timeout: 10, // 连接超时(秒)
});

export const db = drizzle(client, { schema });
```

### Schema 设计最佳实践

#### 1. 使用自定义Schema分组

```typescript
// lib/db/schema.ts
import { pgSchema, pgTable, serial, varchar, timestamp } from 'drizzle-orm/pg-core';

// 自定义Schema
const gameSchema = pgSchema('game');

// 在自定义Schema中定义表
export const players = gameSchema.table('players', {
  id: serial('id').primaryKey(),
  userId: varchar('user_id', { length: 255 }).notNull(),
  name: varchar('name', { length: 100 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// SQL生成: game.players
```

#### 2. 索引优化

```typescript
// lib/db/schema.ts
export const players = pgTable('players', {
  id: serial('id').primaryKey(),
  userId: varchar('user_id', { length: 255 }).notNull(),
  rank: varchar('rank', { length: 50 }).notNull(),
  contribution: integer('contribution').notNull(),
}, (table) => {
  return {
    // 单列索引
    userIdIdx: index('player_user_id_idx').on(table.userId),
    rankIdx: index('player_rank_idx').on(table.rank),
    
    // 复合索引 (用于排行榜查询)
    leaderboardIdx: index('player_leaderboard_idx').on(
      table.rank, 
      table.contribution
    ),
    
    // 唯一约束
    userIdUnique: unique('player_user_id_unique').on(table.userId),
  };
});
```

#### 3. 关系定义

```typescript
// lib/db/schema.ts
import { relations } from 'drizzle-orm';

export const usersRelations = relations(users, ({ one, many }) => ({
  player: one(players, {
    fields: [users.id],
    references: [players.userId],
  }),
  sessions: many(sessions),
}));

export const playersRelations = relations(players, ({ one, many }) => ({
  user: one(users, {
    fields: [players.userId],
    references: [users.id],
  }),
  tasks: many(tasks),
}));
```

### 查询优化

#### 1. 使用预编译语句

```typescript
// lib/db/queries/player.ts
import { db } from '@/lib/db';
import { players } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

// 预编译查询
const getPlayerByUserIdPrepared = db
  .select()
  .from(players)
  .where(eq(players.userId, sql.placeholder('userId')))
  .prepare('get_player_by_user_id');

export async function getPlayerByUserId(userId: string) {
  const [player] = await getPlayerByUserIdPrepared.execute({ userId });
  return player;
}
```

#### 2. 批量操作

```typescript
// lib/db/queries/tasks.ts
export async function bulkCreateTasks(tasksData: NewTask[]) {
  return await db
    .insert(tasks)
    .values(tasksData)
    .returning();
}

export async function bulkUpdateTasks(updates: { id: number; completed: boolean }[]) {
  // 使用事务批量更新
  return await db.transaction(async (tx) => {
    const results = [];
    for (const update of updates) {
      const [result] = await tx
        .update(tasks)
        .set({ completed: update.completed })
        .where(eq(tasks.id, update.id))
        .returning();
      results.push(result);
    }
    return results;
  });
}
```

#### 3. 高效的分页查询

```typescript
// lib/db/queries/leaderboard.ts
export async function getLeaderboard(page: number = 1, pageSize: number = 20) {
  const offset = (page - 1) * pageSize;
  
  return await db
    .select()
    .from(players)
    .orderBy(desc(players.rank), desc(players.contribution))
    .limit(pageSize)
    .offset(offset);
}
```

### 数据库迁移管理

```bash
# 生成迁移文件
pnpm drizzle-kit generate

# 推送到数据库
pnpm drizzle-kit push

# 删除迁移
pnpm drizzle-kit drop

# 启动Studio
pnpm drizzle-kit studio
```

#### 编程式迁移

```typescript
// scripts/migrate.ts
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';

async function runMigrations() {
  const client = postgres(process.env.POSTGRES_URL!, { max: 1 });
  const db = drizzle(client);
  
  console.log('Running migrations...');
  await migrate(db, { migrationsFolder: './lib/db/migrations' });
  console.log('Migrations completed!');
  
  await client.end();
}

runMigrations().catch(console.error);
```

---

## 🤖 Vercel AI SDK 最佳实践

### Google Gemini 集成

#### 1. 基础文本生成

```typescript
// app/actions/ai.ts
'use server';

import { google } from '@ai-sdk/google';
import { generateText } from 'ai';
import { auth } from '@/lib/auth/auth';

const geminiFlash = google('gemini-2.0-flash-001');

export async function generateFeedback(score: number) {
  await auth(); // 确保已认证
  
  const { text } = await generateText({
    model: geminiFlash,
    temperature: 0.8,
    maxTokens: 100,
    prompt: `灵根混沌度${score},给出毒舌评价`,
  });
  
  return text;
}
```

#### 2. 流式响应 (Server Action)

```typescript
// app/actions/ai.ts
'use server';

import { streamText } from 'ai';
import { createStreamableValue } from 'ai/rsc';
import { google } from '@ai-sdk/google';

export async function streamDailyTasks(rankLabel: string) {
  await auth();
  
  const stream = createStreamableValue('');
  
  (async () => {
    const { textStream } = await streamText({
      model: google('gemini-2.0-flash-001'),
      prompt: `生成4个${rankLabel}的摸鱼任务`,
    });
    
    for await (const delta of textStream) {
      stream.update(delta);
    }
    
    stream.done();
  })();
  
  return { output: stream.value };
}
```

#### 3. 客户端消费流式数据

```typescript
// components/TaskGenerator.tsx
'use client';

import { useState } from 'react';
import { readStreamableValue } from 'ai/rsc';
import { streamDailyTasks } from '@/app/actions/ai';

export function TaskGenerator({ rank }: { rank: string }) {
  const [tasks, setTasks] = useState('');
  const [loading, setLoading] = useState(false);
  
  async function generate() {
    setLoading(true);
    setTasks('');
    
    const { output } = await streamDailyTasks(rank);
    
    for await (const delta of readStreamableValue(output)) {
      setTasks(current => current + delta);
    }
    
    setLoading(false);
  }
  
  return (
    <div>
      <button onClick={generate} disabled={loading}>
        {loading ? '生成中...' : '生成任务'}
      </button>
      <div>{tasks}</div>
    </div>
  );
}
```

#### 4. 结构化输出

```typescript
// app/actions/ai.ts
'use server';

import { generateObject } from 'ai';
import { google } from '@ai-sdk/google';
import { z } from 'zod';

const quizSchema = z.object({
  questions: z.array(
    z.object({
      question: z.string(),
      options: z.array(z.string()).length(4),
      correctIndex: z.number().min(0).max(3),
    })
  ).length(3)
});

export async function generateTribulationQuiz(rankLabel: string) {
  await auth();
  
  const { object } = await generateObject({
    model: google('gemini-2.0-flash-001'),
    temperature: 0.7,
    schema: quizSchema,
    prompt: `为${rankLabel}生成3道天劫选择题`,
  });
  
  return object.questions;
}
```

#### 5. API Route 流式响应

```typescript
// app/api/chat/route.ts
import { google } from '@ai-sdk/google';
import { streamText, convertToModelMessages } from 'ai';

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();
  
  const result = streamText({
    model: google('gemini-2.5-flash'),
    messages: convertToModelMessages(messages),
  });
  
  return result.toUIMessageStreamResponse();
}
```

### 工具调用 (Tool Calling)

```typescript
// app/actions/ai.ts
'use server';

import { generateText } from 'ai';
import { google } from '@ai-sdk/google';
import { z } from 'zod';

export async function analyzeTask(taskDescription: string) {
  const { text, toolCalls } = await generateText({
    model: google('gemini-2.0-flash-001'),
    prompt: `分析任务: ${taskDescription}`,
    tools: {
      calculateReward: {
        description: '计算任务奖励',
        parameters: z.object({
          difficulty: z.enum(['EASY', 'MEDIUM', 'HARD']),
          duration: z.number(),
        }),
        execute: async ({ difficulty, duration }) => {
          const baseReward = { EASY: 10, MEDIUM: 20, HARD: 30 }[difficulty];
          return baseReward * duration;
        },
      },
    },
  });
  
  return { text, toolCalls };
}
```

---

## 🔒 Server Actions 安全最佳实践

### 1. 权限验证

```typescript
// app/actions/player.ts
'use server';

import { auth } from '@/lib/auth/auth';

export async function updatePlayerData(updates: Partial<PlayerData>) {
  // 必须验证用户登录
  const session = await auth();
  
  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }
  
  // 验证用户只能修改自己的数据
  const player = await getPlayerByUserId(session.user.id);
  
  if (!player) {
    throw new Error('Player not found');
  }
  
  // 执行更新
  return await db.update(players)
    .set(updates)
    .where(eq(players.userId, session.user.id))
    .returning();
}
```

### 2. 输入验证

```typescript
// app/actions/game.ts
'use server';

import { z } from 'zod';

const updateQiSchema = z.object({
  amount: z.number().min(1).max(1000),
});

export async function updateQi(amount: number) {
  await auth();
  
  // Zod验证
  const validated = updateQiSchema.parse({ amount });
  
  // 继续执行...
}
```

### 3. 错误处理

```typescript
// app/actions/tasks.ts
'use server';

export async function completeTask(taskId: number) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' };
    }
    
    const [task] = await db
      .update(tasks)
      .set({ completed: true })
      .where(eq(tasks.id, taskId))
      .returning();
    
    revalidatePath('/tasks');
    return { success: true, task };
    
  } catch (error) {
    console.error('Task completion failed:', error);
    return { success: false, error: '任务完成失败' };
  }
}
```

---

## ⚡ 性能优化建议

### 1. 数据库查询优化

```typescript
// ❌ 不好的做法 - N+1查询
async function getPlayersWithTasks() {
  const players = await db.select().from(players);
  
  for (const player of players) {
    player.tasks = await db
      .select()
      .from(tasks)
      .where(eq(tasks.playerId, player.id));
  }
  
  return players;
}

// ✅ 好的做法 - 使用JOIN
async function getPlayersWithTasks() {
  return await db
    .select()
    .from(players)
    .leftJoin(tasks, eq(players.id, tasks.playerId));
}
```

### 2. 缓存策略

```typescript
// app/actions/leaderboard.ts
'use server';

import { unstable_cache } from 'next/cache';

export const getLeaderboard = unstable_cache(
  async () => {
    return await db
      .select()
      .from(players)
      .orderBy(desc(players.contribution))
      .limit(100);
  },
  ['leaderboard'],
  {
    revalidate: 300, // 5分钟缓存
    tags: ['leaderboard'],
  }
);
```

### 3. 并行查询

```typescript
// app/dashboard/page.tsx
export default async function DashboardPage() {
  // 并行获取数据
  const [player, tasks, leaderboard] = await Promise.all([
    getPlayerData(),
    getActiveTasks(),
    getLeaderboard(),
  ]);
  
  return <Dashboard player={player} tasks={tasks} leaderboard={leaderboard} />;
}
```

### 4. 按需加载

```typescript
// components/Leaderboard.tsx
import dynamic from 'next/dynamic';

// 动态导入,减少初始包大小
const LeaderboardChart = dynamic(
  () => import('./LeaderboardChart'),
  { 
    loading: () => <div>加载中...</div>,
    ssr: false // 仅客户端渲染
  }
);
```

---

## 📚 推荐资源

- [Next.js 15 官方文档](https://nextjs.org/docs)
- [Drizzle ORM 文档](https://orm.drizzle.team)
- [Vercel AI SDK 文档](https://sdk.vercel.ai/docs)
- [Google Gemini API 文档](https://ai.google.dev/docs)

---

**遵循这些最佳实践,您的全栈应用将更加健壮、高效和可维护!**