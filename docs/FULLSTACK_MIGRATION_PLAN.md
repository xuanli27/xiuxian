# 🚀 摸鱼修仙录 - 全栈架构迁移方案

## 📋 项目概述

将**摸鱼修仙录**从纯前端项目升级为**前后端一体化的全栈应用**，基于 **Next.js 15 App Router** + **Vercel AI SDK** + **PostgreSQL** + **NextAuth.js**，实现用户认证、数据持久化、服务端渲染等完整功能。

---

## 🎯 核心目标

### 功能目标
1. ✅ **用户系统**: 注册、登录、OAuth认证
2. ✅ **数据持久化**: 游戏进度云端保存
3. ✅ **服务端渲染**: SEO优化、性能提升
4. ✅ **AI集成**: Vercel AI SDK + Gemini API
5. ✅ **实时同步**: 跨设备游戏进度同步
6. ✅ **社交功能**: 排行榜、宗门互动

### 技术架构
```
┌─────────────────────────────────────────────────────┐
│  Frontend: Next.js 15 (App Router + RSC)            │
├─────────────────────────────────────────────────────┤
│  Auth: NextAuth.js v5 (Google/GitHub OAuth)         │
├─────────────────────────────────────────────────────┤
│  API: Next.js Server Actions + API Routes           │
├─────────────────────────────────────────────────────┤
│  Database: PostgreSQL (Vercel Postgres)             │
│  ORM: Drizzle ORM                                    │
├─────────────────────────────────────────────────────┤
│  AI: Vercel AI SDK + Google Gemini                  │
├─────────────────────────────────────────────────────┤
│  State: Zustand (Local) + Server State (Tanstack)   │
├─────────────────────────────────────────────────────┤
│  Deployment: Vercel                                  │
└─────────────────────────────────────────────────────┘
```

---

## 🏗️ 全栈架构设计

### 1. 目录结构

```
xiuxian-nextjs/
├── app/                              # Next.js App Router
│   ├── (auth)/                      # 认证路由组
│   │   ├── login/
│   │   │   └── page.tsx             # 登录页
│   │   ├── register/
│   │   │   └── page.tsx             # 注册页
│   │   └── layout.tsx               # 认证布局
│   │
│   ├── (game)/                      # 游戏路由组 (需要认证)
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   ├── tasks/
│   │   │   └── page.tsx
│   │   ├── sect/
│   │   │   └── page.tsx
│   │   ├── inventory/
│   │   │   └── page.tsx
│   │   ├── cave/
│   │   │   └── page.tsx
│   │   └── layout.tsx               # 游戏布局 (含导航栏)
│   │
│   ├── (landing)/                   # 落地页路由组
│   │   ├── page.tsx                 # 首页
│   │   ├── about/
│   │   │   └── page.tsx
│   │   └── layout.tsx
│   │
│   ├── api/                         # API Routes
│   │   ├── auth/
│   │   │   └── [...nextauth]/
│   │   │       └── route.ts         # NextAuth配置
│   │   ├── ai/
│   │   │   ├── feedback/
│   │   │   │   └── route.ts         # AI反馈API
│   │   │   └── stream/
│   │   │       └── route.ts         # AI流式API
│   │   └── leaderboard/
│   │       └── route.ts             # 排行榜API
│   │
│   ├── actions/                     # Server Actions
│   │   ├── auth.ts                  # 认证相关
│   │   ├── player.ts                # 玩家数据CRUD
│   │   ├── game.ts                  # 游戏逻辑
│   │   ├── ai.ts                    # AI生成
│   │   └── leaderboard.ts           # 排行榜
│   │
│   ├── layout.tsx                   # 根布局
│   ├── providers.tsx                # 全局Providers
│   └── globals.css                  # 全局样式
│
├── components/                       # UI组件
│   ├── ui/                          # 基础组件
│   ├── auth/                        # 认证组件
│   │   ├── LoginForm.tsx
│   │   ├── RegisterForm.tsx
│   │   └── AuthProvider.tsx
│   ├── landing/                     # 落地页组件
│   │   ├── Hero.tsx
│   │   ├── Features.tsx
│   │   └── CTA.tsx
│   ├── onboarding/
│   ├── dashboard/
│   ├── tasks/
│   ├── sect/
│   ├── inventory/
│   ├── cave/
│   └── tribulation/
│
├── lib/                              # 核心库
│   ├── auth/
│   │   ├── auth.ts                  # NextAuth配置
│   │   ├── auth-options.ts          # Auth选项
│   │   └── session.ts               # Session工具
│   │
│   ├── db/                          # 数据库
│   │   ├── index.ts                 # Drizzle实例
│   │   ├── schema.ts                # 数据库Schema
│   │   ├── migrations/              # 数据库迁移
│   │   └── queries/                 # 查询函数
│   │       ├── player.ts
│   │       ├── game.ts
│   │       └── leaderboard.ts
│   │
│   ├── ai/                          # AI服务
│   │   ├── gemini.ts                # Gemini Provider
│   │   ├── prompts.ts               # Prompt模板
│   │   └── tools.ts                 # AI Tools
│   │
│   ├── game/                        # 游戏逻辑
│   │   ├── calculations.ts          # 数值计算
│   │   ├── constants.ts             # 游戏常量
│   │   └── utils.ts                 # 游戏工具
│   │
│   └── utils.ts                     # 通用工具
│
├── store/                            # 客户端状态管理
│   └── useGameStore.ts              # Zustand Store
│
├── types/                            # 类型定义
│   ├── auth.ts
│   ├── game.ts
│   ├── database.ts
│   └── index.ts
│
├── hooks/                            # 自定义Hooks
│   ├── usePlayer.ts                 # 玩家数据Hook
│   ├── useGame.ts                   # 游戏逻辑Hook
│   └── useAI.ts                     # AI交互Hook
│
├── middleware.ts                     # Next.js中间件 (认证保护)
├── drizzle.config.ts                # Drizzle配置
├── next.config.ts                   # Next.js配置
├── tailwind.config.ts               # Tailwind配置
├── .env.local                       # 环境变量
└── package.json
```

