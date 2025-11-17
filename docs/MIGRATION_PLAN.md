# 目录结构迁移计划

> 从当前结构迁移到优化后的架构  
> 预计时间: 2-3小时  
> 风险等级: 🟡 中等

## 📊 迁移概览

### 当前结构 vs 目标结构

```
当前 (Vite + React)              →  目标 (Next.js 15 App Router)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

components/                     →  app/(game)/*/page.tsx
  ├── cave/                     →  + app/(game)/cave/
  ├── dashboard/                →  + app/(game)/dashboard/
  ├── inventory/                →  + app/(game)/inventory/
  ├── tasks/                    →  + app/(game)/tasks/
  └── ...                       

                                →  features/ (新增)
                                   ├── player/
                                   ├── tasks/
                                   ├── cultivation/
                                   └── ...

services/geminiService.ts       →  lib/ai/client.ts
store/useGameStore.ts           →  stores/game-store.ts
data/constants.ts               →  config/game.ts
lib/db/schema.ts               →  ❌ 删除 (使用Prisma)
drizzle.config.ts              →  ❌ 删除

components/ui/                  →  components/ui/ (保留)
                                →  components/game/ (新增)
                                →  components/layout/ (新增)
```

## 🎯 迁移策略

### Phase 1: 创建新目录结构 ✅
> 时间: 30分钟  
> 风险: 🟢 低

#### 1.1 创建核心目录

```bash
# 创建 features 目录结构
mkdir -p features/{player,tasks,cultivation,inventory,cave,sect,tribulation,leaderboard}

# 为每个feature创建标准文件
for dir in features/*; do
  touch $dir/{actions,queries,schemas,types,utils}.ts
done

# 创建 lib 子目录
mkdir -p lib/{auth,db,ai/{generators},game,utils}

# 创建 AI 生成器
touch lib/ai/generators/{task,story,name}-generator.ts

# 创建 hooks 目录
mkdir -p hooks
touch hooks/{use-player,use-tasks,use-inventory,use-debounce,use-local-storage,use-media-query}.ts

# 创建 stores 目录
mkdir -p stores
touch stores/{game-store,ui-store,cache-store}.ts

# 创建 config 目录
mkdir -p config
touch config/{site,game,navigation,features}.ts

# 创建 types 目录
mkdir -p types
touch types/{game,api,env.d}.ts

# 创建组件子目录
mkdir -p components/{game,layout,providers}

# 创建文档目录
mkdir -p docs
```

#### 1.2 创建 App Router 结构

```bash
# 认证路由组
mkdir -p app/\(auth\)/{login,register}
touch app/\(auth\)/login/page.tsx
touch app/\(auth\)/register/page.tsx

# 游戏路由组
mkdir -p app/\(game\)/{dashboard,tasks,cultivation,cave,inventory,sect,tribulation,leaderboard}

# 为每个路由创建页面和私有组件目录
for route in dashboard tasks cultivation cave inventory sect tribulation leaderboard; do
  touch app/\(game\)/$route/page.tsx
  mkdir -p app/\(game\)/$route/_components
done

# 创建游戏布局
touch app/\(game\)/layout.tsx

# API路由
mkdir -p app/api/webhooks/stripe
touch app/api/webhooks/stripe/route.ts
```

### Phase 2: 迁移核心库代码 🔄
> 时间: 45分钟  
> 风险: 🟡 中等

#### 2.1 迁移认证系统
```bash
# lib/auth/ 已存在,只需重命名
# lib/auth/auth.ts → 保持不变
# 添加新文件
touch lib/auth/{guards,utils}.ts
```

**操作清单**:
- [x] `lib/auth/auth.ts` 已存在
- [ ] 创建 `lib/auth/guards.ts` - 权限守卫函数
- [ ] 创建 `lib/auth/utils.ts` - 认证工具函数

#### 2.2 迁移数据库层
```bash
# lib/db/ 已存在
# lib/db/prisma.ts → 保持不变
# 删除旧的 Drizzle 文件
rm lib/db/schema.ts
rm drizzle.config.ts

# 添加新文件
touch lib/db/seed.ts
mkdir -p lib/db/migrations
```

**操作清单**:
- [x] `lib/db/prisma.ts` 已存在
- [ ] 删除 `lib/db/schema.ts` (Drizzle)
- [ ] 删除 `drizzle.config.ts`
- [ ] 创建 `lib/db/seed.ts` - 数据种子脚本

#### 2.3 重构 AI 服务
```bash
# services/geminiService.ts → lib/ai/
mv services/geminiService.ts lib/ai/client.ts

# 创建新的 AI 模块
touch lib/ai/{prompts,types}.ts
touch lib/ai/generators/{task,story,name}-generator.ts
```

