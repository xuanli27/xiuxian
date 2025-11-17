# 摸鱼修仙录 - 项目梳理总结

> 最后更新: 2025-11-17

## 📋 项目基本信息

### 项目概述
- **项目名称**: 摸鱼修仙录 (Moyu Xiuxian Lu)
- **项目类型**: 修仙主题的游戏化任务管理系统
- **当前阶段**: 从 Vite + React 迁移到 Next.js 15 全栈架构
- **目标**: 构建一个融合修仙元素的AI驱动任务管理平台

### 技术栈迁移状态

#### ✅ 已完成的架构组件

**前端框架**
- ✅ Next.js 15.5.6 (App Router)
- ✅ React 19.2.0
- ✅ TypeScript 5.9.3
- ✅ Tailwind CSS 4.1.17

**AI集成 (Beta版本)**
- ✅ Vercel AI SDK 6.0.0-beta.99
- ✅ @ai-sdk/google 2.0.33
- ✅ @ai-sdk/react 2.0.93

**数据库与ORM**
- ✅ Prisma 6.19.0 (PostgreSQL)
- ✅ @prisma/client 6.19.0
- ✅ Prisma Client 已生成

**用户认证**
- ✅ NextAuth.js 5.0.0-beta.30
- ✅ @auth/prisma-adapter 2.11.1
- ✅ 支持 Google & GitHub OAuth

**状态管理**
- ✅ Zustand 5.0.8 (客户端状态)
- ✅ TanStack Query 5.90.10 (服务端状态)

**UI组件库**
- ✅ Lucide React 0.553.0 (图标)
- ✅ D3.js 7.9.0 (数据可视化)
- ✅ clsx + tailwind-merge (样式工具)

## 📁 当前项目结构

```
xiuxian/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # ✅ 根布局
│   ├── page.tsx                 # ✅ 首页(重定向)
│   ├── globals.css              # ✅ 全局样式
│   └── api/
│       └── auth/[...nextauth]/
│           └── route.ts         # ✅ NextAuth API路由
│
├── components/                   # React组件 (待迁移)
│   ├── cave/                    # 洞府系统
│   ├── dashboard/               # 仪表盘
│   ├── inventory/               # 背包系统
│   ├── layout/                  # 布局组件
│   ├── onboarding/              # 新手引导
│   ├── sect/                    # 门派系统
│   ├── tasks/                   # 任务系统
│   │   └── minigames/          # 小游戏
│   ├── tribulation/             # 渡劫系统
│   └── ui/                      # UI组件库
│
├── lib/                         # 核心库
│   ├── auth/
│   │   └── auth.ts             # ✅ NextAuth配置
│   └── db/
│       ├── prisma.ts           # ✅ Prisma Client
│       └── schema.ts           # ⚠️ 旧的Drizzle Schema (待删除)
│
├── prisma/
│   └── schema.prisma           # ✅ Prisma数据库Schema
│
├── store/
│   └── useGameStore.ts         # Zustand状态管理
│
├── services/
│   └── geminiService.ts        # AI服务 (待重构)
│
├── data/
│   └── constants.ts            # 游戏常量
│
├── next.config.ts              # ✅ Next.js配置
├── tailwind.config.ts          # ✅ Tailwind配置
├── tsconfig.json               # ✅ TypeScript配置
├── middleware.ts               # ✅ 路由保护中间件
├── .env.example                # ✅ 环境变量模板
└── package.json                # ✅ 依赖配置

✅ = 已完成  ⚠️ = 需要处理  ❌ = 待创建
```

## 🗄️ 数据库设计

### Prisma Schema 概览

**认证相关表**
```prisma
- User          # 用户基础信息
- Account       # OAuth账号关联
- Session       # 会话管理
```

**游戏相关表**
```prisma
- Player        # 玩家游戏数据
  ├── realm (修为境界)
  ├── spiritRoot (灵根类型)
  ├── experience (经验值)
  ├── currency (货币)
  └── stats (属性)
  
- Task          # 任务系统
  ├── type (任务类型)
  ├── difficulty (难度)
  ├── rewards (奖励)
  └── status (状态)
  
- Leaderboard   # 排行榜
  ├── category (类别)
  ├── rank (排名)
  └── score (分数)
```

