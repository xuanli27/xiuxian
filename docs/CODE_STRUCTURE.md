# 项目代码架构梳理

## 📋 概述

本文档全面梳理了整个修仙娱乐网站的代码结构、核心功能实现和技术栈。

---

## 🎯 项目定位

**傻瓜式修仙娱乐网站** - 轻松有趣的摸鱼修仙体验
- 🎮 **娱乐优先**: 休闲放置玩法，无需频繁操作
- 🤖 **全自动化**: 自动修炼、自动突破、自动收益
- 🎨 **视觉沉浸**: 周天运行动画、修仙氛围营造
- 📱 **随时随地**: 支持离线收益，碎片时间也能修仙

---

## 🏗️ 技术栈

### 前端框架
- **Next.js 15** (App Router) - React全栈框架
- **React 19** - UI组件库
- **TypeScript** - 类型安全
- **Tailwind CSS** - 原子化CSS

### 后端技术
- **Prisma** - ORM数据库工具
- **PostgreSQL** - 关系型数据库
- **NextAuth.js** - 认证系统
- **Server Actions** - Next.js服务端操作

### 状态管理
- **TanStack Query** - 服务端状态管理
- **React Hooks** - 客户端状态管理

### AI集成
- **Anthropic Claude API** - AI内容生成
- 事件生成、任务生成、对话系统

---

## 📁 目录结构

```
xiuxian/
├── app/                      # Next.js App Router
│   ├── (auth)/              # 认证相关页面
│   │   ├── login/           # 登录
│   │   └── register/        # 注册（含灵根测试）
│   ├── (game)/              # 游戏主体页面
│   │   ├── layout.tsx       # 游戏布局
│   │   ├── dashboard/       # 🧘 紫府（核心中枢）
│   │   ├── tasks/           # 📜 任务大厅
│   │   ├── cave/            # 🏡 洞府管理
│   │   ├── inventory/       # 💍 储物戒指
│   │   ├── tribulation/     # ⚡ 天劫渡劫
│   │   ├── sect/            # ⛩️ 门派系统
│   │   ├── events/          # ✨ 随机事件
│   │   └── leaderboard/     # 📊 排行榜
│   └── api/                 # API路由
│
├── features/                # 功能模块（领域驱动）
│   ├── player/              # 玩家系统
│   ├── cultivation/         # 修炼系统
│   ├── tribulation/         # 天劫系统
│   ├── inventory/           # 物品系统
│   ├── cave/                # 洞府系统
│   ├── tasks/               # 任务系统
│   ├── sect/                # 门派系统
│   ├── events/              # 事件系统
│   └── leaderboard/         # 排行榜
│
├── components/              # 共享组件
│   ├── game/                # 游戏专用组件
│   └── ui/                  # UI基础组件
│
├── lib/                     # 工具库
│   ├── auth/                # 认证工具
│   ├── db/                  # 数据库连接
│   ├── ai/                  # AI集成
│   └── utils/               # 通用工具
│
├── hooks/                   # 自定义Hooks
├── config/                  # 配置文件
├── docs/                    # 项目文档
└── prisma/                  # 数据库Schema
```

---

## 🎮 核心功能详解

### 1. 紫府系统（Dashboard）

**位置**: `app/(game)/dashboard/`

**功能**:
- 周天运行可视化（经络+能量流动）
- 自动修炼轮询（每10秒）
- 境界/灵气实时显示

**关键代码**:
```typescript
// Dashboard.tsx - 自动修炼
useEffect(() => {
  if (!player) return
  
  const interval = setInterval(() => {
    triggerAutoCultivate()
  }, 10000)  // 每10秒
  
  return () => clearInterval(interval)
}, [player])
```

**周天运行组件**: [`QiCirculation.tsx`](../components/game/QiCirculation.tsx)
- 任督二脉路径计算
- 粒子系统动画
- 丹田核心呼吸效果

---

### 2. 修炼系统（Cultivation）

**位置**: `features/cultivation/`

#### 核心文件结构
```
cultivation/
├── actions.ts    # Server Actions（修炼、突破）
├── queries.ts    # 数据查询
├── utils.ts      # 工具函数（公式计算）
├── offline.ts    # 离线收益
├── schemas.ts    # Zod验证
└── types.ts      # TypeScript类型
```

#### 自动修炼逻辑
```typescript
export async function autoCultivate() {
  const baseRate = 2  // 每分钟2灵气
  const spiritRootMultiplier = {
    HEAVEN: 2,
    EARTH: 1.5,
    HUMAN: 1,
    WASTE: 1
  }[player.spiritRoot]
  
  const expGained = baseRate * spiritRootMultiplier
  
  await prisma.player.update({
    where: { id: player.id },
    data: { qi: { increment: expGained } }
  })
}
```

#### 离线收益
```typescript
export async function calculateOfflineRewards(playerId) {
  // 计算离线时长（最多24小时）
  const effectiveMinutes = Math.min(diffMinutes, 24 * 60)
  
  // 离线速度 = 正常速度 * 50%
  const offlineRate = 0.5
  
  // 考虑灵根、洞府、心魔
  const totalQi = baseQi * caveBonus * demonPenalty * offlineRate
  
  return { qi: totalQi, duration: effectiveMinutes }
}
```

