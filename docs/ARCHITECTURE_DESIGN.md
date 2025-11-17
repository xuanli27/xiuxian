# 摸鱼修仙录 - 架构设计文档

> 版本: 2.0  
> 更新日期: 2025-11-17  
> 架构师审查: ✅

## 🎯 项目架构原则

### 设计理念
1. **领域驱动设计 (DDD)**: 按游戏业务领域组织代码
2. **关注点分离**: 清晰区分表现层、业务层、数据层
3. **可扩展性**: 支持新功能模块的快速集成
4. **类型安全**: 全栈TypeScript + Zod验证
5. **性能优先**: Server Components为主,Client Components按需

### 核心架构模式
```
┌─────────────────────────────────────────────┐
│           Client Browser                     │
├─────────────────────────────────────────────┤
│  UI Components (React Server/Client)        │
├─────────────────────────────────────────────┤
│  Server Actions / API Routes               │
├─────────────────────────────────────────────┤
│  Business Logic Layer                      │
│  ├─ Services (游戏逻辑)                    │
│  ├─ AI Integration (智能生成)              │
│  └─ Auth (认证授权)                        │
├─────────────────────────────────────────────┤
│  Data Access Layer                         │
│  ├─ Prisma ORM                            │
│  └─ Database Queries                       │
├─────────────────────────────────────────────┤
│  PostgreSQL Database                        │
└─────────────────────────────────────────────┘
```

## 📁 优化后的目录结构

