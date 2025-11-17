
import { Rank, RankInfo, SectRank, Item, Material, Recipe, CaveLevelConfig, EquipmentSlot } from '../types';

export const INTRO_SCENARIOS = [
  {
    title: "地铁奇遇",
    desc: "你在早高峰的地铁上被挤得双脚离地，恍惚间看到一位穿着大裤衩的老者正盯着你的发际线发笑。",
    quote: "“少年，我看你印堂发黑却又骨骼惊奇，想必是996修出的福报。不如入我仙欲宗，修那‘带薪摸鱼’的无上大道？”"
  },
  {
    title: "深山团建",
    desc: "公司组织‘狼性文化’荒野求生团建，你为了躲避喊口号，钻进了一个隐蔽的山洞，却发现别有洞天。",
    quote: "“外界内卷严重，此地有Wifi有空调且无老板。小友，我看你眼神清澈且愚蠢，正是修仙的好苗子啊！”"
  },
  {
    title: "退婚风云",
    desc: "作为一个没钱没房的社畜，你刚被相亲对象当众羞辱‘莫欺少年穷’。此时天空一声巨响，一本秘籍砸在你头上。",
    quote: "“三十年河东，三十年河西，莫欺打工穷！入我宗门，教你如何坐着把钱挣了！”"
  },
  {
    title: "系统觉醒",
    desc: "连续加班48小时后，你感觉心脏骤停，眼前出现了一个蓝色的弹窗：[检测到强烈摸鱼意愿]。",
    quote: "“叮！最强摸鱼修仙系统已绑定。宿主，别卷了，快来测测灵根，开启你的躺平飞升之路吧！”"
  },
  {
    title: "路边算命",
    desc: "天桥底下贴膜的大爷突然拉住你的手，死活不让你走，非说你头顶有祥云笼罩（其实是没洗头）。",
    quote: "“哎呀！这哪是油头，分明是灵气溢出啊！我这有一本《从入门到飞升》，我看与你有缘，今日免费送你入宗！”"
  },
  {
    title: "猫咪开口",
    desc: "你喂了楼下流浪猫一根火腿肠，它突然口吐人言，还递给你一张镶金的二维码。",
    quote: "“本座乃仙欲宗护法神兽。看你手法娴熟，撸猫有道，特许你免试入宗。扫码测灵根，包吃包住！”"
  },
  {
    title: "梦中传道",
    desc: "午休趴在工位上睡觉时，你梦见一个神仙在你的Excel表格里御剑飞行。",
    quote: "“凡人，你的PPT做得太烂了，但你的摸鱼技巧令本座惊叹。醒来吧，加入我们，让全修真界感受被‘摸鱼’支配的恐惧！”"
  },
  {
    title: "电梯惊魂",
    desc: "下班高峰期，电梯故障直坠负18层。门开后不是停车场，而是一座云雾缭绕的仙山。",
    quote: "“欢迎来到地府...啊不，仙府办事处。既然来了就是缘分，签了这份‘灵魂契约’，下辈子不做牛马做神仙！”"
  },
  {
    title: "外卖奇缘",
    desc: "你点的‘变态辣’麻辣烫里吃出了一颗发光的珠子，吞下后感觉浑身燥热，丹田处有一股真气乱窜。",
    quote: "“这可是九转洗髓丹！本来是给宗主点的外卖，竟然被你小子吃了。罢了罢了，我看你也有些慧根，就当是赔偿，随我上山吧！”"
  },
  {
    title: "穿越卡车",
    desc: "为了赶最后一分钟打卡，你冲出马路，迎面而来一辆异世界转生标配的大卡车...",
    quote: "“哟，又来一个业绩。别怕，这里没有KPI，只有长生道。来，测个灵根，看看你这辈子是当主角还是当炮灰。”"
  }
];

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
  { id: 'trash_paper', name: '废弃方案', description: '甲方的第10版修改意见', rarity: 'COMMON', icon: '📄' },
  { id: 'boss_hair', name: '强者的秀发', description: '极其稀有的炼器材料', rarity: 'RARE', icon: '➰' },
  { id: 'broken_pen', name: '咬烂的笔头', description: '焦虑的产物', rarity: 'COMMON', icon: '✒️' },
  { id: 'oily_receipt', name: '油腻发票', description: '报销神器', rarity: 'COMMON', icon: '🧾' },
  { id: 'cat_hair', name: '主子猫毛', description: '粘在衣服上能增加亲和力', rarity: 'RARE', icon: '🐈' },
];

