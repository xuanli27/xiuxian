# 🛠️ 摸鱼修仙录 - 技术实施指南

## 📋 目录

1. [环境准备](#环境准备)
2. [项目初始化](#项目初始化)
3. [数据库配置](#数据库配置)
4. [认证系统实现](#认证系统实现)
5. [核心功能迁移](#核心功能迁移)
6. [AI服务集成](#ai服务集成)
7. [测试与部署](#测试与部署)

---

## 🚀 环境准备

### 必需工具

```bash
# Node.js (建议 v20+)
node --version  # v20.11.0+

# pnpm (推荐包管理器)
npm install -g pnpm

# Vercel CLI
npm install -g vercel

# 数据库工具
npm install -g drizzle-kit
```

### 账号准备

- ✅ [Vercel账号](https://vercel.com)
- ✅ [Google Cloud Platform](https://console.cloud.google.com) (Gemini API)
- ✅ [GitHub账号](https://github.com) (OAuth + CI/CD)
- ✅ [Google OAuth应用](https://console.cloud.google.com) (可选)

---

## 📦 项目初始化

### Step 1: 创建Next.js 15项目

```bash
# 使用官方模板创建项目
npx create-next-app@latest xiuxian-nextjs --typescript --tailwind --app --use-pnpm

cd xiuxian-nextjs
```

### Step 2: 安装核心依赖

```bash
# 认证
pnpm add next-auth@beta @auth/drizzle-adapter

# 数据库
pnpm add drizzle-orm @vercel/postgres postgres
pnpm add -D drizzle-kit

# AI
pnpm add ai @ai-sdk/google zod

# 状态管理
pnpm add zustand @tanstack/react-query

# UI组件
pnpm add lucide-react clsx tailwind-merge

# 工具库
pnpm add d3 @types/d3
```

### Step 3: 目录结构初始化

```bash
mkdir -p app/\(auth\)/login app/\(auth\)/register
mkdir -p app/\(game\)/dashboard app/\(game\)/tasks
mkdir -p app/actions app/api/auth/[...nextauth]
mkdir -p lib/auth lib/db lib/ai lib/game
mkdir -p components/auth components/ui
mkdir -p types hooks
```

---

## 🗄️ 数据库配置

### Step 1: 配置Vercel Postgres

```bash
# 登录Vercel
vercel login

# 链接项目
vercel link

# 创建Postgres数据库
vercel postgres create xiuxian-db
```

### Step 2: 配置环境变量

创建 `.env.local`:

```bash
# Database
POSTGRES_URL="postgresql://..."
POSTGRES_PRISMA_URL="postgresql://..."
POSTGRES_URL_NO_SSL="postgresql://..."
POSTGRES_URL_NON_POOLING="postgresql://..."

# Auth
NEXTAUTH_SECRET="your-secret-here"
NEXTAUTH_URL="http://localhost:3000"

# Google OAuth (可选)
GOOGLE_CLIENT_ID="your-client-id"
GOOGLE_CLIENT_SECRET="your-client-secret"

# AI
GOOGLE_GENERATIVE_AI_API_KEY="your-gemini-api-key"
```

### Step 3: 创建Drizzle配置

创建 `drizzle.config.ts`:

```typescript
import type { Config } from 'drizzle-kit';

export default {
  schema: './lib/db/schema.ts',
  out: './lib/db/migrations',
  driver: 'pg',
  dbCredentials: {
    connectionString: process.env.POSTGRES_URL!,
  },
} satisfies Config;
```

### Step 4: 定义数据库Schema

创建 [`lib/db/schema.ts`](lib/db/schema.ts:1):

```typescript
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

// 玩家表
export const players = pgTable('players', {
  id: serial('id').primaryKey(),
  userId: varchar('user_id', { length: 255 }).unique().notNull().references(() => users.id, { onDelete: 'cascade' }),
  
  name: varchar('name', { length: 100 }).notNull(),
  rank: varchar('rank', { length: 50 }).notNull().default('MORTAL'),
  level: integer('level').notNull().default(1),
  qi: integer('qi').notNull().default(0),
  maxQi: integer('max_qi').notNull().default(100),
  
  inventory: jsonb('inventory').notNull().default({}),
  equipped: jsonb('equipped').notNull().default({}),
  
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => {
  return {
    userIdIdx: index('player_user_id_idx').on(table.userId),
    rankIdx: index('player_rank_idx').on(table.rank),
  };
});

// ... 其他表定义
```

### Step 5: 生成并推送迁移

```bash
# 生成迁移文件
pnpm drizzle-kit generate

# 推送到数据库
pnpm drizzle-kit push

# 查看数据库
pnpm drizzle-kit studio
```

### Step 6: 创建Drizzle Client

创建 [`lib/db/index.ts`](lib/db/index.ts:1):

```typescript
import { drizzle } from 'drizzle-orm/vercel-postgres';
import { sql } from '@vercel/postgres';
import * as schema from './schema';

export const db = drizzle(sql, { schema });
```

---

## 🔐 认证系统实现

### Step 1: 配置NextAuth.js

创建 [`lib/auth/auth.ts`](lib/auth/auth.ts:1):

```typescript
import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import { DrizzleAdapter } from '@auth/drizzle-adapter';
import { db } from '@/lib/db';

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(db),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
      }
      return session;
    },
  },
  session: {
    strategy: 'database',
  },
});
```

### Step 2: 创建API路由

创建 [`app/api/auth/[...nextauth]/route.ts`](app/api/auth/[...nextauth]/route.ts:1):

```typescript
import { handlers } from '@/lib/auth/auth';

export const { GET, POST } = handlers;
```

### Step 3: 创建中间件

创建 [`middleware.ts`](middleware.ts:1):

```typescript
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
  
  return NextResponse.next();
});

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
```

### Step 4: 创建登录页面

创建 [`app/(auth)/login/page.tsx`](app/(auth)/login/page.tsx:1):

```typescript
import { signIn } from '@/lib/auth/auth';
import { Button } from '@/components/ui/Button';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md space-y-8 p-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold">摸鱼修仙录</h1>
          <p className="mt-2 text-gray-600">欢迎来到打工仙途</p>
        </div>
        
        <form
          action={async () => {
            'use server';
            await signIn('google', { redirectTo: '/dashboard' });
          }}
        >
          <Button type="submit" className="w-full">
            使用Google登录
          </Button>
        </form>
      </div>
    </div>
  );
}
```

---

## 🎮 核心功能迁移

### Step 1: 创建玩家数据Server Actions

创建 [`app/actions/player.ts`](app/actions/player.ts:1):

```typescript
'use server';

import { auth } from '@/lib/auth/auth';
import { db } from '@/lib/db';
import { players } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

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
  
  if (!player) {
    // 创建新玩家
    const [newPlayer] = await db
      .insert(players)
      .values({
        userId: session.user.id,
        name: session.user.name || '打工人',
      })
      .returning();
    
    return newPlayer;
  }
  
  return player;
}

export async function updatePlayerQi(qi: number) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }
  
  const [updated] = await db
    .update(players)
    .set({ qi, updatedAt: new Date() })
    .where(eq(players.userId, session.user.id))
    .returning();
  
  revalidatePath('/dashboard');
  return updated;
}
```

### Step 2: 创建游戏逻辑Actions

创建 [`app/actions/game.ts`](app/actions/game.ts:1):

```typescript
'use server';

import { auth } from '@/lib/auth/auth';
import { db } from '@/lib/db';
import { players } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function minorBreakthrough() {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: 'Unauthorized' };
  }
  
  const [player] = await db
    .select()
    .from(players)
    .where(eq(players.userId, session.user.id))
    .limit(1);
  
  if (!player) {
    return { success: false, error: 'Player not found' };
  }
  
  if (player.qi < player.maxQi) {
    return { success: false, error: '灵气不足' };
  }
  
  const nextLevel = player.level + 1;
  const nextMaxQi = Math.floor(player.maxQi * 1.2);
  
  await db
    .update(players)
    .set({
      level: nextLevel,
      qi: 0,
      maxQi: nextMaxQi,
      updatedAt: new Date(),
    })
    .where(eq(players.userId, session.user.id));
  
  revalidatePath('/dashboard');
  return { success: true, nextLevel };
}
```

### Step 3: 创建Dashboard页面

创建 [`app/(game)/dashboard/page.tsx`](app/(game)/dashboard/page.tsx:1):

```typescript
import { getPlayerData } from '@/app/actions/player';
import { SpiritCoreVisualizer } from '@/components/dashboard/SpiritCoreVisualizer';
import { PlayerStats } from '@/components/dashboard/PlayerStats';

export default async function DashboardPage() {
  const player = await getPlayerData();
  
  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">工位修炼</h1>
      
      <div className="grid gap-6 md:grid-cols-2">
        <SpiritCoreVisualizer player={player} />
        <PlayerStats player={player} />
      </div>
    </div>
  );
}
```

---

## 🤖 AI服务集成

### Step 1: 配置Gemini Provider

创建 [`lib/ai/gemini.ts`](lib/ai/gemini.ts:1):

```typescript
import { google } from '@ai-sdk/google';

export const geminiFlash = google('gemini-2.0-flash-001');

export const geminiPro = google('gemini-1.5-pro-002');
```

### Step 2: 创建AI Server Actions

创建 [`app/actions/ai.ts`](app/actions/ai.ts:1):

```typescript
'use server';

import { generateText, generateObject, streamText } from 'ai';
import { createStreamableValue } from 'ai/rsc';
import { geminiFlash } from '@/lib/ai/gemini';
import { z } from 'zod';
import { auth } from '@/lib/auth/auth';

export async function generateSpiritRootFeedback(chaosScore: number) {
  await auth();
  
  const { text } = await generateText({
    model: geminiFlash,
    temperature: 0.8,
    maxTokens: 100,
    prompt: `
      用户灵根混沌度: ${chaosScore}/100
      作为修仙宗门HR给出毒舌评价(30字内,简体中文)
    `,
  });
  
  return text;
}

export async function generateTribulationQuiz(rankLabel: string) {
  await auth();
  
  const { object } = await generateObject({
    model: geminiFlash,
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
    prompt: `为${rankLabel}生成3道职场天劫选择题(简体中文)`,
  });
  
  return object.questions;
}

export async function streamDailyTasks(rankLabel: string) {
  await auth();
  
  const stream = createStreamableValue('');
  
  (async () => {
    const { textStream } = await streamText({
      model: geminiFlash,
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

### Step 3: 在组件中使用AI

```typescript
'use client';

import { useState } from 'react';
import { generateSpiritRootFeedback } from '@/app/actions/ai';
import { Button } from '@/components/ui/Button';

export function SpiritRootTest() {
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);
  
  async function handleTest() {
    setLoading(true);
    const chaosScore = Math.random() * 100;
    const result = await generateSpiritRootFeedback(chaosScore);
    setFeedback(result);
    setLoading(false);
  }
  
  return (
    <div>
      <Button onClick={handleTest} disabled={loading}>
        {loading ? '测试中...' : '测试灵根'}
      </Button>
      {feedback && <p className="mt-4">{feedback}</p>}
    </div>
  );
}
```

---

## 📊 状态管理

### Zustand Store配置

创建 [`store/useGameStore.ts`](store/useGameStore.ts:1):

```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface GameState {
  theme: 'light' | 'dark';
  soundEnabled: boolean;
  setTheme: (theme: 'light' | 'dark') => void;
  toggleSound: () => void;
}

export const useGameStore = create<GameState>()(
  persist(
    (set) => ({
      theme: 'dark',
      soundEnabled: true,
      setTheme: (theme) => set({ theme }),
      toggleSound: () => set((state) => ({ soundEnabled: !state.soundEnabled })),
    }),
    {
      name: 'game-settings',
    }
  )
);
```

---

## 🧪 测试与部署

### Step 1: 本地测试

```bash
# 开发服务器
pnpm dev

# 构建测试
pnpm build

# 生产模式运行
pnpm start
```

### Step 2: 部署到Vercel

```bash
# 首次部署
vercel

# 生产部署
vercel --prod
```

### Step 3: 配置环境变量

在Vercel Dashboard中配置所有环境变量:
- Database连接字符串
- NextAuth配置
- OAuth凭据
- AI API密钥

### Step 4: 设置自动部署

1. 连接GitHub仓库
2. 配置自动部署分支
3. 启用预览部署

---

## 🔧 常见问题排查

### 数据库连接失败

```bash
# 检查连接字符串
echo $POSTGRES_URL

# 测试连接
pnpm drizzle-kit studio
```

### NextAuth配置问题

```bash
# 检查环境变量
echo $NEXTAUTH_SECRET
echo $NEXTAUTH_URL

# 重新生成secret
openssl rand -base64 32
```

### AI API调用失败

```bash
# 检查API密钥
echo $GOOGLE_GENERATIVE_AI_API_KEY

# 测试API
curl https://generativelanguage.googleapis.com/v1/models \
  -H "x-goog-api-key: $GOOGLE_GENERATIVE_AI_API_KEY"
```

---

## 📚 参考资源

- [Next.js 15文档](https://nextjs.org/docs)
- [NextAuth.js v5文档](https://authjs.dev)
- [Drizzle ORM文档](https://orm.drizzle.team)
- [Vercel AI SDK文档](https://sdk.vercel.ai/docs)
- [Google Gemini API文档](https://ai.google.dev/docs)

---

**完成以上步骤后,您将拥有一个完整的全栈修仙游戏应用!**