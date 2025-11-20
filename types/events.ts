import type { Player } from '@/types/enums';

/**
 * 事件触发器类型
 * - AUTO: 自动触发
 * - MANUAL: 手动触发 (例如，点击某个按钮)
 * - PREVIOUS_CHOICE: 由上一个事件的选项触发
 */
export type EventTriggerType = 'AUTO' | 'MANUAL' | 'PREVIOUS_CHOICE';

export type EventType = 'MAJOR' | 'MINOR' | 'CHAIN';

export interface EventTrigger {
  type: EventTriggerType;
  // 如果是 PREVIOUS_CHOICE，这里可以是上一个事件的ID和选项ID
  sourceEventId?: string;
  sourceChoiceId?: string;
  // 其他可能的触发条件，例如玩家等级、持有的物品等
  minLevel?: number;
  requiredItemId?: string;
}

/**
 * 游戏事件的核心结构
 */
export interface GameEvent {
  id: string;
  eventType: 'MAJOR' | 'MINOR' | 'CHAIN';
  trigger: EventTrigger;
  content: {
    title: string;
    description: string;
    imageUrl?: string;
  };
  choices: EventChoice[];
  timeout?: number; // 单位: 秒
}

/**
 * 事件中的玩家选项
 */
export interface EventChoice {
  id: string;
  text: string;
  // action 应该在服务端定义和执行，这里只是一个标识符
  actionId: string; 
}

/**
 * 玩家做出选择后，由服务端返回的结果
 */
export interface EventResult {
  nextEventId?: string; // 指定的下一个事件ID
  nextEventPrompt?: string; // 用于AI生成下一个事件的Prompt
  playerUpdates: Partial<Player>; // 更新后的玩家部分数据
  itemsGained?: { itemId: string; quantity: number }[];
  itemsLost?: { itemId: string; quantity: number }[];
  statusEffects?: { effectId: string; duration: number }[]; // 获得的状态效果
  narration: string; // 对结果的文字描述
}

/**
 * 玩家当前的状态效果
 */
export interface PlayerStatusEffect {
  id: string;
  playerId: number;
  effectId: string; // 例如 '顿悟', '霉运'
  description: string;
  startTime: Date;
  duration: number; // 单位: 秒
  isActive: boolean;
}