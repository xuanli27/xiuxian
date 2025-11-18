# 核心玩法循环：AI驱动的动态事件流

> **文档状态**: **核心设计**
> **核心理念**: 游戏不是由固定的任务线驱动，而是由一个动态的、由AI生成的、具有多分支和多结局的事件流来驱动。玩家的每一个选择都至关重要，塑造其独一无二的修仙人生。

---

## 🌊 玩法循环 (Gameplay Loop)

```mermaid
graph TD
    A[开始] --> B{触发事件};
    B --> C[呈现事件描述与选项];
    C --> D{玩家做出选择};
    D --> E[根据选择，调用AI生成后续事件];
    E --> F[处理事件结果<br/>(属性变化, 获得物品, 触发新状态)];
    F --> B;
```

---

## 📦 事件 (Event) 的数据结构

一个“事件”是构成游戏世界的基本单位。我们需要一个灵活的数据结构来定义它。

```typescript
// types.ts
export interface GameEvent {
  id: string;          // 事件唯一ID
  eventType: 'MAJOR' | 'MINOR' | 'CHAIN'; // 事件类型：主线、次要、连续事件
  trigger: EventTrigger; // 触发条件
  content: {
    title: string;     // 事件标题
    description: string; // 事件描述 (可由AI生成)
    imageUrl?: string;   // 事件图片 (可选)
  };
  choices: EventChoice[]; // 玩家选项
  timeout?: number;      // 选择的倒计时 (单位: 秒)，增加“摸鱼”的紧迫感
}

export interface EventChoice {
  id: string;
  text: string;        // 选项文本
  action: () => Promise<EventResult>; // 选择后执行的动作
}

export interface EventResult {
  nextEventId?: string; // 指定的下一个事件ID
  nextEventPrompt?: string; // 用于AI生成下一个事件的Prompt
  playerUpdates: {
    qi?: number;
    spiritStones?: number;
    mindState?: string;
    // ... 其他玩家属性
  };
  itemsGained?: { itemId: string; quantity: number }[];
  statusEffects?: { effectId: string; duration: number }[]; // 获得的状态，如“顿悟”、“霉运”
  narration: string;   // 对结果的描述 (可由AI生成)
}
```

---

## 🤖 AI的角色

AI是这个系统的灵魂，它负责：

1.  **动态生成事件**: 根据玩家当前的状态（境界、财富、心性、持有的物品等）和上一个事件的结果，生成新的、合乎逻辑的后续事件。
2.  **生成描述**: 为事件和结果生成富有文采和“摸鱼”风格的描述。
3.  **保证多样性**: 确保每个玩家的体验都是独特的。

### AI Prompt 示例

**场景**: 玩家选择了“偷偷把锅甩给实习生”。

**Prompt**:
```
你是一个名为“摸鱼修仙录”的游戏的叙事AI。
玩家当前状态:
- 境界: 练气三层
- 职位: 初级工程师
- 心性: 苟道中人
- 上一个事件: 项目出了BUG，玩家选择了“偷偷把锅甩给实习生”。

请根据以上信息，生成一个后续的MINOR（次要）事件。
事件需要包含:
1. 一个标题 (title)
2. 一段描述 (description)
3. 2-3个选项 (choices)，每个选项需要有简短的文本 (text)。

风格要求: 结合职场“摸鱼”和古典“修仙”的元素，带有一点幽默和讽刺。
```

---

## 🚀 修订后的开发计划

**核心**: **优先构建事件流引擎 (Event Flow Engine)**。

### V1.0 - 事件流核心
1.  **设计事件数据结构**: 完善 `GameEvent`, `EventChoice`, `EventResult` 的定义。
2.  **创建事件相关的Prisma Schema**:
    *   `EventLog`: 记录玩家经历过的所有事件和做出的选择。
    *   `PlayerState`: 存储玩家的动态状态（如 `statusEffects`）。
3.  **开发事件处理器 (Event Processor)**:
    *   一个Server Action，接收玩家的选择，处理结果，更新玩家数据。
4.  **集成AI服务**:
    *   封装一个 `generateNextEvent` 函数，根据当前状态和Prompt调用AI。
5.  **开发事件UI**:
    *   一个通用的React组件，用于渲染事件的标题、描述和选项。
6.  **创建初始事件**: 手动创建几个游戏的开端事件，作为事件流的起点。

### V1.1 - 玩法系统融入事件流
在事件流引擎的基础上，将其他系统作为事件的结果或触发条件融入进来。

*   **炼丹/炼器**:
    *   **触发**: 通过事件获得稀有配方。
    *   **结果**: 炼制出的极品丹药可能触发新的“丹劫”事件。
*   **灵宠**:
    *   **触发**: 在某个事件中，玩家可以选择收养一只受伤的“代码猴”。
*   **异步PVP**:
    *   **触发**: 事件“道友，请留步”，玩家可以选择是否与其他玩家的镜像切磋。

---

## 📝 下一步行动

这个以**动态事件流**为核心的设计，是否准确地捕捉了您的想法？

如果方向正确，我将立即更新我们的TODO list，将**事件流引擎的开发**作为最高优先级。