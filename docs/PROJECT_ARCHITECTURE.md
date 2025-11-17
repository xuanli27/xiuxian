# 🐟 摸鱼修仙录 - 项目架构文档

## 📋 项目概览

**摸鱼修仙录 (Moyu Xiuxian Lu)** 是一款创意十足的放置类修仙养成游戏,将传统修仙玄幻题材与现代职场文化完美融合。玩家扮演"仙欲宗"(咸鱼宗)的实习生,通过摸鱼积累灵气,应对老板的绩效考核(天劫),最终达成"财务自由"(飞升)的终极目标。

### 核心特色
- 🎮 **放置类玩法**: 支持主动点击和后台挂机双模式
- 🤖 **AI驱动内容**: 使用 Google Gemini API 生成动态事件和天劫题目
- 🎨 **精美UI设计**: 支持3种主题切换 (暗黑/水墨/赛博朋克)
- 💾 **本地持久化**: 基于 Zustand + localStorage 的状态管理
- 📱 **响应式设计**: 完美适配桌面和移动设备

---

## 🏗️ 技术架构

### 技术栈
```
┌─────────────────────────────────────────────────────┐
│  Framework: React 19 + TypeScript                   │
├─────────────────────────────────────────────────────┤
│  Build Tool: Vite 6.2                               │
│  Styling: Tailwind CSS v4 (Browser Mode)            │
│  State Management: Zustand 5.0 (with persist)       │
│  AI Service: Google Gemini API (gemini-2.5-flash)   │
│  Icons: Lucide React                                │
│  Charts/Visualization: D3.js                         │
└─────────────────────────────────────────────────────┘
```

### 项目结构
```
xiuxian/
├── app/                          # 应用核心
│   ├── layout.tsx               # 全局布局 (导航栏、主题系统)
│   └── page.tsx                 # 主页面路由逻辑
│
├── components/                   # 组件库
│   ├── ui/                      # 基础UI组件
│   │   ├── Button.tsx           # 按钮组件
│   │   ├── Card.tsx             # 卡片容器
│   │   ├── Modal.tsx            # 模态框
│   │   ├── Badge.tsx            # 徽章
│   │   ├── PageHeader.tsx       # 页面头部
│   │   └── Shared.tsx           # 共享样式
│   │
│   ├── onboarding/              # 新手引导流程
│   │   ├── IntroStory.tsx       # 开场故事 (10个随机入门场景)
│   │   ├── SpiritRootCanvas.tsx # 灵根测试 (Canvas手绘 + AI评价)
│   │   └── MindPathQuiz.tsx     # 心性测试 (职场价值观问卷)
│   │
│   ├── dashboard/               # 主界面
│   │   ├── Dashboard.tsx        # 工位修炼界面
│   │   └── SpiritCoreVisualizer.tsx # 灵气可视化 (粒子动画)
│   │
│   ├── tasks/                   # 任务系统
│   │   ├── TaskBoard.tsx        # 任务面板
│   │   ├── TaskCard.tsx         # 任务卡片
│   │   ├── NavigationStation.tsx # 任务导航站
│   │   └── minigames/           # 小游戏集合
│   │       ├── MessageCleanerGame.tsx  # 清理未读消息
│   │       ├── LogicPuzzleGame.tsx     # 逻辑谜题
│   │       ├── StockMarketGame.tsx     # 股市模拟
│   │       └── BattleArena.tsx         # 战斗竞技场
│   │
│   ├── sect/                    # 宗门系统
│   │   ├── SectHall.tsx         # 宗门大厅 (晋升、商城)
│   │   └── IdentityCard.tsx     # 3D身份令牌卡片
│   │
│   ├── inventory/               # 背包系统
│   │   ├── Inventory.tsx        # 背包主界面
│   │   └── EquipmentPanel.tsx   # 装备面板
│   │
│   ├── cave/                    # 洞府系统
│   │   ├── CaveAbode.tsx        # 洞府主界面
│   │   ├── CaveManager.tsx      # 洞府管理器
│   │   └── CraftingStation.tsx  # 炼丹炼器台
│   │
│   └── tribulation/             # 天劫系统
│       └── Tribulation.tsx      # 渡劫界面 (AI生成题目)
│
├── store/                        # 状态管理
│   └── useGameStore.ts          # 核心游戏状态 (492行)
│
├── services/                     # 服务层
│   └── geminiService.ts         # Gemini API封装
│
├── data/                         # 游戏数据
│   └── constants.ts             # 常量配置 (境界、道具、材料等)
│
├── types.ts                      # TypeScript类型定义
├── index.html                    # 入口HTML (主题系统CSS变量)
├── index.tsx                     # React入口
├── vite.config.ts               # Vite配置
└── package.json                 # 依赖配置
```