```
xiuxian/
│
├── app/                              # Next.js App Router (路由+页面)
│   ├── (auth)/                       # 认证路由组 (无布局)
│   │   ├── login/
│   │   │   └── page.tsx             # 登录页
│   │   └── register/
│   │       └── page.tsx             # 注册页 (可选)
│   │
│   ├── (game)/                       # 游戏主路由组 (共享布局)
│   │   ├── layout.tsx               # 游戏主布局 (导航+侧边栏)
│   │   │
│   │   ├── dashboard/               # 📊 仪表盘 - 总览
│   │   │   ├── page.tsx            # 修炼进度、境界显示
│   │   │   └── _components/        # 页面私有组件
│   │   │       ├── StatsCard.tsx
│   │   │       ├── RealmProgress.tsx
│   │   │       └── SpiritCore.tsx
│   │   │
│   │   ├── tasks/                   # 📝 任务大厅
│   │   │   ├── page.tsx            # 任务列表
│   │   │   ├── [id]/               # 任务详情
│   │   │   │   └── page.tsx
│   │   │   └── _components/
│   │   │       ├── TaskCard.tsx
│   │   │       ├── TaskFilters.tsx
│   │   │       └── minigames/      # 小游戏组件
│   │   │
│   │   ├── cultivation/             # 🧘 修炼场 (新增)
│   │   │   ├── page.tsx            # 修炼选择
│   │   │   ├── meditation/         # 打坐修炼
│   │   │   ├── techniques/         # 功法修炼
│   │   │   └── _components/
│   │   │
│   │   ├── cave/                    # 🏠 洞府
│   │   │   ├── page.tsx            # 洞府主页
│   │   │   ├── crafting/           # 炼器炼丹
│   │   │   ├── garden/             # 灵田种植
│   │   │   └── _components/
│   │   │
│   │   ├── inventory/               # 🎒 背包
│   │   │   ├── page.tsx
│   │   │   ├── equipment/          # 装备管理
│   │   │   ├── pills/              # 丹药管理
│   │   │   └── _components/
│   │   │
│   │   ├── sect/                    # 🏛️ 门派
│   │   │   ├── page.tsx            # 门派大厅
│   │   │   ├── hall/               # 掌门大殿
│   │   │   ├── library/            # 藏经阁
│   │   │   ├── market/             # 坊市交易
│   │   │   └── _components/
│   │   │
│   │   ├── tribulation/             # ⚡ 渡劫
│   │   │   ├── page.tsx
│   │   │   └── _components/
│   │   │
│   │   └── leaderboard/             # 🏆 排行榜 (新增)
│   │       ├── page.tsx
│   │       └── _components/
│   │
│   ├── api/                          # API路由
│   │   ├── auth/
│   │   │   └── [...nextauth]/
│   │   │       └── route.ts         # NextAuth端点
│   │   └── webhooks/                # 第三方回调
│   │       └── stripe/
│   │           └── route.ts
│   │
│   ├── layout.tsx                    # 全局根布局
│   ├── page.tsx                      # 首页 (重定向/营销页)
│   ├── globals.css                   # 全局样式
│   └── error.tsx                     # 全局错误页
│
├── features/                         # 🎮 业务功能模块 (核心)
│   ├── player/                       # 玩家系统
│   │   ├── actions.ts               # Server Actions
│   │   ├── queries.ts               # 数据查询
│   │   ├── schemas.ts               # Zod验证
│   │   ├── types.ts                 # TypeScript类型
│   │   └── utils.ts                 # 工具函数
│   │
│   ├── tasks/                        # 任务系统
│   │   ├── actions.ts               # 创建/更新/完成任务
│   │   ├── queries.ts
│   │   ├── schemas.ts
│   │   ├── types.ts
│   │   └── ai-generator.ts          # AI任务生成
│   │
│   ├── cultivation/                  # 修炼系统
│   │   ├── actions.ts               # 修炼相关操作
│   │   ├── realm-calculator.ts      # 境界计算
│   │   ├── experience.ts            # 经验系统
│   │   └── types.ts
│   │
│   ├── inventory/                    # 背包系统
│   │   ├── actions.ts
│   │   ├── equipment.ts             # 装备逻辑
│   │   ├── items.ts                 # 物品管理
│   │   └── types.ts
│   │
│   ├── cave/                         # 洞府系统
│   │   ├── actions.ts
│   │   ├── crafting.ts              # 炼制系统
│   │   ├── garden.ts                # 种植系统
│   │   └── types.ts
│   │
│   ├── sect/                         # 门派系统
│   │   ├── actions.ts
│   │   ├── ranks.ts                 # 等级系统
│   │   ├── missions.ts              # 门派任务
│   │   └── types.ts
│   │
│   ├── tribulation/                  # 渡劫系统
│   │   ├── actions.ts
│   │   ├── challenges.ts            # 劫难挑战
│   │   └── types.ts
│   │
│   └── leaderboard/                  # 排行榜系统
│       ├── actions.ts
│       ├── queries.ts
│       └── types.ts
│
├── components/                       # 🧩 共享UI组件
│   ├── ui/                          # 基础UI组件 (Design System)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── modal.tsx
│   │   ├── badge.tsx
│   │   ├── progress.tsx
│   │   ├── tabs.tsx
│   │   └── index.ts
│   │
│   ├── game/                        # 游戏通用组件
│   │   ├── RealmBadge.tsx          # 境界徽章
│   │   ├── ExperienceBar.tsx       # 经验条
│   │   ├── CurrencyDisplay.tsx     # 货币显示
│   │   ├── SpiritRootIcon.tsx      # 灵根图标
│   │   └── StatDisplay.tsx         # 属性显示
│   │
│   ├── layout/                      # 布局组件
│   │   ├── Header.tsx              # 顶部导航
│   │   ├── Sidebar.tsx             # 侧边栏
│   │   ├── Footer.tsx              # 页脚
│   │   └── MobileNav.tsx           # 移动导航
│   │
│   └── providers/                   # 上下文提供者
│       ├── QueryProvider.tsx       # TanStack Query
│       ├── ThemeProvider.tsx       # 主题切换
│       └── AuthProvider.tsx        # 认证状态
│
├── lib/                             # 🛠️ 核心工具库
│   ├── auth/
│   │   ├── auth.ts                 # NextAuth配置
│   │   ├── guards.ts               # 权限守卫
│   │   └── utils.ts                # 认证工具
│   │
│   ├── db/
│   │   ├── prisma.ts               # Prisma单例
│   │   ├── seed.ts                 # 数据种子
│   │   └── migrations/             # 自定义迁移
│   │
│   ├── ai/
│   │   ├── client.ts               # AI SDK客户端
│   │   ├── prompts.ts              # 提示词模板
│   │   ├── generators/             # 生成器
│   │   │   ├── task-generator.ts  # 任务生成
│   │   │   ├── story-generator.ts # 剧情生成
│   │   │   └── name-generator.ts  # 名称生成
│   │   └── types.ts
│   │
│   ├── game/                        # 游戏核心逻辑
│   │   ├── constants.ts            # 游戏常量
│   │   ├── formulas.ts             # 计算公式
│   │   ├── random.ts               # 随机算法
│   │   └── validators.ts           # 业务验证
│   │
│   └── utils/                       # 通用工具
│       ├── cn.ts                   # className合并
│       ├── date.ts                 # 日期处理
│       ├── format.ts               # 格式化
│       └── storage.ts              # 本地存储
│
├── hooks/                           # 🎣 自定义React Hooks
│   ├── use-player.ts               # 玩家数据Hook
│   ├── use-tasks.ts                # 任务数据Hook
│   ├── use-inventory.ts            # 背包Hook
│   ├── use-debounce.ts             # 防抖
│   ├── use-local-storage.ts        # 本地存储
│   └── use-media-query.ts          # 响应式
│
├── stores/                          # 📦 状态管理 (Zustand)
│   ├── game-store.ts               # 游戏全局状态
│   ├── ui-store.ts                 # UI状态 (侧边栏/模态框)
│   └── cache-store.ts              # 客户端缓存
│
├── styles/                          # 🎨 样式文件
│   ├── globals.css                 # 全局样式
│   ├── themes/                     # 主题变量
│   │   ├── light.css
│   │   └── dark.css
│   └── animations.css              # 动画效果
│
├── prisma/
│   ├── schema.prisma               # 数据库Schema
│   ├── migrations/                 # 迁移历史
│   └── seeds/                      # 种子数据
│       ├── realms.ts               # 境界数据
│       ├── items.ts                # 物品数据
│       └── techniques.ts           # 功法数据
│
├── public/                          # 静态资源
│   ├── images/
│   │   ├── realms/                 # 境界图标
│   │   ├── items/                  # 物品图标
│   │   └── backgrounds/            # 背景图
│   ├── sounds/                     # 音效
│   └── fonts/                      # 字体
│
├── config/                          # ⚙️ 配置文件
│   ├── site.ts                     # 站点配置
│   ├── game.ts                     # 游戏配置
│   ├── navigation.ts               # 导航配置
│   └── features.ts                 # 功能开关
│
├── types/                           # 📘 全局类型定义
│   ├── game.ts                     # 游戏类型
│   ├── api.ts                      # API类型
│   └── env.d.ts                    # 环境变量类型
│
├── docs/                            # 📚 项目文档
│   ├── PROJECT_OVERVIEW.md         # 项目概览
│   ├── ARCHITECTURE_DESIGN.md      # 架构设计 (本文档)
│   ├── API_REFERENCE.md            # API参考
│   ├── GAME_DESIGN.md              # 游戏设计
│   └── DEPLOYMENT.md               # 部署指南
│
├── tests/                           # 🧪 测试文件
│   ├── unit/                       # 单元测试
│   ├── integration/                # 集成测试
│   └── e2e/                        # 端到端测试
│
├── scripts/                         # 📜 脚本工具
│   ├── setup-db.ts                 # 数据库初始化
│   ├── generate-types.ts           # 类型生成
│   └── backup.ts                   # 备份工具
│
├── middleware.ts                    # Next.js中间件
├── next.config.ts                   # Next.js配置
├── tailwind.config.ts               # Tailwind配置
├── tsconfig.json                    # TypeScript配置
├── .env.example                     # 环境变量模板
├── .gitignore
├── package.json
└── README.md
```