#### 境界系统
```typescript
enum Rank {
  MORTAL,          // 凡人
  QI_REFINING,     // 练气期
  FOUNDATION,      // 筑基期
  GOLDEN_CORE,     // 金丹期
  NASCENT_SOUL,    // 元婴期
  SPIRIT_SEVERING, // 化神期
  VOID_REFINING,   // 炼虚期
  MAHAYANA,        // 大乘期
  IMMORTAL         // 仙人
}
```

---

### 3. 天劫系统（Tribulation）

**位置**: `features/tribulation/`

**核心机制**:
- 修为达到95% maxQi时自动触发提示
- 多波次渡劫（3-9波天雷）
- 成功率受灵气进度、心魔影响
- 实时战斗动画

**渡劫流程**:
```typescript
export async function startTribulation(playerId) {
  // 1. 生成波次
  const totalWaves = calculateTribulationWaves(rank)
  
  // 2. 模拟渡劫
  let health = 1000
  let wavesCompleted = 0
  
  for (let wave of waves) {
    const success = Math.random() < successChance
    if (success) {
      wavesCompleted++
      health -= wave.damage * 0.3
    } else {
      health -= wave.damage
      if (health <= 0) break
    }
  }
  
  // 3. 结算
  if (wavesCompleted === totalWaves) {
    // 成功：晋升境界
    return { success: true, newRank: getNextRank(rank) }
  } else {
    // 失败：损失灵气
    return { success: false, qiLost: qi * 0.5 }
  }
}
```

**前端动画**:
```typescript
// 逐波动画展示
for (let i = 1; i <= totalWaves; i++) {
  await delay(800)
  setCurrentWave(i)
  
  if (i <= wavesCompleted) {
    setLogs(prev => [...prev, `第${i}道天雷...抵挡成功!`])
  } else {
    setLogs(prev => [...prev, `护体灵光破碎!`])
    break
  }
}
```

---

### 4. 任务系统（Tasks）

**位置**: `features/tasks/` + `app/(game)/tasks/`

**任务类型**:
- 📝 摸鱼任务（职场娱乐主题）
- 🎮 小游戏（消消乐、股市、拼图等）
- 📅 每日任务

**小游戏集成**:
```
tasks/_components/minigames/
├── MessageCleanerGame.tsx   # 消消乐
├── StockMarketGame.tsx      # 股市模拟
├── LogicPuzzleGame.tsx      # 逻辑拼图
└── BattleArena.tsx          # 战斗竞技场
```

---

### 5. 其他核心系统

详细文档请参考:
- 洞府系统: [`cave/README.md`](../features/cave/README.md)
- 物品系统: [`inventory/README.md`](../features/inventory/README.md)
- 门派系统: [`sect/README.md`](../features/sect/README.md)
- 事件系统: [`events/README.md`](../features/events/README.md)

---

## 🗄️ 数据库设计

**Schema**: [`prisma/schema.prisma`](../prisma/schema.prisma)

### Player表（核心）
```prisma
model Player {
  id              Int      @id @default(autoincrement())
  userId          String   @unique
  name            String
  
  // 修炼
  rank            Rank     @default(MORTAL)
  level           Int      @default(1)
  qi              Float    @default(0)
  maxQi           Float    @default(100)
  
  // 灵根
  spiritRoot      SpiritRootType
  spiritRootQuality Int
  
  // 资源
  spiritStones    Int      @default(100)
  innerDemon      Int      @default(0)
  
  // 洞府
  caveLevel       Int      @default(1)
  
  // 时间
  lastLoginTime   DateTime @default(now())
  
  // JSON字段
  history         Json     @default("[]")
  inventory       Json     @default("{}")
}
```

---

## 📊 数据流转

### 修炼循环
```
进入紫府 → 轮询autoCultivate() → 数据库更新 
→ TanStack Query刷新 → UI更新 → 达到95% → 提示渡劫
```

### 离线收益
```
登录 → 检测lastLoginTime → 计算时长 
→ 计算收益 → 弹窗展示 → 应用到数据
```

---

## 🎨 UI/UX设计

### 配色方案
```css
--primary: #3b82f6;      /* 灵气蓝 */
--secondary: #8b5cf6;    /* 法力紫 */
--danger: #ef4444;       /* 天劫红 */
--success: #10b981;      /* 突破绿 */
```

### 关键动画
- **呼吸效果**: 丹田核心
- **粒子流动**: 经络能量
- **波纹扩散**: 突破瞬间

---

## 🚀 性能优化

1. **代码分割**: 动态导入游戏组件
2. **数据缓存**: TanStack Query (5分钟缓存)
3. **图片优化**: Next.js Image组件
4. **数据库索引**: userId, rank等字段

---

## 📝 相关文档

- 🏗️ [架构设计](ARCHITECTURE.md)
- ✨ [功能列表](FEATURES.md)
- 🎨 [UI/UX重新设计](UI_UX_REDESIGN.md)
- 📚 [API文档](API.md)
- 🔍 [代码审查](CODE_REVIEW.md)

---

## 🔧 开发指南

### 安装依赖
```bash
pnpm install
```

### 启动开发服务器
```bash
pnpm dev
```

### 数据库迁移
```bash
pnpm prisma migrate dev
```

### 构建生产版本
```bash
pnpm build
pnpm start
```

---

## 📌 待优化项

1. ✅ 周天运行动画（已完成）
2. ⏳ 天劫自动触发逻辑
3. ⏳ 移动端适配优化
4. ⏳ 性能监控和日志
5. ⏳ 单元测试覆盖

---

**最后更新**: 2025-11-19
**维护者**: 开发团队