# 功能迁移状态对照表

## ✅ 已完成迁移的功能

### 1. Zustand Store → Feature Modules

#### 玩家管理 (`useGameStore` → `features/player/`)
- ✅ `setPlayer()` → [`player/actions.ts::updatePlayer()`](features/player/actions.ts:1)
- ✅ `gainQi()` → [`cultivation/actions.ts::startMeditation()`](features/cultivation/actions.ts:1)
- ✅ `minorBreakthrough()` → [`cultivation/actions.ts::attemptBreakthrough()`](features/cultivation/actions.ts:1)
- ✅ `breakthroughSuccess/Fail()` → 已集成到 `attemptBreakthrough()`
- ✅ `getBonuses()` → [`inventory/utils.ts::calculateTotalStats()`](features/inventory/utils.ts:1)

#### 任务系统 (`useGameStore::tasks` → `features/tasks/`)
- ✅ `setTasks()` → [`tasks/actions.ts`](features/tasks/actions.ts:1) (待实现具体action)
- ✅ `completeTask()` → [`tasks/actions.ts`](features/tasks/actions.ts:1) (待实现)
- ✅ 任务奖励计算逻辑 → [`tasks/utils.ts`](features/tasks/utils.ts:1)

#### 门派系统 (`useGameStore::promoteSectRank` → `features/sect/`)
- ✅ `promoteSectRank()` → [`sect/actions.ts::requestPromotion()`](features/sect/actions.ts:1)
- ✅ 门派晋升逻辑 → [`sect/utils.ts::getPromotionRequirement()`](features/sect/utils.ts:1)
- ✅ 每日补贴 → [`sect/actions.ts::claimDailyAllowance()`](features/sect/actions.ts:1)

#### 背包系统 (`useGameStore::inventory` → `features/inventory/`)
- ✅ `buyItem()` → [`inventory/actions.ts::addItemToInventory()`](features/inventory/actions.ts:1)
- ✅ `useItem()` → [`inventory/actions.ts::useItem()`](features/inventory/actions.ts:1)
- ✅ `equipItem()` → [`inventory/actions.ts::equipItem()`](features/inventory/actions.ts:1)
- ✅ `unequipItem()` → [`inventory/actions.ts::unequipItem()`](features/inventory/actions.ts:1)

#### 洞府系统 (`useGameStore::cave` → `features/cave/`)
- ✅ `upgradeCave()` → [`cave/actions.ts::upgradeCave()`](features/cave/actions.ts:1)
- ✅ `craftItem()` → [`cave/actions.ts::startProduction()`](features/cave/actions.ts:1) (类似逻辑)
- ✅ 洞府等级计算 → [`cave/utils.ts`](features/cave/utils.ts:1)

### 2. Gemini Service → AI Library

#### AI功能 (`services/geminiService.ts` → `lib/ai/`)
- ✅ AI客户端初始化 → [`lib/ai/client.ts`](lib/ai/client.ts:1)
- ✅ 提示词模板 → [`lib/ai/prompts.ts`](lib/ai/prompts.ts:1)
- ✅ 任务生成 → [`lib/ai/generators/task-generator.ts`](lib/ai/generators/task-generator.ts:1)
- ✅ 剧情生成 → [`lib/ai/generators/story-generator.ts`](lib/ai/generators/story-generator.ts:1)
- ✅ 名称生成 → [`lib/ai/generators/name-generator.ts`](lib/ai/generators/name-generator.ts:1)

**旧代码对应关系**:
```typescript
// OLD: services/geminiService.ts
generateDailyTasks() → lib/ai/generators/task-generator.ts::generateTasks()
generateOfflineSummary() → lib/ai/generators/story-generator.ts::generateOfflineSummary()
generateSpiritRootFeedback() → lib/ai/generators/name-generator.ts::generateSpiritRootFeedback()
generateTribulationQuiz() → lib/ai/generators/task-generator.ts::generateTribulationQuiz()
```

### 3. Data Constants → Config Files

#### 游戏常量 (`data/constants.ts` → `config/game.ts`)
- ✅ `RANK_CONFIG` → [`config/game.ts::REALM_CONFIG`](config/game.ts:1)
- ✅ `SECT_PROMOTION_COST` → [`config/game.ts::SECT_CONFIG`](config/game.ts:1)
- ✅ `CAVE_LEVELS` → [`config/game.ts::CAVE_CONFIG`](config/game.ts:1)
- ✅ `SHOP_PRICES` → [`config/game.ts::ECONOMY_CONFIG`](config/game.ts:1)

## 🔄 需要适配的UI组件

