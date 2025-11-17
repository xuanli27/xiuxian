
import { Rank, RankInfo, SectRank, Item, Material, Recipe, CaveLevelConfig } from '../types';

export const RANK_CONFIG: Record<Rank, RankInfo> = {
  [Rank.MORTAL]: { id: Rank.MORTAL, name: '凡人', title: '试用期', maxLevel: 1, baseQi: 100, qiMult: 1 },
  [Rank.QI_REFINING]: { id: Rank.QI_REFINING, name: '练气', title: '实习生', maxLevel: 9, baseQi: 500, qiMult: 1.5 },
  [Rank.FOUNDATION]: { id: Rank.FOUNDATION, name: '筑基', title: '专员', maxLevel: 4, baseQi: 10000, qiMult: 1.8 },
  [Rank.GOLDEN_CORE]: { id: Rank.GOLDEN_CORE, name: '金丹', title: '组长', maxLevel: 4, baseQi: 50000, qiMult: 2.0 },
  [Rank.NASCENT_SOUL]: { id: Rank.NASCENT_SOUL, name: '元婴', title: '经理', maxLevel: 4, baseQi: 200000, qiMult: 2.5 },
  [Rank.SPIRIT_SEVERING]: { id: Rank.SPIRIT_SEVERING, name: '化神', title: '总监', maxLevel: 4, baseQi: 1000000, qiMult: 3.0 },
  [Rank.VOID_REFINING]: { id: Rank.VOID_REFINING, name: '炼虚', title: 'VP', maxLevel: 4, baseQi: 5000000, qiMult: 4.0 },
  [Rank.MAHAYANA]: { id: Rank.MAHAYANA, name: '大乘', title: '合伙人', maxLevel: 4, baseQi: 50000000, qiMult: 5.0 },
  [Rank.IMMORTAL]: { id: Rank.IMMORTAL, name: '仙人', title: '财务自由', maxLevel: 1, baseQi: Infinity, qiMult: 1 }
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

// Helpers
export const getRankLabel = (rank: Rank, level: number): string => {
  const config = RANK_CONFIG[rank];
  if (rank === Rank.MORTAL) return `${config.name} (${config.title})`;
  if (rank === Rank.IMMORTAL) return config.name;

  let subRank = '';
  if (rank === Rank.QI_REFINING) {
    subRank = `${level}层`;
  } else {
    const stages = ['前期', '中期', '后期', '圆满'];
    subRank = stages[Math.min(level - 1, 3)] || '圆满';
  }
  return `${config.name}期 ${subRank}`;
};

export const getFullRankTitle = (rank: Rank, level: number): string => {
    const config = RANK_CONFIG[rank];
    const label = getRankLabel(rank, level);
    return `${label} - ${config.title}`;
}