**重构要点**:
```typescript
// 旧: services/geminiService.ts
export class GeminiService {
  async generate(prompt: string) { ... }
}

// 新: lib/ai/client.ts
import { google } from '@ai-sdk/google'
import { streamText } from 'ai'

export async function generateText(prompt: string) {
  return await streamText({
    model: google('gemini-2.0-flash-exp'),
    prompt
  })
}

// 新: lib/ai/generators/task-generator.ts
export async function generateTask(context: TaskContext) {
  const prompt = buildTaskPrompt(context)
  return await generateText(prompt)
}
```

#### 2.4 迁移游戏逻辑
```bash
# data/constants.ts → config/game.ts + lib/game/
# 常量 → config/game.ts
# 计算逻辑 → lib/game/formulas.ts
# 验证逻辑 → lib/game/validators.ts

touch lib/game/{constants,formulas,random,validators}.ts
```

**拆分策略**:
```typescript
// 配置常量 → config/game.ts
export const GAME_CONFIG = {
  MAX_LEVEL: 100,
  REALMS: [...],
  SPIRIT_ROOTS: [...]
}

// 计算公式 → lib/game/formulas.ts
export function calculateExperience(level: number): number { ... }

// 随机算法 → lib/game/random.ts
export function randomSpiritRoot(): SpiritRoot { ... }

// 业务验证 → lib/game/validators.ts
export function canLevelUp(player: Player): boolean { ... }
```

### Phase 3: 创建 Features 模块 🆕
> 时间: 60分钟  
> 风险: 🟢 低 (新建代码)

#### 3.1 Player Feature

```typescript
// features/player/types.ts
export type PlayerStats = {
  health: number
  mana: number
  attack: number
  defense: number
}

// features/player/schemas.ts
import { z } from 'zod'

export const updatePlayerSchema = z.object({
  name: z.string().min(2).max(20),
  realm: z.enum(['LIANQI', 'ZHUJI', 'JINDAN', ...])
})

// features/player/queries.ts
import { prisma } from '@/lib/db/prisma'

export async function getPlayer(userId: string) {
  return await prisma.player.findUnique({
    where: { userId },
    include: { user: true }
  })
}

// features/player/actions.ts
'use server'
import { auth } from '@/lib/auth/auth'
import { updatePlayerSchema } from './schemas'

export async function updatePlayer(data: unknown) {
  const session = await auth()
  if (!session) throw new Error('Unauthorized')
  
  const validated = updatePlayerSchema.parse(data)
  
  return await prisma.player.update({
    where: { userId: session.user.id },
    data: validated
  })
}
```

#### 3.2 Tasks Feature

```typescript
// features/tasks/types.ts
export type Task = {
  id: string
  title: string
  description: string
  type: 'DAILY' | 'WEEKLY' | 'ACHIEVEMENT'
  difficulty: 'EASY' | 'MEDIUM' | 'HARD'
  rewards: TaskRewards
  status: 'IN_PROGRESS' | 'COMPLETED' | 'FAILED'
}

// features/tasks/schemas.ts
export const createTaskSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().max(500),
  type: z.enum(['DAILY', 'WEEKLY', 'ACHIEVEMENT']),
  difficulty: z.enum(['EASY', 'MEDIUM', 'HARD'])
})

// features/tasks/queries.ts
export async function getPlayerTasks(userId: string) {
  return await prisma.task.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' }
  })
}

// features/tasks/actions.ts
'use server'
export async function createTask(data: unknown) {
  const session = await auth()
  if (!session) throw new Error('Unauthorized')
  
  const validated = createTaskSchema.parse(data)
  
  return await prisma.task.create({
    data: {
      ...validated,
      userId: session.user.id
    }
  })
}

export async function completeTask(taskId: string) {
  const session = await auth()
  if (!session) throw new Error('Unauthorized')
  
  // 验证任务所属
  const task = await prisma.task.findUnique({ where: { id: taskId } })
  if (task.userId !== session.user.id) {
    throw new Error('Forbidden')
  }
  
  // 更新任务
  const completed = await prisma.task.update({
    where: { id: taskId },
    data: { 
      status: 'COMPLETED', 
      completedAt: new Date() 
    }
  })
  
  // 奖励玩家
  await grantRewards(session.user.id, task.rewards)
  
  return completed
}

// features/tasks/ai-generator.ts
import { generateText } from '@/lib/ai/client'

export async function generateTaskFromContext(context: string) {
  const prompt = `基于以下上下文生成一个修仙任务:\n${context}`
  const result = await generateText(prompt)
  return result
}
```

#### 3.3 其他 Features (模板)