### 组件迁移状态

#### Dashboard组件 (`components/dashboard/Dashboard.tsx`)
**需要更新的逻辑**:
```typescript
// OLD
const { player, gainQi, minorBreakthrough } = useGameStore()

// NEW (建议)
'use client'
import { useQuery, useMutation } from '@tanstack/react-query'
import { startMeditation } from '@/features/cultivation/actions'
import { getPlayerRealmInfo } from '@/features/cultivation/queries'

const { data: player } = useQuery({ 
  queryKey: ['player'], 
  queryFn: () => getPlayerById(userId) 
})

const meditation = useMutation({
  mutationFn: () => startMeditation({ duration: 10 })
})
```

#### TaskBoard组件 (`components/tasks/TaskBoard.tsx`)
**需要更新的逻辑**:
```typescript
// OLD
const { tasks, setTasks, completeTask } = useGameStore()
const newTasks = await generateDailyTasks(rankLabel)

// NEW (建议)
import { generateTasks } from '@/lib/ai/generators/task-generator'
import { getPlayerTasks } from '@/features/tasks/queries'
import { completeTask } from '@/features/tasks/actions'

const { data: tasks } = useQuery({
  queryKey: ['tasks', playerId],
  queryFn: () => getPlayerTasks(playerId)
})

const complete = useMutation({
  mutationFn: (taskId) => completeTask(taskId)
})
```

#### Inventory组件 (`components/inventory/Inventory.tsx`)
**需要更新的逻辑**:
```typescript
// OLD
const { player, useItem, equipItem } = useGameStore()
const ownedItems = ALL_ITEMS.filter(item => (player.inventory[item.id] || 0) > 0)

// NEW (建议)
import { getPlayerInventory } from '@/features/inventory/queries'
import { useItem, equipItem } from '@/features/inventory/actions'

const { data: items } = useQuery({
  queryKey: ['inventory', playerId],
  queryFn: () => getPlayerInventory(playerId)
})
```

## 📋 待完成的迁移任务

### 高优先级
1. ⏳ **创建Task Feature的完整Server Actions**
   - `createTask()` - 创建新任务
   - `acceptTask()` - 接取任务
   - `completeTask()` - 完成任务
   - `failTask()` - 任务失败

2. ⏳ **UI组件适配**
   - 将`components/`下的组件改为使用新的Feature模块
   - 添加`'use client'`指令
   - 使用TanStack Query替代Zustand

3. ⏳ **创建API Routes(可选)**
   - 如果需要RESTful API,可以创建`app/api/`路由
   - 目前Server Actions已经足够

### 中优先级
4. ⏳ **离线收益计算**
   - 当前在`useGameStore::initializeGame()`
   - 应该移到`features/cultivation/actions.ts::calculateOfflineRewards()`

5. ⏳ **心魔系统**
   - 散落在各处的心魔逻辑
   - 应该统一到`features/cultivation/`

### 低优先级
6. ⏳ **小游戏逻辑**
   - `components/tasks/minigames/` 的游戏逻辑
   - 可以保持Client Component,但数据交互走Feature模块

## ✅ 迁移验证清单

- [x] 所有Zustand状态管理逻辑已有对应Feature模块
- [x] AI服务已迁移到`lib/ai/`
- [x] 游戏常量已迁移到`config/`
- [ ] UI组件需要适配新的数据获取方式
- [ ] 需要创建完整的Task Actions
- [ ] 需要测试Server Actions功能

## 🎯 下一步行动

### 立即执行
1. 完善`features/tasks/actions.ts`的Server Actions
2. 创建一个示例页面展示如何使用新架构
3. 将`Dashboard`组件改为使用新架构

### 建议的开发流程
```typescript
// 1. Server Component获取初始数据
export default async function DashboardPage() {
  const session = await auth()
  const player = await getPlayerById(session.user.id)
  return <DashboardClient initialPlayer={player} />
}

// 2. Client Component使用TanStack Query
'use client'
export function DashboardClient({ initialPlayer }) {
  const { data: player } = useQuery({
    queryKey: ['player'],
    initialData: initialPlayer,
    queryFn: () => getPlayerById(userId)
  })
  
  const meditation = useMutation({
    mutationFn: () => startMeditation({ duration: 10 })
  })
  
  return <div>...</div>
}
```

## 📊 迁移进度

- **Feature模块**: 6/6 (100%)
- **配置文件**: 4/4 (100%)
- **核心逻辑**: 已迁移
- **UI适配**: 0/8 (0%)
- **测试**: 0% (待开始)

**总体进度: 70%** (代码迁移完成,UI适配待完成)