**游戏枚举类型**
- `Rank`: 修为等级 (练气期 → 化神期)
- `SectRank`: 门派等级 (外门弟子 → 掌门)
- `SpiritRootType`: 灵根类型 (金木水火土)
- `TaskType`: 任务类型 (每日/每周/成就)
- `TaskStatus`: 任务状态 (进行中/完成/失败)
- `LeaderboardCategory`: 排行榜类别

## 🔐 认证系统架构

### NextAuth.js 配置
- **位置**: `lib/auth/auth.ts`
- **OAuth提供商**:
  - Google (CLIENT_ID + SECRET)
  - GitHub (CLIENT_ID + SECRET)
- **数据持久化**: Prisma Adapter
- **会话管理**: JWT + Database Session

### 路由保护 (Middleware)
- **保护的路由**:
  - `/dashboard/*`
  - `/tasks/*`
  - `/cave/*`
  - `/inventory/*`
  - `/sect/*`
  - `/tribulation/*`
- **未认证行为**: 重定向到 `/login`

## 📝 待办事项清单

### 🔴 高优先级 (核心功能)

1. **环境配置**
   - [ ] 创建`.env`文件(复制`.env.example`)
   - [ ] 配置PostgreSQL数据库URL
   - [ ] 配置Google/GitHub OAuth凭据
   - [ ] 配置Gemini API密钥
   - [ ] 推送数据库Schema: `pnpm db:push`

2. **Server Actions开发**
   - [ ] `app/actions/player.ts` - 玩家CRUD
   - [ ] `app/actions/game.ts` - 游戏逻辑
   - [ ] `app/actions/task.ts` - 任务管理
   - [ ] `app/actions/ai.ts` - AI集成

3. **认证页面**
   - [ ] `app/(auth)/login/page.tsx` - 登录页
   - [ ] 实现OAuth按钮组件
   - [ ] 添加登录错误处理

### 🟡 中优先级 (UI迁移)

4. **App Router结构**
   ```
   app/
   ├── (auth)/              # 认证组
   │   └── login/
   ├── (game)/              # 游戏主组
   │   ├── dashboard/
   │   ├── tasks/
   │   ├── cave/
   │   ├── inventory/
   │   ├── sect/
   │   └── tribulation/
   └── api/
   ```

5. **组件迁移**
   - [ ] 将`components/`适配到Next.js
   - [ ] 区分Client Components (`'use client'`)
   - [ ] 使用Server Components优化性能
   - [ ] 更新状态管理(集成Server Actions)

### 🟢 低优先级 (优化)

6. **AI功能重构**
   - [ ] 使用AI SDK v6 beta的新API
   - [ ] 实现流式响应
   - [ ] 集成TanStack Query

7. **代码清理**
   - [ ] 删除`drizzle.config.ts`
   - [ ] 删除`lib/db/schema.ts`
   - [ ] 移除旧的Vite配置
   - [ ] 清理未使用的依赖

## 🚀 开发命令

```bash
# 开发
pnpm dev                # 启动开发服务器

# 数据库
pnpm db:generate        # 生成Prisma Client (✅ 已完成)
pnpm db:push            # 推送Schema到数据库 (⏭️ 下一步)
pnpm db:migrate         # 创建迁移文件
pnpm db:studio          # 打开Prisma Studio

# 构建
pnpm build              # 生产构建
pnpm start              # 运行生产服务器

# 代码质量
pnpm lint               # ESLint检查
```

## 🔧 开发注意事项

### Next.js 15 特性使用

1. **App Router**
   - 默认使用Server Components
   - 交互组件需要`'use client'`指令
   - 数据获取直接在组件中异步

2. **Server Actions**
   ```typescript
   'use server'
   
   export async function createTask(data: TaskInput) {
     const session = await auth()
     if (!session) throw new Error('Unauthorized')
     
     return await prisma.task.create({ data })
   }
   ```