---

## 💾 数据库设计

### Schema定义 (Drizzle ORM)

```typescript
// lib/db/schema.ts
import { pgTable, varchar, integer, timestamp, jsonb, boolean, serial, index } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// 用户表
export const users = pgTable('users', {
  id: varchar('id', { length: 255 }).primaryKey(),
  email: varchar('email', { length: 255 }).unique().notNull(),
  name: varchar('name', { length: 255 }),
  emailVerified: timestamp('email_verified'),
  image: varchar('image', { length: 512 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// 账户表 (OAuth)
export const accounts = pgTable('accounts', {
  id: varchar('id', { length: 255 }).primaryKey(),
  userId: varchar('user_id', { length: 255 }).notNull().references(() => users.id, { onDelete: 'cascade' }),
  type: varchar('type', { length: 255 }).notNull(),
  provider: varchar('provider', { length: 255 }).notNull(),
  providerAccountId: varchar('provider_account_id', { length: 255 }).notNull(),
  refresh_token: varchar('refresh_token', { length: 512 }),
  access_token: varchar('access_token', { length: 512 }),
  expires_at: integer('expires_at'),
  token_type: varchar('token_type', { length: 255 }),
  scope: varchar('scope', { length: 255 }),
  id_token: varchar('id_token', { length: 2048 }),
  session_state: varchar('session_state', { length: 255 }),
});

// 会话表
export const sessions = pgTable('sessions', {
  id: varchar('id', { length: 255 }).primaryKey(),
  sessionToken: varchar('session_token', { length: 255 }).unique().notNull(),
  userId: varchar('user_id', { length: 255 }).notNull().references(() => users.id, { onDelete: 'cascade' }),
  expires: timestamp('expires').notNull(),
});

// 玩家数据表
export const players = pgTable('players', {
  id: serial('id').primaryKey(),
  userId: varchar('user_id', { length: 255 }).unique().notNull().references(() => users.id, { onDelete: 'cascade' }),
  
  // 基础属性
  name: varchar('name', { length: 100 }).notNull(),
  avatar: varchar('avatar', { length: 512 }),
  rank: varchar('rank', { length: 50 }).notNull().default('MORTAL'),
  level: integer('level').notNull().default(1),
  
  // 资源
  qi: integer('qi').notNull().default(0),
  maxQi: integer('max_qi').notNull().default(100),
  innerDemon: integer('inner_demon').notNull().default(0),
  contribution: integer('contribution').notNull().default(0),
  spiritStones: integer('spirit_stones').notNull().default(0),
  
  // 游戏状态
  spiritRoot: varchar('spirit_root', { length: 50 }).notNull().default('WASTE'),
  mindState: varchar('mind_state', { length: 100 }).notNull().default('刚入职'),
  sectRank: varchar('sect_rank', { length: 50 }).notNull().default('外门牛马'),
  caveLevel: integer('cave_level').notNull().default(1),
  location: varchar('location', { length: 100 }).notNull().default('工位'),
  theme: varchar('theme', { length: 20 }).notNull().default('dark'),
  
  // JSON字段
  inventory: jsonb('inventory').notNull().default({}),
  equipped: jsonb('equipped').notNull().default({}),
  materials: jsonb('materials').notNull().default({}),
  history: jsonb('history').notNull().default([]),
  
  // 时间戳
  createTime: timestamp('create_time').defaultNow().notNull(),
  lastLoginTime: timestamp('last_login_time').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => {
  return {
    userIdIdx: index('player_user_id_idx').on(table.userId),
    rankIdx: index('player_rank_idx').on(table.rank),
    contributionIdx: index('player_contribution_idx').on(table.contribution),
  };
});

// 任务表
export const tasks = pgTable('tasks', {
  id: serial('id').primaryKey(),
  playerId: integer('player_id').notNull().references(() => players.id, { onDelete: 'cascade' }),
  
  title: varchar('title', { length: 255 }).notNull(),
  description: varchar('description', { length: 512 }).notNull(),
  type: varchar('type', { length: 20 }).notNull(),
  
  reward: jsonb('reward').notNull(),
  duration: integer('duration').notNull(),
  completed: boolean('completed').notNull().default(false),
  
  url: varchar('url', { length: 512 }),
  quiz: jsonb('quiz'),
  enemy: jsonb('enemy'),
  
  createdAt: timestamp('created_at').defaultNow().notNull(),
  completedAt: timestamp('completed_at'),
}, (table) => {
  return {
    playerIdIdx: index('task_player_id_idx').on(table.playerId),
    completedIdx: index('task_completed_idx').on(table.completed),
  };
});

// 排行榜表 (用于缓存和历史记录)
export const leaderboard = pgTable('leaderboard', {
  id: serial('id').primaryKey(),
  playerId: integer('player_id').notNull().references(() => players.id, { onDelete: 'cascade' }),
  playerName: varchar('player_name', { length: 100 }).notNull(),
  rank: varchar('rank', { length: 50 }).notNull(),
  level: integer('level').notNull(),
  contribution: integer('contribution').notNull(),
  score: integer('score').notNull(), // 综合分数
  
  season: varchar('season', { length: 50 }).notNull(), // 赛季标识
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => {
  return {
    seasonScoreIdx: index('leaderboard_season_score_idx').on(table.season, table.score),
    playerIdSeasonIdx: index('leaderboard_player_season_idx').on(table.playerId, table.season),
  };
});

// 关系定义
export const usersRelations = relations(users, ({ one, many }) => ({
  player: one(players),
  accounts: many(accounts),
  sessions: many(sessions),
}));

export const playersRelations = relations(players, ({ one, many }) => ({
  user: one(users, {
    fields: [players.userId],
    references: [users.id],
  }),
  tasks: many(tasks),
  leaderboardEntries: many(leaderboard),
}));

export const tasksRelations = relations(tasks, ({ one }) => ({
  player: one(players, {
    fields: [tasks.playerId],
    references: [players.id],
  }),
}));
```

