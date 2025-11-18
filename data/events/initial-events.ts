import type { GameEvent } from '@/types/events';

/**
 * 初始事件集合
 * 这些是游戏开始时可能触发的事件
 */
export const INITIAL_EVENTS: GameEvent[] = [
  {
    id: 'welcome-to-sect',
    eventType: 'MAJOR',
    trigger: {
      type: 'AUTO',
    },
    content: {
      title: '初入宗门',
      description: '你刚刚加入了"摸鱼宗"，成为一名外门弟子。宗门坐落在灵气充裕的云雾山中，这里的修士们都有一个共同的特点——善于在修炼与摸鱼之间找到平衡。\n\n掌门在入门仪式上说："修仙之道，张弛有度。过度紧绷，易生心魔；适当放松，反而事半功倍。"',
    },
    choices: [
      {
        id: 'diligent',
        text: '我要勤奋修炼，早日突破境界！',
        actionId: 'choose_diligent_path',
      },
      {
        id: 'balanced',
        text: '劳逸结合，稳扎稳打地修炼。',
        actionId: 'choose_balanced_path',
      },
      {
        id: 'lazy',
        text: '先摸鱼几天，熟悉一下环境再说。',
        actionId: 'choose_lazy_path',
      },
    ],
  },
  {
    id: 'first-task',
    eventType: 'MINOR',
    trigger: {
      type: 'AUTO',
    },
    content: {
      title: '第一个任务',
      description: '师兄递给你一份任务清单："新人都要完成这些基础任务。你可以选择一个开始。"',
    },
    choices: [
      {
        id: 'meditation',
        text: '打坐修炼，凝聚灵气',
        actionId: 'task_meditation',
      },
      {
        id: 'herb-gathering',
        text: '采集灵草，熟悉山门',
        actionId: 'task_herb_gathering',
      },
      {
        id: 'library',
        text: '去藏经阁看看功法',
        actionId: 'task_library',
      },
    ],
  },
  {
    id: 'mysterious-senior',
    eventType: 'CHAIN',
    trigger: {
      type: 'AUTO',
    },
    content: {
      title: '神秘前辈',
      description: '在后山修炼时，你遇到了一位白发苍苍的老者。他看了你一眼，淡淡地说："小友骨骼清奇，是个修仙的好苗子。"',
    },
    choices: [
      {
        id: 'bow',
        text: '恭敬行礼，请教修炼之道',
        actionId: 'respect_senior',
      },
      {
        id: 'ignore',
        text: '礼貌点头，继续自己的修炼',
        actionId: 'ignore_senior',
      },
      {
        id: 'suspicious',
        text: '保持警惕，这可能是骗子',
        actionId: 'suspect_senior',
      },
    ],
  },
];

/**
 * 根据玩家状态获取合适的初始事件
 */
export function getInitialEvent(playerLevel: number): GameEvent {
  if (playerLevel === 1) {
    return INITIAL_EVENTS[0]; // 初入宗门
  }
  
  // 随机返回一个事件
  const randomIndex = Math.floor(Math.random() * INITIAL_EVENTS.length);
  return INITIAL_EVENTS[randomIndex];
}