/**
 * 游戏核心常量
 */

export const GAME_CONSTANTS = {
  // 境界配置
  REALMS: [
    { id: 'LIANQI', name: '练气期', level: 1, maxExp: 1000 },
    { id: 'ZHUJI', name: '筑基期', level: 2, maxExp: 5000 },
    { id: 'JINDAN', name: '金丹期', level: 3, maxExp: 20000 },
    { id: 'YUANYING', name: '元婴期', level: 4, maxExp: 50000 },
    { id: 'HUASHEN', name: '化神期', level: 5, maxExp: 100000 }
  ] as const,

  // 灵根类型
  SPIRIT_ROOTS: [
    { id: 'METAL', name: '金灵根', bonus: 'attack' },
    { id: 'WOOD', name: '木灵根', bonus: 'health' },
    { id: 'WATER', name: '水灵根', bonus: 'mana' },
    { id: 'FIRE', name: '火灵根', bonus: 'speed' },
    { id: 'EARTH', name: '土灵根', bonus: 'defense' }
  ] as const,

  // 门派等级
  SECT_RANKS: [
    { id: 'OUTER', name: '外门弟子', level: 1 },
    { id: 'INNER', name: '内门弟子', level: 2 },
    { id: 'CORE', name: '核心弟子', level: 3 },
    { id: 'ELDER', name: '长老', level: 4 },
    { id: 'MASTER', name: '掌门', level: 5 }
  ] as const,

  // 任务类型
  TASK_TYPES: {
    DAILY: { name: '每日任务', cooldown: 86400 },
    WEEKLY: { name: '每周任务', cooldown: 604800 },
    ACHIEVEMENT: { name: '成就任务', cooldown: 0 }
  } as const,

  // 难度配置
  DIFFICULTIES: {
    EASY: { name: '简单', multiplier: 1 },
    MEDIUM: { name: '中等', multiplier: 1.5 },
    HARD: { name: '困难', multiplier: 2 }
  } as const,

  // 货币配置
  CURRENCY: {
    SPIRIT_STONE: { name: '灵石', icon: '💎' },
    CONTRIBUTION: { name: '贡献点', icon: '⭐' }
  } as const,

  // 游戏平衡
  BALANCE: {
    BASE_HEALTH: 100,
    BASE_MANA: 100,
    BASE_ATTACK: 10,
    BASE_DEFENSE: 5,
    EXP_PER_LEVEL: 100,
    CURRENCY_PER_TASK: 50
  } as const
}

export type Realm = typeof GAME_CONSTANTS.REALMS[number]
export type SpiritRoot = typeof GAME_CONSTANTS.SPIRIT_ROOTS[number]
export type SectRank = typeof GAME_CONSTANTS.SECT_RANKS[number]