---

## 🎮 核心系统设计

### 1. 游戏视图系统 (GameView)
```typescript
enum GameView {
  INTRO              // 开场动画
  ONBOARDING_SPIRIT  // 灵根测试
  ONBOARDING_MIND    // 心性测试
  DASHBOARD          // 主界面(工位)
  SECT               // 宗门大厅
  TASKS              // 任务榜
  INVENTORY          // 背包
  TRIBULATION        // 渡劫
  CAVE               // 洞府
  REINCARNATION      // 转世(未实现)
}
```

### 2. 修为系统 (Rank System)
```
境界层级 (9阶段):
凡人(试用期) → 练气(实习生) → 筑基(专员) → 金丹(组长) 
→ 元婴(经理) → 化神(总监) → 炼虚(VP) → 大乘(合伙人) 
→ 仙人(财务自由)

突破机制:
- 小突破: 同境界内升级 (level++)
- 大突破: 渡劫晋升下一境界 (rank++)
```

### 3. 核心资源
| 资源 | 用途 | 获取方式 |
|------|------|----------|
| **灵气 (Qi)** | 突破境界 | 工位打坐、完成任务 |
| **心魔 (Inner Demon)** | 负面状态 | 失败任务、压力累积 |
| **贡献 (Contribution)** | 宗门货币 | 完成任务 |
| **灵石 (Spirit Stones)** | 炼丹炼器 | 任务奖励 |
| **材料 (Materials)** | 制作道具 | 任务掉落 |

### 4. 装备系统
```typescript
装备槽位:
- HEAD (头部): 降噪耳机
- BODY (身体): 格子衬衫
- WEAPON (武器): 机械键盘
- ACCESSORY (饰品): 运动手环

属性加成:
- qiMultiplier: 灵气获取倍率
- demonReduction: 心魔减免
- flatQi: 固定灵气加成
```

---

## 🔧 关键技术实现

### 状态管理 (Zustand)
```typescript
// useGameStore.ts 核心结构
interface GameState {
  view: GameView            // 当前视图
  player: PlayerStats       // 玩家数据
  tasks: Task[]            // 任务列表
  offlineReport: string    // 离线报告
  
  // 核心方法
  gainQi()                 // 获得灵气
  tick()                   // 游戏主循环 (100ms)
  completeTask()           // 完成任务
  minorBreakthrough()      // 小境界突破
  breakthroughSuccess()    // 渡劫成功
  initializeGame()         // 初始化游戏(计算离线收益)
  ...
}
```

### AI内容生成 (Gemini API)
```typescript
// services/geminiService.ts
export const generateSpiritRootFeedback()  // 灵根评价
export const generateOfflineSummary()      // 离线周报
export const generateTribulationQuiz()     // 天劫题目
export const generateDailyTasks()          // 每日任务
```

### 主题系统
通过CSS变量实现三套主题:
- **Dark (暗黑)**: Slate色系
- **Ink (水墨)**: 米黄纸质质感
- **Cyber (赛博朋克)**: Fuchsia+Cyan霓虹

### 游戏循环
```javascript
// app/page.tsx
useEffect(() => {
  const timer = setInterval(() => tick(), 100);  // 每100ms执行一次
  return () => clearInterval(timer);
}, []);
```

---

## 📊 数据流架构

