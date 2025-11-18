
export enum GameView {
  INTRO = 'INTRO',
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
  MORTAL = 'MORTAL',
  QI_REFINING = 'QI_REFINING',
  FOUNDATION = 'FOUNDATION',
  GOLDEN_CORE = 'GOLDEN_CORE',
  NASCENT_SOUL = 'NASCENT_SOUL',
  SPIRIT_SEVERING = 'SPIRIT_SEVERING',
  VOID_REFINING = 'VOID_REFINING',
  MAHAYANA = 'MAHAYANA',
  IMMORTAL = 'IMMORTAL'
}

export interface RankInfo {
  id: Rank;
  name: string;
  title: string;
  maxLevel: number;
  baseQi: number;
  qiMult: number;
}

export enum SectRank {
  OUTER = 'OUTER',      // 外门弟子
  INNER = 'INNER',      // 内门弟子
  ELITE = 'ELITE',      // 真传弟子
  ELDER = 'ELDER',      // 长老
  MASTER = 'MASTER'     // 掌门
}

export enum SpiritRootType {
  HEAVEN = 'HEAVEN',      // 天灵根 - 单属性灵根，万中无一
  EARTH = 'EARTH',        // 异灵根 - 双属性灵根，百中挑一
  HUMAN = 'HUMAN',        // 真灵根 - 三属性灵根，十中有一
  WASTE = 'WASTE'         // 杂灵根 - 四属性及以上，资质平庸
}

export enum EquipmentSlot {
  HEAD = 'HEAD',
  BODY = 'BODY',
  WEAPON = 'WEAPON', // Keyboards, Mouse, etc.
  ACCESSORY = 'ACCESSORY'
}

export interface Item {
  id: string;
  name: string;
  description: string;
  effect: 'HEAL_QI' | 'REDUCE_DEMON' | 'AUTO_TASK' | 'DOUBLE_QI' | 'EQUIP';
  value: number;
  icon: string;
  type: 'CONSUMABLE' | 'ARTIFACT';
  slot?: EquipmentSlot;
  bonus?: {
    qiMultiplier?: number; // e.g. 0.1 for +10%
    demonReduction?: number; // e.g. 0.1 for -10% gain
    flatQi?: number; // Passive flat gain
  };
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
  materials: Record<string, number>;
  successRate: number;
  baseCost: number;
}

export interface CaveLevelConfig {
  level: number;
  name: string;
  qiMultiplier: number;
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
  innerDemon: number;
  contribution: number;
  spiritStones: number;
  caveLevel: number;
  location: string; 
  history: string[]; 
  inventory: Record<string, number>;
  equipped: Record<EquipmentSlot, string | null>;
  materials: Record<string, number>;
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
  url?: string;
  quiz?: {
    question: string;
    options: string[];
    correctIndex: number;
  };
  enemy?: {
    name: string;
    title: string;
    power: number;
    avatar: string;
  };
}
