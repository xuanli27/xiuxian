export enum GameView {
  ONBOARDING_SPIRIT = 'ONBOARDING_SPIRIT',
  ONBOARDING_MIND = 'ONBOARDING_MIND',
  DASHBOARD = 'DASHBOARD',
  SECT = 'SECT',
  TASKS = 'TASKS',
  INVENTORY = 'INVENTORY',
  TRIBULATION = 'TRIBULATION',
  REINCARNATION = 'REINCARNATION'
}

export type Theme = 'dark' | 'ink' | 'cyber';

export enum Rank {
  MORTAL = '试用期(凡人)',
  QI_REFINING = '练气实习生',
  FOUNDATION = '筑基专员',
  GOLDEN_CORE = '金丹组长',
  NASCENT_SOUL = '元婴经理',
  SPIRIT_SEVERING = '化神总监',
  VOID_REFINING = '炼虚VP',
  MAHAYANA = '大乘合伙人',
  IMMORTAL = '财务自由(飞升)'
}

export enum SectRank {
  OUTER = '外门牛马',
  INNER = '内门摸鱼人',
  ELITE = '真传薪水小偷',
  ELDER = '划水长老',
  MASTER = '咸鱼宗主'
}

export enum SpiritRootType {
  HEAVEN = '天灵根 (S级人才)',
  EARTH = '地灵根 (A级人才)',
  HUMAN = '人灵根 (普招)',
  WASTE = '废灵根 (外包)'
}

export interface Item {
  id: string;
  name: string;
  description: string;
  effect: 'HEAL_QI' | 'REDUCE_DEMON' | 'AUTO_TASK' | 'DOUBLE_QI';
  value: number; // Effect magnitude
  icon: string;
}

export interface PlayerStats {
  name: string;
  avatar: string; 
  rank: Rank;
  sectRank: SectRank;
  level: number; 
  qi: number;
  maxQi: number;
  spiritRoot: SpiritRootType;
  mindState: string; 
  innerDemon: number; // Stress/Burnout level
  contribution: number; // Sect Contribution Points (Gongde)
  location: string; 
  history: string[]; 
  inventory: Record<string, number>; // ItemID -> Count
  theme: Theme; // User preference
  createTime: number;
  lastLoginTime: number;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  type: 'LINK' | 'GAME' | 'BATTLE';
  reward: {
    qi: number;
    contribution: number;
    item?: string;
  };
  duration: number; 
  completed: boolean;
}

export const RANK_THRESHOLDS: Record<Rank, number> = {
  [Rank.MORTAL]: 100,
  [Rank.QI_REFINING]: 1000,
  [Rank.FOUNDATION]: 5000,
  [Rank.GOLDEN_CORE]: 20000,
  [Rank.NASCENT_SOUL]: 100000,
  [Rank.SPIRIT_SEVERING]: 500000,
  [Rank.VOID_REFINING]: 2000000,
  [Rank.MAHAYANA]: 10000000,
  [Rank.IMMORTAL]: Infinity,
};

export const SECT_PROMOTION_COST: Record<SectRank, number> = {
  [SectRank.OUTER]: 0,
  [SectRank.INNER]: 500,
  [SectRank.ELITE]: 2000,
  [SectRank.ELDER]: 10000,
  [SectRank.MASTER]: 100000
};

export const SHOP_ITEMS: Item[] = [
  { id: 'coffee', name: '续命冰美式', description: '恢复少量灵气 (Qi +50)', effect: 'HEAL_QI', value: 50, icon: '☕' },
  { id: 'leave_note', name: '请假条', description: '消除部分心魔 (Stress -20)', effect: 'REDUCE_DEMON', value: 20, icon: '📝' },
  { id: 'earplugs', name: '降噪耳塞', description: '大幅降低心魔 (Stress -50)', effect: 'REDUCE_DEMON', value: 50, icon: '🎧' },
  { id: 'gpu', name: '高性能显卡', description: '瞬间获得大量灵气 (Qi +500)', effect: 'HEAL_QI', value: 500, icon: '💾' },
];

export const SHOP_PRICES: Record<string, number> = {
  'coffee': 50,
  'leave_note': 100,
  'earplugs': 200,
  'gpu': 1000
};