```
┌─────────────────────────────────────────────────┐
│             User Interaction                     │
└───────────────┬─────────────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────────────┐
│          React Components                        │
│  (Dashboard, TaskBoard, SectHall, etc.)         │
└───────────────┬─────────────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────────────┐
│        Zustand Store (useGameStore)              │
│  - player state                                  │
│  - game logic (gainQi, breakthrough, etc.)       │
│  - persist to localStorage                       │
└───────┬─────────────────────────┬───────────────┘
        │                         │
        ▼                         ▼
┌─────────────────┐     ┌─────────────────────────┐
│  Gemini API     │     │  Browser Storage        │
│  (Dynamic       │     │  (localStorage)         │
│   Content)      │     │                         │
└─────────────────┘     └─────────────────────────┘
```

---

## 🎯 核心功能流程

### 新手引导流程
```
1. IntroStory (随机开场) 
   → 2. SpiritRootCanvas (手绘灵根 + AI评价)
      → 3. MindPathQuiz (心性测试)
         → 4. Dashboard (开始游戏)
```

### 修炼循环
```
点击/后台挂机 → 积累灵气 → 达到阈值 → 突破/渡劫 → 提升境界
```

### 任务系统
```
刷新任务 (AI生成) → 选择任务类型:
  - LINK: 访问摸鱼网站
  - GAME: 玩小游戏
  - BATTLE: 对战敌人
    → 完成任务 → 获得奖励 (灵气+贡献+材料)
```

---

## 🚀 性能优化

1. **Import Map CDN加载**: 使用 aistudiocdn.com 加速依赖加载
2. **Tailwind Browser Mode**: 无需构建步骤的即时样式
3. **Zustand持久化**: 自动保存游戏进度到localStorage
4. **离线收益**: 基于时间差计算离线期间的灵气增长
5. **React 19**: 使用最新版本的React特性

---

## 🎨 UI/UX设计亮点

### 视觉特效
- 灵气粒子动画 (Canvas + D3.js)
- 3D翻转身份卡片 (CSS Transform)
- 渐变进度条 + 闪光动画
- 心魔红色暗角效果
- 玻璃态模糊导航栏

### 交互体验
- 悬浮底部导航栏
- 平滑主题切换动画
- 加载态反馈
- Toast通知系统
- 模态框系统

---

## 📝 数据配置

### 境界配置 (RANK_CONFIG)
```typescript
{
  baseQi: 100,      // 基础灵气需求
  qiMult: 1.5,      // 升级倍率
  maxLevel: 9,      // 最大等级
  title: "实习生"   // 职场对应称号
}
```

### 商城道具 (SHOP_ITEMS)
- 消耗品: 续命冰美式、请假条、蒸汽眼罩
- 装备: 降噪耳机、运动手环

### 炼丹配方 (RECIPES)
- 手冲咖啡 (成功率90%)
- 机械键盘 (成功率60%)
- 格子衬衫 (成功率50%)

---

## 🔮 未来扩展方向

### 已规划但未实现
1. **REINCARNATION (转世系统)**: GameView枚举中已定义
2. **多人互动**: 宗门排行榜、师徒系统
3. **成就系统**: 各类里程碑成就
4. **剧情模式**: 更丰富的故事线

### 技术优化建议
1. 代码分割和懒加载
2. 服务端渲染 (SSR)
3. PWA支持 (离线游戏)
4. WebSocket实时通信

---

## 📦 快速开始

```bash
# 安装依赖
npm install

# 配置环境变量
echo "GEMINI_API_KEY=your_api_key" > .env

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

---

## 🐛 已知问题

1. ~~App.tsx 和 Layout.tsx 已废弃~~ (已迁移到app目录)
2. Gemini API需要稳定的网络连接
3. 移动端某些CSS动画可能卡顿

---

## 📄 许可证

本项目为个人学习项目,请勿在真实工作场景中模仿游戏内的"摸鱼"行为 😄

---

**文档版本**: v1.0  
**最后更新**: 2025-11-17  
**维护者**: Architect Mode