## 🏗️ 架构亮点

### 1. 功能模块化 (`features/`)
每个业务领域独立管理,包含:
- **actions.ts**: Server Actions (服务端操作)
- **queries.ts**: 数据查询函数
- **schemas.ts**: Zod验证模式
- **types.ts**: TypeScript类型定义
- **utils.ts**: 模块内工具函数

### 2. 路由组织 (`app/`)
- **(auth)**: 认证相关页面,无需游戏布局
- **(game)**: 游戏页面,共享导航和侧边栏
- **_components**: 页面私有组件,不参与路由

### 3. 共享组件 (`components/`)
```
ui/        → 纯UI组件 (按钮、卡片、模态框)
game/      → 游戏业务组件 (境界徽章、经验条)
layout/    → 布局组件 (导航、侧边栏)
providers/ → React Context提供者
```

### 4. 核心库 (`lib/`)
```
auth/  → 认证系统
db/    → 数据库操作
ai/    → AI集成
game/  → 游戏逻辑
utils/ → 通用工具
```

### 5. 状态管理策略
- **服务端状态**: TanStack Query (自动缓存、重新验证)
- **客户端状态**: Zustand (轻量级、简单)
- **表单状态**: React Hook Form + Zod

## 🔄 数据流设计

### 典型操作流程: 完成任务