3. **AI SDK v6 Beta**
   ```typescript
   import { streamText } from 'ai'
   import { google } from '@ai-sdk/google'
   
   const result = await streamText({
     model: google('gemini-2.0-flash-exp'),
     prompt: 'Generate cultivation task'
   })
   ```

### 数据库使用

```typescript
// lib/db/prisma.ts已配置单例模式
import { prisma } from '@/lib/db/prisma'

// 使用示例
const player = await prisma.player.findUnique({
  where: { userId: session.user.id }
})
```

### 认证使用

```typescript
// 在Server Component中
import { auth } from '@/lib/auth/auth'

const session = await auth()
if (!session) redirect('/login')

// 在Client Component中
import { useSession } from 'next-auth/react'

const { data: session, status } = useSession()
```

## 📊 当前进度总结

### ✅ 已完成 (15/20)
1. ✅ Next.js 15项目配置
2. ✅ 所有依赖安装(包括AI SDK beta)
3. ✅ Prisma Schema设计
4. ✅ Prisma Client生成
5. ✅ NextAuth.js配置
6. ✅ 中间件路由保护
7. ✅ 基础App Router结构
8. ✅ 全局样式配置
9. ✅ TypeScript配置
10. ✅ Tailwind CSS v4配置
11. ✅ PostCSS配置
12. ✅ ESLint配置
13. ✅ .env.example模板
14. ✅ 项目文档
15. ✅ 技术栈升级完成

### 🔄 进行中 (0/20)
- 无

### ⏭️ 待开始 (5/20)
1. ⏭️ 推送数据库Schema
2. ⏭️ 创建Server Actions
3. ⏭️ 实现登录页面
4. ⏭️ 迁移UI组件
5. ⏭️ AI功能集成

## 🎯 下一步行动计划

### 立即执行
1. 创建`.env`文件并配置环境变量
2. 执行`pnpm db:push`推送数据库
3. 创建`app/actions/player.ts`
4. 创建`app/(auth)/login/page.tsx`

### 短期目标 (1-2天)
- 完成Server Actions基础CRUD
- 实现用户登录流程
- 创建Dashboard页面骨架
- 测试数据库连接和认证

### 中期目标 (1周)
- 迁移所有核心UI组件
- 集成AI SDK进行任务生成
- 实现基础游戏逻辑
- 添加单元测试

## 📌 重要提醒

### 环境变量必填项
```env
DATABASE_URL="postgresql://..."     # PostgreSQL连接URL
NEXTAUTH_SECRET="..."              # NextAuth加密密钥
NEXTAUTH_URL="http://localhost:3000"

# Google OAuth
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."

# GitHub OAuth
GITHUB_CLIENT_ID="..."
GITHUB_CLIENT_SECRET="..."

# AI Provider
GOOGLE_API_KEY="..."               # Gemini API
```

### 版本兼容性
- ⚠️ AI SDK 6.0.0-beta: Beta版本,API可能变动
- ✅ Next.js 15.5.6: 稳定版本
- ✅ React 19.2.0: 稳定版本
- ✅ Prisma 6.19.0: 稳定版本

### 待删除文件
```
❌ drizzle.config.ts       # 旧ORM配置
❌ lib/db/schema.ts        # 旧Schema定义
❌ vite.config.ts          # 旧构建配置
❌ index.html              # Vite入口文件
❌ index.tsx               # 旧React入口
```

## 📚 相关文档

- [Next.js 15文档](https://nextjs.org/docs)
- [Prisma文档](https://www.prisma.io/docs)
- [NextAuth.js v5文档](https://authjs.dev)
- [Vercel AI SDK文档](https://sdk.vercel.ai/docs)
- [Tailwind CSS v4文档](https://tailwindcss.com/docs)

---

**项目状态**: 🟡 架构迁移中 (75%完成)  
**最后检查**: 2025-11-17 19:22 CST  
**下次里程碑**: 完成数据库初始化和基础认证流程