---

## 🔐 认证系统设计

### NextAuth.js v5 配置

```typescript
// lib/auth/auth.ts
import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import GitHub from 'next-auth/providers/github';
import { DrizzleAdapter } from '@auth/drizzle-adapter';
import { db } from '@/lib/db';

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(db),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: '/login',
    error: '/login',
  },
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // 登录后重定向到游戏主页
      if (url.startsWith('/')) return `${baseUrl}${url}`;
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl + '/dashboard';
    },
  },
  session: {
    strategy: 'database',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
});
```

### 中间件保护

```typescript
// middleware.ts
import { auth } from '@/lib/auth/auth';
import { NextResponse } from 'next/server';

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isGameRoute = req.nextUrl.pathname.startsWith('/dashboard') ||
                      req.nextUrl.pathname.startsWith('/tasks') ||
                      req.nextUrl.pathname.startsWith('/sect') ||
                      req.nextUrl.pathname.startsWith('/inventory') ||
                      req.nextUrl.pathname.startsWith('/cave');
  
  if (isGameRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL('/login', req.url));
  }
  
  if (req.nextUrl.pathname.startsWith('/login') && isLoggedIn) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }
  
  return NextResponse.next();
});

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
```

---

## 🔌 Server Actions API设计

### 玩家数据管理

