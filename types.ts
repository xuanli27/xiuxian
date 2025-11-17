
export enum GameView {
  ONBOARDING_SPIRIT = 'ONBOARDING_SPIRIT',
  ONBOARDING_MIND = 'ONBOARDING_MIND',
  DASHBOARD = 'DASHBOARD',
  SECT = 'SECT',
  TASKS = 'TASKS',
  INVENTORY = 'INVENTORY',
  TRIBULATION = 'TRIBULATION',
  CAVE = 'CAVE',
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
  type: 'CONSUMABLE' | 'ARTIFACT';
}

export interface Material {
  id: string;
  name: string;
  description: string;
  rarity: 'COMMON' | 'RARE' | 'LEGENDARY';
  icon: string;
}

export interface Recipe {
  id: string;
  resultItemId: string;
  name: string;
  materials: Record<string, number>; // MaterialID -> Count
  successRate: number;
  baseCost: number; // Spirit Stones
}

export interface CaveLevelConfig {
  level: number;
  name: string;
  qiMultiplier: number; // e.g. 1.0, 1.1
  maxTasks: number;
  upgradeCost: {
    stones: number;
    materials?: Record<string, number>;
  };
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
  spiritStones: number; // Currency from tasks
  caveLevel: number;
  location: string; 
  history: string[]; 
  inventory: Record<string, number>; // ItemID -> Count
  materials: Record<string, number>; // MaterialID -> Count
  theme: Theme; 
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
    stones: number;
    materials?: { id: string; count: number }[];
  };
  duration: number; 
  completed: boolean;
  // Specific data for interactive tasks
  quiz?: {
    question: string;
    options: string[];
    correctIndex: number;
  };
  enemy?: {
    name: string;
    title: string;
    power: number; // Recommended Qi to beat
    avatar: string;
  };
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

export const MATERIALS: Material[] = [
  { id: 'coffee_bean', name: '陈年咖啡豆', description: '提神醒脑的炼丹基础材料', rarity: 'COMMON', icon: '🫘' },
  { id: 'bug_shell', name: 'Bug甲壳', description: '虽然恶心但很坚硬', rarity: 'COMMON', icon: '🐞' },
  { id: 'hair_strand', name: '强者的秀发', description: '极其稀有的炼器材料', rarity: 'RARE', icon: '➰' },
  { id: 'keyboard_cap', name: '磨损的键帽', description: '蕴含手速之力的矿物', rarity: 'COMMON', icon: '⌨️' },
];

export const SHOP_ITEMS: Item[] = [
  { id: 'coffee', name: '续命冰美式', description: '恢复灵气 (Qi +50)', effect: 'HEAL_QI', value: 50, icon: '☕', type: 'CONSUMABLE' },
  { id: 'leave_note', name: '请假条', description: '消除心魔 (Stress -20)', effect: 'REDUCE_DEMON', value: 20, icon: '📝', type: 'CONSUMABLE' },
  { id: 'earplugs', name: '降噪耳塞', description: '大幅降低心魔 (Stress -50)', effect: 'REDUCE_DEMON', value: 50, icon: '🎧', type: 'CONSUMABLE' },
  { id: 'gpu', name: '高性能显卡', description: '瞬间获得大量灵气 (Qi +500)', effect: 'HEAL_QI', value: 500, icon: '💾', type: 'CONSUMABLE' },
];

export const RECIPES: Recipe[] = [
  { 
    id: 'brew_coffee', 
    resultItemId: 'coffee', 
    name: '手冲咖啡', 
    materials: { 'coffee_bean': 2 }, 
    successRate: 0.9, 
    baseCost: 10 
  },
  { 
    id: 'craft_earplugs', 
    resultItemId: 'earplugs', 
    name: '棉花耳塞', 
    materials: { 'bug_shell': 3, 'hair_strand': 1 }, 
    successRate: 0.7, 
    baseCost: 50 
  }
];

export const CAVE_LEVELS: CaveLevelConfig[] = [
  { level: 1, name: '破旧工位', qiMultiplier: 1.0, maxTasks: 3, upgradeCost: { stones: 0 } },
  { level: 2, name: '独立隔间', qiMultiplier: 1.2, maxTasks: 4, upgradeCost: { stones: 200, materials: { 'keyboard_cap': 2 } } },
  { level: 3, name: '靠窗雅座', qiMultiplier: 1.5, maxTasks: 5, upgradeCost: { stones: 1000, materials: { 'coffee_bean': 10, 'bug_shell': 5 } } },
  { level: 4, name: '主管办公室', qiMultiplier: 2.0, maxTasks: 6, upgradeCost: { stones: 5000, materials: { 'hair_strand': 5 } } },
];

export const SHOP_PRICES: Record<string, number> = {
  'coffee': 50,
  'leave_note': 100,
  'earplugs': 200,
  'gpu': 1000
};