为每个领域创建相同结构:
- `cultivation/` - 修炼系统
- `inventory/` - 背包系统
- `cave/` - 洞府系统
- `sect/` - 门派系统
- `tribulation/` - 渡劫系统
- `leaderboard/` - 排行榜系统

### Phase 4: 迁移 UI 组件 🎨
> 时间: 45分钟  
> 风险: 🟡 中等

#### 4.1 拆分组件类型

```bash
# 1. 基础 UI 组件保留在 components/ui/
# 已存在: Button, Card, Badge, Modal, PageHeader, Shared

# 2. 创建游戏专用组件
mkdir -p components/game
touch components/game/{RealmBadge,ExperienceBar,CurrencyDisplay,SpiritRootIcon,StatDisplay}.tsx

# 3. 创建布局组件
mkdir -p components/layout
touch components/layout/{Header,Sidebar,Footer,MobileNav}.tsx

# 4. 创建 Providers
mkdir -p components/providers
touch components/providers/{QueryProvider,ThemeProvider,AuthProvider}.tsx
```

#### 4.2 组件迁移清单

**保留位置** (components/ui/):
- [x] Button.tsx
- [x] Card.tsx
- [x] Badge.tsx
- [x] Modal.tsx
- [x] PageHeader.tsx
- [x] Shared.tsx

**迁移到页面私有组件** (app/(game)/*/\_components/):
- [ ] `components/cave/` → `app/(game)/cave/_components/`
- [ ] `components/dashboard/` → `app/(game)/dashboard/_components/`
- [ ] `components/inventory/` → `app/(game)/inventory/_components/`
- [ ] `components/onboarding/` → `app/(game)/dashboard/_components/` (首次登录)
- [ ] `components/sect/` → `app/(game)/sect/_components/`
- [ ] `components/tasks/` → `app/(game)/tasks/_components/`
- [ ] `components/tribulation/` → `app/(game)/tribulation/_components/`

**创建新的共享游戏组件** (components/game/):
- [ ] RealmBadge.tsx - 显示境界徽章
- [ ] ExperienceBar.tsx - 经验进度条
- [ ] CurrencyDisplay.tsx - 货币显示
- [ ] SpiritRootIcon.tsx - 灵根图标
- [ ] StatDisplay.tsx - 属性面板

#### 4.3 Server vs Client Components

**Server Components** (默认):
```typescript
// app/(game)/dashboard/page.tsx
import { auth } from '@/lib/auth/auth'
import { getPlayer } from '@/features/player/queries'

export default async function DashboardPage() {
  const session = await auth()
  const player = await getPlayer(session.user.id)
  
  return <DashboardView player={player} />
}
```

**Client Components** (需要交互):
```typescript
// app/(game)/dashboard/_components/StatsCard.tsx
'use client'
import { useState } from 'react'

export function StatsCard({ stats }) {
  const [expanded, setExpanded] = useState(false)
  
  return (
    <div onClick={() => setExpanded(!expanded)}>
      {/* ... */}
    </div>
  )
}
```

### Phase 5: 创建页面路由 📄
> 时间: 30分钟  
> 风险: 🟢 低

#### 5.1 认证页面

```typescript
// app/(auth)/login/page.tsx
import { AuthForm } from './_components/AuthForm'

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <AuthForm />
    </div>
  )
}

// app/(auth)/login/_components/AuthForm.tsx
'use client'
import { signIn } from 'next-auth/react'
import { Button } from '@/components/ui/button'

export function AuthForm() {
  return (
    <div className="space-y-4">
      <Button onClick={() => signIn('google')}>
        使用 Google 登录
      </Button>
      <Button onClick={() => signIn('github')}>
        使用 GitHub 登录
      </Button>
    </div>
  )
}
```

#### 5.2 游戏主布局

```typescript
// app/(game)/layout.tsx
import { Header } from '@/components/layout/Header'
import { Sidebar } from '@/components/layout/Sidebar'
import { auth } from '@/lib/auth/auth'
import { redirect } from 'next/navigation'

export default async function GameLayout({ children }) {
  const session = await auth()
  if (!session) redirect('/login')
  
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1">
        <Header />
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
```

#### 5.3 核心页面骨架

```typescript
// app/(game)/dashboard/page.tsx
import { auth } from '@/lib/auth/auth'
import { getPlayer } from '@/features/player/queries'
import { StatsCard } from './_components/StatsCard'
import { RealmProgress } from './_components/RealmProgress'

export default async function DashboardPage() {
  const session = await auth()
  const player = await getPlayer(session.user.id)
  
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">修炼仪表盘</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatsCard stats={player.stats} />
        <RealmProgress player={player} />
      </div>
    </div>
  )
}