```typescript
// 1. 用户点击"完成任务"按钮
// components/tasks/TaskCard.tsx (Client Component)
'use client'
export function TaskCard({ task }) {
  const completeTask = useCompleteTask() // Custom Hook
  
  return (
    <button onClick={() => completeTask(task.id)}>
      完成任务
    </button>
  )
}

// 2. Custom Hook调用Server Action
// hooks/use-tasks.ts
export function useCompleteTask() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (taskId) => completeTaskAction(taskId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      queryClient.invalidateQueries({ queryKey: ['player'] })
    }
  })
}

// 3. Server Action执行业务逻辑
// features/tasks/actions.ts
'use server'
export async function completeTaskAction(taskId: string) {
  const session = await auth()
  if (!session) throw new Error('Unauthorized')
  
  // 调用业务逻辑层
  return await TaskService.complete(taskId, session.user.id)
}

// 4. 业务逻辑层处理
// features/tasks/service.ts (可选抽象层)
export class TaskService {
  static async complete(taskId: string, userId: string) {
    // 验证任务
    const task = await prisma.task.findUnique({ where: { id: taskId } })
    if (task.status === 'COMPLETED') throw new Error('Already completed')
    
    // 更新任务
    const completed = await prisma.task.update({
      where: { id: taskId },
      data: { status: 'COMPLETED', completedAt: new Date() }
    })
    
    // 奖励玩家
    await PlayerService.addRewards(userId, task.rewards)
    
    // 触发成就检查
    await AchievementService.checkUnlock(userId, 'TASK_COMPLETE')
    
    return completed
  }
}
```

## 🎯 关键设计决策

### Server Components vs Client Components

**Server Components (默认)**:
```typescript
// app/(game)/dashboard/page.tsx
export default async function DashboardPage() {
  const session = await auth()
  const player = await getPlayer(session.user.id)
  
  return <DashboardView player={player} />
}
```

**Client Components (交互、状态、Hooks)**:
```typescript
// components/tasks/TaskCard.tsx
'use client'
export function TaskCard({ task }) {
  const [isOpen, setIsOpen] = useState(false)
  
  return <button onClick={() => setIsOpen(true)}>...</button>
}
```

### 数据获取策略

1. **Server Components**: 直接调用Prisma
2. **Client Components**: 使用TanStack Query + Server Actions
3. **缓存策略**: 
   - 静态数据: `revalidate: 3600` (1小时)
   - 动态数据: `revalidate: 0` (不缓存)
   - 用户数据: TanStack Query自动管理

### 类型安全

```typescript
// 1. Prisma生成基础类型
import { Player, Task } from '@prisma/client'

// 2. Zod定义验证Schema
// features/tasks/schemas.ts
export const createTaskSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().max(500),
  difficulty: z.enum(['EASY', 'MEDIUM', 'HARD'])
})

export type CreateTaskInput = z.infer<typeof createTaskSchema>

// 3. 在Server Action中验证
'use server'
export async function createTask(input: unknown) {
  const validated = createTaskSchema.parse(input) // 自动验证
  return await prisma.task.create({ data: validated })
}
```

