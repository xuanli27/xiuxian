export enum GameView {
  ONBOARDING_SPIRIT = 'ONBOARDING_SPIRIT',
  ONBOARDING_MIND = 'ONBOARDING_MIND',
  DASHBOARD = 'DASHBOARD',
  TASKS = 'TASKS',
  INVENTORY = 'INVENTORY',
  TRIBULATION = 'TRIBULATION',
  REINCARNATION = 'REINCARNATION'
}

export enum Rank {
  MORTAL = '凡人',
  QI_REFINING = '练气',
  FOUNDATION = '筑基',
  GOLDEN_CORE = '金丹',
  NASCENT_SOUL = '元婴',
  SPIRIT_SEVERING = '化神',
  VOID_REFINING = '炼虚',
  MAHAYANA = '大乘',
  IMMORTAL = '飞升'
}

export enum SpiritRootType {
  HEAVEN = '天灵根',
  EARTH = '地灵根',
  HUMAN = '人灵根',
  WASTE = '废灵根'
}

export interface PlayerStats {
  name: string;
  avatar: string; // URL or SVG string
  rank: Rank;
  level: number; // 1-10 within a rank
  qi: number;
  maxQi: number;
  spiritRoot: SpiritRootType;
  mindState: string; // e.g., '闲云野鹤'
  innerDemon: number; // 0-100
  coins: number; // Spirit Stones
  location: string; // e.g., '剑冢', '丹炉谷'
  history: string[]; // Log of past lives or major events
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
    item?: string;
  };
  duration: number; // seconds
  completed: boolean;
}

export interface GameState {
  player: PlayerStats;
  tasks: Task[];
  activeView: GameView;
  notifications: string[];
  isOfflineCalculationDone: boolean;
  offlineSummary?: string;
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