export const SHOP_ITEMS: Item[] = [
  // Consumables
  { id: 'coffee', name: '续命冰美式', description: '恢复灵气 (Qi +50)', effect: 'HEAL_QI', value: 50, icon: '☕', type: 'CONSUMABLE' },
  { id: 'leave_note', name: '请假条', description: '消除心魔 (Stress -20)', effect: 'REDUCE_DEMON', value: 20, icon: '📝', type: 'CONSUMABLE' },
  { id: 'eye_mask', name: '蒸汽眼罩', description: '大幅降低心魔 (Stress -50)', effect: 'REDUCE_DEMON', value: 50, icon: '🎭', type: 'CONSUMABLE' },
  { id: 'massage_gun', name: '筋膜枪', description: '瞬间获得大量灵气 (Qi +500)', effect: 'HEAL_QI', value: 500, icon: '🔫', type: 'CONSUMABLE' },
  
  // Artifacts (Shop exclusive)
  { 
    id: 'noise_headphone', name: '降噪耳机', description: '头部装备：屏蔽老板唠叨，心魔增长减缓 20%', 
    effect: 'EQUIP', value: 0, icon: '🎧', type: 'ARTIFACT', 
    slot: EquipmentSlot.HEAD, bonus: { demonReduction: 0.2 } 
  },
  { 
    id: 'smart_watch', name: '运动手环', description: '饰品：监测心率，灵气获取 +5%', 
    effect: 'EQUIP', value: 0, icon: '⌚', type: 'ARTIFACT', 
    slot: EquipmentSlot.ACCESSORY, bonus: { qiMultiplier: 0.05 } 
  },
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
    id: 'craft_mask', 
    resultItemId: 'eye_mask', 
    name: '自制眼罩', 
    materials: { 'trash_paper': 5, 'broken_pen': 1 }, 
    successRate: 0.7, 
    baseCost: 50 
  },
  // Artifact Recipes
  {
    id: 'mech_keyboard',
    resultItemId: 'mech_keyboard',
    name: '机械键盘',
    materials: { 'broken_pen': 5, 'trash_paper': 10 },
    successRate: 0.6,
    baseCost: 500
  },
  {
    id: 'plaid_shirt',
    resultItemId: 'plaid_shirt',
    name: '格子衬衫',
    materials: { 'oily_receipt': 10, 'cat_hair': 2 },
    successRate: 0.5,
    baseCost: 800
  }
];

// Define crafted items that aren't in shop but exist in game
export const CRAFTED_ITEMS: Item[] = [
  { 
    id: 'mech_keyboard', name: '机械键盘', description: '武器：噼里啪啦的声音能增加工作效率 (灵气+10%)', 
    effect: 'EQUIP', value: 0, icon: '⌨️', type: 'ARTIFACT', 
    slot: EquipmentSlot.WEAPON, bonus: { qiMultiplier: 0.1 } 
  },
  { 
    id: 'plaid_shirt', name: '格子衬衫', description: '身体：程序员的标准皮肤 (灵气+15%, 心魔-5%)', 
    effect: 'EQUIP', value: 0, icon: '👔', type: 'ARTIFACT', 
    slot: EquipmentSlot.BODY, bonus: { qiMultiplier: 0.15, demonReduction: 0.05 } 
  },
];

// Merge all items for lookup
export const ALL_ITEMS = [...SHOP_ITEMS, ...CRAFTED_ITEMS];

export const CAVE_LEVELS: CaveLevelConfig[] = [
  { level: 1, name: '破旧工位', qiMultiplier: 1.0, maxTasks: 3, upgradeCost: { stones: 0 } },
  { level: 2, name: '独立隔间', qiMultiplier: 1.2, maxTasks: 4, upgradeCost: { stones: 200, materials: { 'trash_paper': 5 } } },
  { level: 3, name: '靠窗雅座', qiMultiplier: 1.5, maxTasks: 5, upgradeCost: { stones: 1000, materials: { 'coffee_bean': 10, 'broken_pen': 5 } } },
  { level: 4, name: '主管办公室', qiMultiplier: 2.0, maxTasks: 6, upgradeCost: { stones: 5000, materials: { 'boss_hair': 3, 'oily_receipt': 10 } } },
];

export const SHOP_PRICES: Record<string, number> = {
  'coffee': 50,
  'leave_note': 100,
  'eye_mask': 200,
  'massage_gun': 1000,
  'noise_headphone': 3000,
  'smart_watch': 1500
};

export const MOYU_SITES = [
  {
    category: "假装工作 (Tools)",
    sites: [
      { name: "Hacker Typer", url: "https://hackertyper.net/", desc: "假装写代码", gameType: "LOGIC" },
      { name: "VS Code Web", url: "https://vscode.dev/", desc: "云端开发", gameType: "LOGIC" },
      { name: "Excel Practice", url: "https://www.excel-practice-online.com/", desc: "表格练习", gameType: "LOGIC" },
      { name: "Wikipedia", url: "https://zh.m.wikipedia.org/wiki/Special:Random", desc: "查阅资料", gameType: "TIMER" },
    ]
  },
  {
    category: "真正摸鱼 (Relax)",
    sites: [
      { name: "2048", url: "https://play2048.co/", desc: "益智游戏", gameType: "TIMER" },
      { name: "Hacker News", url: "https://news.ycombinator.com/", desc: "科技新闻", gameType: "TIMER" },
      { name: "Bing Finance", url: "https://www.bing.com/news", desc: "观察大盘", gameType: "STOCK" },
      { name: "TypeRacer", url: "https://play.typeracer.com/", desc: "打字竞速", gameType: "TIMER" }
    ]
  }
];

export const LOGIC_PUZZLES = [
  {
    q: "console.log(1 + '1'); 输出什么？",
    options: ["2", "'11'", "NaN", "Error"],
    a: 1
  },
  {
    q: "typeof null 的结果是？",
    options: ["'null'", "'undefined'", "'object'", "'number'"],
    a: 2
  },
  {
    q: "数组中哪个方法不会改变原数组？",
    options: ["push()", "pop()", "map()", "splice()"],
    a: 2
  },
  {
    q: "CSS中，哪个属性可以开启弹性布局？",
    options: ["display: block", "display: flex", "position: absolute", "float: left"],
    a: 1
  },
  {
    q: "0.1 + 0.2 === 0.3 的结果是？",
    options: ["true", "false", "NaN", "undefined"],
    a: 1
  }
];

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
