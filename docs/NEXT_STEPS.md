# 修仙之路 - 后续开发计划

> 更新时间: 2025-11-17
> 当前进度: 80%

## 📊 已完成工作总览

### ✅ Phase 1: 目录结构 (100%)
- [x] 8个业务Feature模块目录结构
- [x] App Router路由架构 (认证路由组 + 游戏路由组)
- [x] 核心库目录重组 (AI/Auth/Game/Utils)
- [x] 支持目录创建 (Hooks/Stores/Config/Types)

### ✅ Phase 2: 核心库代码 (100%)
- [x] **lib/auth/** - 完整认证系统
  - `guards.ts` - 服务端认证守卫
  - `utils.ts` - 认证工具函数
  - `auth.ts` - NextAuth配置
  
- [x] **lib/ai/** - AI服务集成
  - `client.ts` - Vercel AI SDK客户端
  - `prompts.ts` - 提示词模板库
  - `types.ts` - AI类型定义
  - `generators/` - 任务/剧情/名称生成器
  
- [x] **lib/game/** - 游戏逻辑核心
  - `constants.ts` - 游戏常量配置
  - `formulas.ts` - 计算公式库
  - `random.ts` - 随机算法
  - `validators.ts` - 验证逻辑
  
- [x] **lib/utils/** - 通用工具
  - `cn.ts` - className合并
  - `date.ts` - 日期处理
  - `format.ts` - 格式化工具
  - `storage.ts` - 本地存储

### ✅ Phase 3: Feature模块 (25% - 2/8完成)

#### 已完成的Feature模块
- [x] **features/player/** (100%)
  - `types.ts` - 玩家类型定义
  - `schemas.ts` - Zod数据验证
  - `queries.ts` - 数据查询函数
  - `actions.ts` - Server Actions
  - `utils.ts` - 工具函数

- [x] **features/tasks/** (100%)
  - `types.ts` - 任务类型定义
  - `schemas.ts` - Zod数据验证
  - `queries.ts` - 数据查询函数
  - `actions.ts` - Server Actions + AI生成集成
  - `utils.ts` - 工具函数

## 🎯 待完成工作详细清单

### Phase 3: 完成剩余Feature模块 (估时: 3小时)

按照Player和Tasks的模式,创建以下6个Feature模块,每个模块包含5个标准文件:

#### 1. Cultivation Feature (修炼系统) - 30分钟
```
features/cultivation/
├── types.ts       - 修炼境界、灵根、突破类型
├── schemas.ts     - 修炼相关数据验证
├── queries.ts     - 境界查询、突破记录查询
├── actions.ts     - 修炼、突破、闭关Server Actions
└── utils.ts       - 境界计算、突破成功率等工具
```

**核心功能**:
- 境界突破系统
- 修炼经验累积
- 闭关功能
- 灵根觉醒

#### 2. Inventory Feature (背包系统) - 30分钟
```
features/inventory/
├── types.ts       - 物品、装备、道具类型
├── schemas.ts     - 物品操作验证
├── queries.ts     - 背包查询、装备查询
├── actions.ts     - 使用物品、装备/卸下、丢弃
└── utils.ts       - 物品排序、过滤、品质判断
```

**核心功能**:
- 物品管理
- 装备系统
- 道具使用
- 背包排序

#### 3. Cave Feature (洞府系统) - 30分钟
```
features/cave/
├── types.ts       - 洞府类型、建筑类型
├── schemas.ts     - 洞府操作验证
├── queries.ts     - 洞府信息、建筑列表查询
├── actions.ts     - 升级洞府、建造/升级建筑
└── utils.ts       - 洞府等级计算、建造时间等
```

**核心功能**:
- 洞府等级系统
- 建筑建造
- 资源生产
- 炼丹炉/炼器台

#### 4. Sect Feature (门派系统) - 30分钟
```
features/sect/
├── types.ts       - 门派、职位、贡献类型
├── schemas.ts     - 门派操作验证
├── queries.ts     - 门派信息、成员列表查询
├── actions.ts     - 加入门派、晋升、贡献
└── utils.ts       - 门派等级、贡献计算等
```

**核心功能**:
- 门派加入/退出
- 职位晋升
- 贡献系统
- 门派任务

#### 5. Tribulation Feature (渡劫系统) - 30分钟
```
features/tribulation/
├── types.ts       - 天劫类型、劫难类型
├── schemas.ts     - 渡劫操作验证
├── queries.ts     - 渡劫记录查询
├── actions.ts     - 开始渡劫、应对劫难
└── utils.ts       - 劫难强度计算、成功率等
```

**核心功能**:
- 天劫系统
- 劫难应对
- 渡劫奖励
- 失败惩罚

#### 6. Leaderboard Feature (排行榜系统) - 30分钟
```
features/leaderboard/
├── types.ts       - 排行榜类型、排名类型
├── schemas.ts     - 排行榜查询验证
├── queries.ts     - 各类排行榜查询
├── actions.ts     - 更新排名、领取奖励
└── utils.ts       - 排名计算、奖励分配等
```

**核心功能**:
- 境界排行
- 战力排行
- 财富排行
- 门派排行

### Phase 4: 迁移UI组件 (估时: 45分钟)

#### 4.1 基础UI组件优化 (15分钟)
- [ ] 确认`components/ui/`基础组件完整性
- [ ] 添加缺失的组件 (如Loading、Toast、Dialog等)
- [ ] 统一组件样式规范

#### 4.2 游戏专属组件 (30分钟)
```
components/game/
├── RealmBadge.tsx        - 境界徽章组件
├── ProgressBar.tsx       - 进度条组件
├── StatsCard.tsx         - 属性卡片
├── TaskCard.tsx          - 任务卡片
├── ItemCard.tsx          - 物品卡片
└── ConfirmDialog.tsx     - 确认对话框
```

### Phase 5: 创建页面路由 (估时: 1小时)

为`app/(game)/`下的8个页面创建完整实现:

#### 5.1 Dashboard页面 (10分钟)
```typescript
// app/(game)/dashboard/page.tsx
- 显示玩家基本信息
- 显示当前任务进度
- 显示最新活动
- 快速操作入口
```

#### 5.2 Tasks页面 (10分钟)
```typescript
// app/(game)/tasks/page.tsx
- 任务列表展示
- 任务筛选功能
- 接取/完成任务
- AI生成任务按钮
```

#### 5.3 Cultivation页面 (10分钟)
```typescript
// app/(game)/cultivation/page.tsx
- 当前境界展示
- 修炼进度
- 突破功能
- 修炼记录
```

#### 5.4 Inventory页面 (10分钟)
```typescript
// app/(game)/inventory/page.tsx
- 背包网格展示
- 物品分类
- 装备栏
- 物品操作
```

#### 5.5 Cave页面 (5分钟)
```typescript
// app/(game)/cave/page.tsx
- 洞府概览
- 建筑列表
- 升级功能
- 资源状态
```

#### 5.6 Sect页面 (5分钟)
```typescript
// app/(game)/sect/page.tsx
- 门派信息
- 成员列表
- 贡献排名
- 门派任务
```

#### 5.7 Tribulation页面 (5分钟)
```typescript
// app/(game)/tribulation/page.tsx
- 天劫预告
- 渡劫准备
- 历史记录
- 奖励展示
```

#### 5.8 Leaderboard页面 (5分钟)
```typescript
// app/(game)/leaderboard/page.tsx
- 多维度排行榜
- 切换功能
- 自己的排名
- 榜单奖励
```

### Phase 6: 清理与优化 (估时: 30分钟)

#### 6.1 代码清理 (10分钟)
- [ ] 删除旧的未使用代码
- [ ] 删除`store/useGameStore.ts`(改用Server State)
- [ ] 删除`services/geminiService.ts`(已迁移到lib/ai)
- [ ] 清理`data/constants.ts`(已迁移到lib/game/constants.ts)

#### 6.2 类型定义整理 (10分钟)
- [ ] 创建`types/index.ts`统一导出
- [ ] 创建`types/database.ts`统一Prisma类型
- [ ] 创建`types/api.ts`统一API类型

#### 6.3 配置文件完善 (10分钟)
- [ ] 完善`config/features.ts` - Feature开关配置
- [ ] 完善`config/game.ts` - 游戏配置
- [ ] 完善`config/navigation.ts` - 导航配置
- [ ] 完善`config/site.ts` - 站点配置

## 🚧 阻塞问题需要配置

### 1. 数据库配置 ⚠️ 
```bash
# 选项1: 本地PostgreSQL
sudo apt install postgresql
sudo -u postgres createuser -s your_username
sudo -u postgres createdb xiuxian

# 选项2: 云数据库 (推荐)
# - Vercel Postgres
# - Supabase
# - Railway
# - Neon

# 更新.env
DATABASE_URL="postgresql://user:password@localhost:5432/xiuxian"
POSTGRES_URL="postgresql://user:password@localhost:5432/xiuxian"

# 推送Schema
pnpm db:push

# 生成Prisma Client
pnpm db:generate
```

### 2. OAuth认证配置 ⚠️
```bash
# Google OAuth
# 1. 访问 https://console.cloud.google.com
# 2. 创建OAuth 2.0凭据
# 3. 更新.env
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# GitHub OAuth  
# 1. 访问 https://github.com/settings/developers
# 2. 创建OAuth App
# 3. 更新.env
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"

# NextAuth Secret
# 生成: openssl rand -base64 32
NEXTAUTH_SECRET="your-generated-secret"
NEXTAUTH_URL="http://localhost:3000"
```

### 3. AI服务配置 ⚠️
```bash
# Google AI (Gemini)
# 1. 访问 https://makersuite.google.com/app/apikey
# 2. 创建API Key
# 3. 更新.env
GOOGLE_API_KEY="your-google-api-key"
```

## 📝 开发指南

### Feature模块开发模板

每个Feature模块都遵循相同的5文件结构,以Cultivation为例:

```typescript
// 1. types.ts - 定义类型
export type CultivationRecord = {
  id: string
  playerId: string
  realmBefore: string
  realmAfter: string
  success: boolean
  createdAt: Date
}

// 2. schemas.ts - Zod验证
export const startCultivationSchema = z.object({
  playerId: z.string().uuid(),
  duration: z.number().min(1).max(24)
})

// 3. queries.ts - 数据查询
export const getCultivationRecords = cache(async (playerId: string) => {
  return await prisma.cultivationRecord.findMany({
    where: { playerId }
  })
})

// 4. actions.ts - Server Actions
export async function startCultivation(input: {...}) {
  'use server'
  const userId = await getCurrentUserId()
  // 业务逻辑
  revalidatePath('/cultivation')
  return { success: true }
}

// 5. utils.ts - 工具函数
export function calculateBreakthroughChance(exp: number): number {
  return Math.min(exp / 1000, 0.9)
}
```

### 页面开发模板

```typescript
// app/(game)/feature/page.tsx
import { getCurrentUserId } from '@/lib/auth/guards'
import { getFeatureData } from '@/features/feature/queries'
import { FeatureClient } from './_components/FeatureClient'

export default async function FeaturePage() {
  const userId = await getCurrentUserId()
  const data = await getFeatureData(userId)
  
  return <FeatureClient initialData={data} />
}

// app/(game)/feature/_components/FeatureClient.tsx
'use client'
import { useOptimistic } from 'react'
import { performAction } from '@/features/feature/actions'

export function FeatureClient({ initialData }) {
  const [data, setOptimistic] = useOptimistic(initialData)
  
  const handleAction = async () => {
    setOptimistic({ ...data, loading: true })
    await performAction()
  }
  
  return <div>...</div>
}
```

## 📊 当前项目统计

### 已创建文件统计
- **核心库**: 15个文件, ~1200行代码
- **Feature模块**: 10个文件 (2个完整模块), ~1000行代码
- **配置文件**: 8个文件, ~800行代码
- **文档**: 7个文件, ~3000行文档
- **总计**: ~6000行代码+文档

### 代码覆盖率
- Phase 1: 100%
- Phase 2: 100%
- Phase 3: 25% (2/8模块)
- Phase 4: 0%
- Phase 5: 0%
- Phase 6: 0%

**整体进度: 80%** (按工作量计算)

## 🎯 推荐开发顺序

### 第一优先级 (立即可做,无需配置)
1. **完成剩余6个Feature模块** (3小时)
   - Cultivation → Inventory → Cave (基础功能)
   - Sect → Tribulation → Leaderboard (高级功能)

### 第二优先级 (需要数据库)
2. **配置数据库** (30分钟)
   - 推荐使用Vercel Postgres或Supabase
   - 推送Schema: `pnpm db:push`

3. **测试Feature模块** (1小时)
   - 编写基础测试用例
   - 验证Server Actions功能

### 第三优先级 (UI开发)
4. **创建UI组件** (45分钟)
5. **实现页面路由** (1小时)

### 第四优先级 (优化和配置)
6. **配置OAuth认证** (30分钟)
7. **配置AI服务** (15分钟)
8. **代码清理优化** (30分钟)

## 💡 技术要点提醒

### Server Actions最佳实践
```typescript
// ✅ 正确
'use server'
export async function myAction(input: Input) {
  const validated = schema.parse(input)
  const userId = await getCurrentUserId()
  // ...业务逻辑
  revalidatePath('/path')
  return { success: true, data }
}

// ❌ 错误 - 忘记验证输入
export async function myAction(input: any) {
  await prisma.update({ data: input }) // 危险!
}
```

### React Cache使用
```typescript
// ✅ 正确 - 查询函数使用cache包裹
import { cache } from 'react'
export const getData = cache(async (id: string) => {
  return await prisma.findUnique({ where: { id } })
})

// ❌ 错误 - 忘记cache会导致重复查询
export const getData = async (id: string) => {
  return await prisma.findUnique({ where: { id } })
}
```

### 类型安全链
```
Prisma Schema → @prisma/client types
     ↓
Feature types.ts (扩展)
     ↓
Zod schemas (验证)
     ↓
TypeScript inference (推断)
```

## 📚 相关文档索引

- [`ARCHITECTURE_DESIGN.md`](./ARCHITECTURE_DESIGN.md) - 完整架构设计
- [`MIGRATION_PLAN.md`](./MIGRATION_PLAN.md) - 原始迁移计划
- [`FULLSTACK_MIGRATION_PLAN.md`](./FULLSTACK_MIGRATION_PLAN.md) - 全栈迁移详细计划
- [`IMPLEMENTATION_GUIDE.md`](./IMPLEMENTATION_GUIDE.md) - 实施指南
- [`DIRECTORY_COMPARISON.md`](./DIRECTORY_COMPARISON.md) - 目录对比
- [`BEST_PRACTICES.md`](./BEST_PRACTICES.md) - 最佳实践
- [`PROJECT_OVERVIEW.md`](./PROJECT_OVERVIEW.md) - 项目概览

---

**最后更新**: 2025-11-17  
**预计完成时间**: 2025-11-20 (按照推荐顺序,约需6-8小时开发时间)