```typescript
// app/actions/player.ts
'use server';

import { auth } from '@/lib/auth/auth';
import { db } from '@/lib/db';
import { players } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

// 获取玩家数据
export async function getPlayerData() {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }
  
  const [player] = await db
    .select()
    .from(players)
    .where(eq(players.userId, session.user.id))
    .limit(1);
  
  return player;
}

// 更新玩家数据
export async function updatePlayerData(updates: Partial<PlayerData>) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }
  
  const [updated] = await db
    .update(players)
    .set({
      ...updates,
      updatedAt: new Date(),
    })
    .where(eq(players.userId, session.user.id))
    .returning();
  
  revalidatePath('/dashboard');
  return updated;
}

// 创建初始玩家数据
export async function createPlayer(name: string, spiritRoot: string, mindState: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }
  
  const [player] = await db
    .insert(players)
    .values({
      userId: session.user.id,
      name,
      spiritRoot,
      mindState,
    })
    .returning();
  
  return player;
}
```

### 游戏逻辑Server Actions

```typescript
// app/actions/game.ts
'use server';

import { auth } from '@/lib/auth/auth';
import { db } from '@/lib/db';
import { players } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { calculateMaxQi, getRankLabel } from '@/lib/game/calculations';
import { RANK_CONFIG } from '@/lib/game/constants';

// 增加灵气
export async function gainQi(amount: number) {
  const session = await auth();
  if (!session?.user?.id) return { success: false };
  
  const [player] = await db
    .select()
    .from(players)
    .where(eq(players.userId, session.user.id))
    .limit(1);
  
  if (!player) return { success: false };
  
  const newQi = player.qi + amount;
  
  await db
    .update(players)
    .set({ qi: newQi, updatedAt: new Date() })
    .where(eq(players.userId, session.user.id));
  
  return { success: true, newQi };
}

// 小境界突破
export async function minorBreakthrough() {
  const session = await auth();
  if (!session?.user?.id) return { success: false };
  
  const [player] = await db
    .select()
    .from(players)
    .where(eq(players.userId, session.user.id))
    .limit(1);
  
  if (!player) return { success: false };
  
  const nextLevel = player.level + 1;
  const nextMaxQi = calculateMaxQi(player.rank, nextLevel);
  
  await db
    .update(players)
    .set({
      level: nextLevel,
      qi: 0,
      maxQi: nextMaxQi,
      innerDemon: Math.max(0, player.innerDemon - 5),
      updatedAt: new Date(),
    })
    .where(eq(players.userId, session.user.id));
  
  return { success: true, nextLevel };
}

// 大境界突破
export async function rankBreakthrough() {
  const session = await auth();
  if (!session?.user?.id) return { success: false };
  
  const [player] = await db
    .select()
    .from(players)
    .where(eq(players.userId, session.user.id))
    .limit(1);
  
  if (!player) return { success: false };
  
  const ranks = Object.keys(RANK_CONFIG);
  const currentIndex = ranks.indexOf(player.rank);
  const nextRank = ranks[currentIndex + 1] || 'IMMORTAL';
  const nextMaxQi = calculateMaxQi(nextRank, 1);
  
  await db
    .update(players)
    .set({
      rank: nextRank,
      level: 1,
      qi: 0,
      maxQi: nextMaxQi,
      innerDemon: Math.max(0, player.innerDemon - 30),
      updatedAt: new Date(),
    })
    .where(eq(players.userId, session.user.id));
  
  return { success: true, nextRank };
}
```

---

## 🤖 AI集成方案

### Server Actions + Streaming