## 📦 模块依赖关系

```
app/         → 依赖 features/, components/, lib/
features/    → 依赖 lib/, 可选依赖其他features
components/  → 依赖 lib/, hooks/, types/
lib/         → 核心库,不依赖其他模块
hooks/       → 依赖 features/, lib/
stores/      → 独立,可被任何模块使用
```

### 禁止的依赖
- ❌ `lib/` 不能依赖 `features/` 或 `components/`
- ❌ `components/ui/` 不能依赖 `features/`
- ❌ 循环依赖

## 🚀 性能优化

### 代码分割
```typescript
// 动态导入重型组件
const HeavyChart = dynamic(() => import('@/components/charts/HeavyChart'), {
  loading: () => <Spinner />,
  ssr: false
})
```

### 图片优化
```typescript
import Image from 'next/image'

<Image
  src="/images/realms/jindan.png"
  alt="金丹期"
  width={100}
  height={100}
  priority={false}
/>
```

### 数据库查询优化
```typescript
// 使用select减少数据传输
const player = await prisma.player.findUnique({
  where: { id },
  select: {
    name: true,
    realm: true,
    experience: true,
    // 只选择需要的字段
  }
})
```

## 🔐 安全考虑

### Server Actions安全
```typescript
'use server'
export async function deleteTask(taskId: string) {
  // 1. 认证检查
  const session = await auth()
  if (!session) throw new Error('Unauthorized')
  
  // 2. 权限检查
  const task = await prisma.task.findUnique({ where: { id: taskId } })
  if (task.userId !== session.user.id) {
    throw new Error('Forbidden')
  }
  
  // 3. 执行操作
  await prisma.task.delete({ where: { id: taskId } })
}
```

### 输入验证
- 所有Server Actions使用Zod验证
- 前端也使用相同Schema验证(用户体验)
- 永远不信任客户端数据

## 📈 可扩展性

### 新增功能模块
```bash
# 1. 创建功能目录
mkdir features/auction

# 2. 创建必需文件
touch features/auction/{actions,queries,schemas,types,utils}.ts

# 3. 创建页面
mkdir app/(game)/auction
touch app/(game)/auction/page.tsx

# 4. 创建组件
mkdir components/auction
```

### 集成第三方服务
```typescript
// lib/services/payment.ts
export class PaymentService {
  static async createOrder(amount: number) {
    // 集成支付服务
  }
}
```

## 🎓 开发规范

### 命名约定
- **文件名**: kebab-case (`task-card.tsx`)
- **组件名**: PascalCase (`TaskCard`)
- **函数名**: camelCase (`createTask`)
- **常量名**: UPPER_SNAKE_CASE (`MAX_TASKS`)

### 文件组织
```typescript
// 推荐顺序
1. Imports
2. Types/Interfaces
3. Constants
4. Main Component
5. Sub Components
6. Exports
```

### 注释规范
```typescript
/**
 * 完成任务并奖励玩家
 * @param taskId - 任务ID
 * @param userId - 用户ID
 * @returns 更新后的任务对象
 * @throws {Error} 任务不存在或已完成
 */
export async function completeTask(taskId: string, userId: string) {
  // ...
}
```

## 🔄 迁移计划

### 从当前结构迁移

1. **Phase 1**: 创建新目录结构
   - 创建 `features/` 目录
   - 移动业务逻辑到对应feature
   - 保留旧代码暂不删除

2. **Phase 2**: 重构Server Actions
   - 在 `features/*/actions.ts` 中创建
   - 逐个迁移旧的API逻辑
   - 添加Zod验证

3. **Phase 3**: 迁移UI组件
   - 区分Server/Client Components
   - 移动到新的 `components/` 结构
   - 更新imports

4. **Phase 4**: 清理
   - 删除旧代码
   - 更新文档
   - 运行测试

---

**架构审查**: ✅ 已批准  
**下一步**: 开始执行目录结构重组  
**预计时间**: 2-3小时