// app/(game)/tasks/page.tsx
import { auth } from '@/lib/auth/auth'
import { getPlayerTasks } from '@/features/tasks/queries'
import { TaskCard } from './_components/TaskCard'

export default async function TasksPage() {
  const session = await auth()
  const tasks = await getPlayerTasks(session.user.id)
  
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">任务大厅</h1>
      <div className="grid gap-4">
        {tasks.map(task => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
    </div>
  )
}
```

### Phase 6: 清理与优化 🧹
> 时间: 20分钟  
> 风险: 🟢 低

#### 6.1 删除旧文件

```bash
# 删除旧的构建配置
rm vite.config.ts
rm index.html
rm index.tsx
rm App.tsx

# 删除旧的 ORM 配置
rm drizzle.config.ts
rm lib/db/schema.ts

# 删除旧的服务文件
rm -rf services/

# 删除旧的组件目录 (迁移完成后)
# rm -rf components/cave components/dashboard ...
# 建议: 先注释掉,确认无误后再删除
```

#### 6.2 更新 imports

使用 VS Code 的查找替换功能:

```
查找: from '@/components/tasks/TaskCard'
替换: from '@/app/(game)/tasks/_components/TaskCard'

查找: from '@/services/geminiService'
替换: from '@/lib/ai/client'

查找: from '@/store/useGameStore'
替换: from '@/stores/game-store'

查找: from '@/data/constants'
替换: from '@/config/game'
```

#### 6.3 代码质量检查

```bash
# 运行 TypeScript 检查
pnpm tsc --noEmit

# 运行 ESLint
pnpm lint

# 格式化代码
pnpm format  # 如果配置了 Prettier
```

## 📋 迁移检查清单

### 目录结构
- [ ] 创建 `features/` 目录及子模块
- [ ] 创建 `app/(auth)/` 路由组
- [ ] 创建 `app/(game)/` 路由组
- [ ] 创建 `lib/ai/` 目录
- [ ] 创建 `hooks/` 目录
- [ ] 创建 `stores/` 目录
- [ ] 创建 `config/` 目录
- [ ] 创建 `types/` 目录
- [ ] 重组 `components/` 目录

### 代码迁移
- [ ] 迁移认证系统
- [ ] 迁移数据库层
- [ ] 重构 AI 服务
- [ ] 拆分游戏逻辑
- [ ] 创建 Player Feature
- [ ] 创建 Tasks Feature
- [ ] 创建其他 Features
- [ ] 迁移 UI 组件
- [ ] 创建页面路由
- [ ] 创建布局组件

### 代码清理
- [ ] 删除旧的 Vite 配置
- [ ] 删除旧的 Drizzle 配置
- [ ] 更新所有 imports
- [ ] 运行类型检查
- [ ] 运行 linter
- [ ] 测试核心功能

### 测试验证
- [ ] 用户可以登录
- [ ] Dashboard 正常显示
- [ ] 任务列表加载正常
- [ ] Server Actions 工作正常
- [ ] AI 生成功能正常
- [ ] 页面路由正确
- [ ] 权限验证生效

## 🚨 风险管理

### 高风险操作
1. **删除旧文件**: 建议先备份或注释
2. **批量 import 更新**: 先测试小范围,再全局应用
3. **组件重构**: 可能影响现有功能,需逐个测试

### 回滚方案
```bash
# 1. Git 创建迁移分支
git checkout -b migration/new-architecture
git add .
git commit -m "checkpoint: before migration"

# 2. 每完成一个 Phase,创建一个 commit
git commit -m "feat: complete phase 1 - directory structure"

# 3. 如需回滚
git revert HEAD~3  # 回滚最近 3 个提交
```

### 建议时间表

| Phase | 任务 | 预计时间 | 累计时间 |
|-------|------|---------|---------|
| 1 | 创建目录结构 | 30分钟 | 0.5小时 |
| 2 | 迁移核心库 | 45分钟 | 1.25小时 |
| 3 | 创建 Features | 60分钟 | 2.25小时 |
| 4 | 迁移 UI 组件 | 45分钟 | 3小时 |
| 5 | 创建页面路由 | 30分钟 | 3.5小时 |
| 6 | 清理与优化 | 20分钟 | 3.7小时 |
| - | **总计** | **3.7小时** | - |

## 🎯 下一步行动

1. **立即执行** Phase 1: 创建新目录结构 (30分钟)
2. **并行工作**: 可以同时进行 Phase 2 和 Phase 3
3. **测试驱动**: 每完成一个 Phase,运行测试
4. **增量迁移**: 不要一次性完成所有迁移
5. **保持可用**: 确保每个阶段代码都可运行

---

**迁移状态**: 🟡 等待执行  
**预计完成**: 3-4小时  
**建议策略**: 分阶段执行,每阶段测试