```typescript
// app/actions/ai.ts
'use server';

import { google } from '@ai-sdk/google';
import { generateText, generateObject, streamText } from 'ai';
import { createStreamableValue } from 'ai/rsc';
import { z } from 'zod';
import { auth } from '@/lib/auth/auth';

// 灵根评价
export async function generateSpiritRootFeedback(chaosScore: number) {
  await auth(); // 确保已认证
  
  const { text } = await generateText({
    model: google('gemini-2.0-flash-001'),
    temperature: 0.8,
    maxTokens: 100,
    prompt: `评价灵根混沌度${chaosScore}...`,
  });
  
  return text;
}

// 天劫题目生成
export async function generateTribulationQuiz(rankLabel: string) {
  await auth();
  
  const { object } = await generateObject({
    model: google('gemini-2.0-flash-001'),
    temperature: 0.7,
    schema: z.object({
      questions: z.array(
        z.object({
          question: z.string(),
          options: z.array(z.string()).length(4),
          correctIndex: z.number().min(0).max(3),
        })
      ).length(3)
    }),
    prompt: `生成3道${rankLabel}境界的天劫题目...`,
  });
  
  return object.questions;
}

// 流式任务生成
export async function streamDailyTasks(rankLabel: string) {
  await auth();
  
  const stream = createStreamableValue();
  
  (async () => {
    const { textStream } = await streamText({
      model: google('gemini-2.0-flash-001'),
      prompt: `生成4个${rankLabel}的摸鱼任务...`,
    });
    
    for await (const delta of textStream) {
      stream.update(delta);
    }
    
    stream.done();
  })();
  
  return { output: stream.value };
}
```

---

## 📦 完整依赖配置

```json
{
  "name": "xiuxian-nextjs",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "db:generate": "drizzle-kit generate",
    "db:push": "drizzle-kit push",
    "db:studio": "drizzle-kit studio"
  },
  "dependencies": {
    "next": "^15.1.8",
    "react": "^19.2.0",
    "react-dom": "^19.2.0",
    
    "next-auth": "^5.0.0-beta.25",
    "@auth/drizzle-adapter": "^2.0.0",
    
    "drizzle-orm": "^0.38.0",
    "@vercel/postgres": "^0.10.0",
    "postgres": "^3.4.4",
    
    "ai": "^6.0.0",
    "@ai-sdk/google": "^1.0.0",
    "@ai-sdk/react": "^1.0.0",
    "zod": "^3.22.4",
    
    "zustand": "^5.0.8",
    "@tanstack/react-query": "^5.59.0",
    
    "lucide-react": "^0.553.0",
    "clsx": "^2.1.1",
    "tailwind-merge": "^2.5.2",
    
    "d3": "^7.9.0",
    "@types/d3": "^7.4.3"
  },
  "devDependencies": {
    "typescript": "^5.8.2",
    "@types/node": "^22.14.0",
    "@types/react": "^19.0.2",
    "@types/react-dom": "^19.0.2",
    
    "drizzle-kit": "^0.30.0",
    
    "tailwindcss": "^4.0.0",
    "postcss": "^8.4.47",
    "autoprefixer": "^10.4.20",
    
    "eslint": "^9.16.0",
    "eslint-config-next": "^15.1.8"
  }
}
```

---

## 🚀 部署方案

### Vercel部署

1. **数据库**: Vercel Postgres
2. **认证**: NextAuth.js + OAuth
3. **AI**: Vercel AI SDK + Gemini API
4. **CDN**: Vercel Edge Network

### 环境变量

```bash
# Database
POSTGRES_URL="postgresql://..."
POSTGRES_PRISMA_URL="postgresql://..."
POSTGRES_URL_NO_SSL="postgresql://..."
POSTGRES_URL_NON_POOLING="postgresql://..."

# Auth
NEXTAUTH_SECRET="your-secret"
NEXTAUTH_URL="https://yourdomain.com"

# OAuth Providers
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."
GITHUB_CLIENT_ID="..."
GITHUB_CLIENT_SECRET="..."

# AI
GOOGLE_GENERATIVE_AI_API_KEY="..."
```

---

## 📋 迁移步骤总结

### Phase 1: 基础设施 (Week 1)
1. 创建Next.js项目
2. 配置数据库 (Vercel Postgres + Drizzle)
3. 设置NextAuth.js认证
4. 部署到Vercel

### Phase 2: 数据迁移 (Week 2)
1. 设计数据库Schema
2. 迁移游戏数据结构
3. 实现Server Actions API
4. 数据同步逻辑

### Phase 3: 功能实现 (Week 3-4)
1. 实现用户注册/登录
2. 迁移游戏核心逻辑
3. 集成Vercel AI SDK
4. 实现排行榜系统

### Phase 4: 测试优化 (Week 5)
1. 功能测试
2. 性能优化
3. 安全加固
4. 正式发布

---

**完整代码实现请查看项目源码**