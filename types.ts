
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
  value: number;
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
