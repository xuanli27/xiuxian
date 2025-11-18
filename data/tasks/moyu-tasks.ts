/**
 * 摸鱼任务预设数据
 * 将日常摸鱼行为包装成修仙任务
 */

export interface MoyuTask {
  title: string
  description: string
  type: 'LINK' | 'GAME' | 'BATTLE'
  difficulty: 'EASY' | 'MEDIUM' | 'HARD'
  category: 'DAILY' | 'WEEKLY' | 'ACHIEVEMENT'
  rewardQi: number
  rewardContribution: number
  rewardStones: number
  duration: number
  url?: string
  tags: string[]
}

/**
 * 日常摸鱼任务
 */
export const DAILY_MOYU_TASKS: MoyuTask[] = [
  {
    title: '研习《起点仙侠录》',
    description: '前往起点中文网，阅读最新的修仙小说，领悟前辈高人的修炼心得。据说有人在小说中顿悟了新的功法...',
    type: 'LINK',
    difficulty: 'EASY',
    category: 'DAILY',
    rewardQi: 15,
    rewardContribution: 8,
    rewardStones: 3,
    duration: 30,
    url: 'https://www.qidian.com',
    tags: ['功法', '顿悟', '小说'],
  },
  {
    title: '观摩《B站修仙大会》',
    description: '前往哔哩哔哩，观看修仙相关视频，学习其他修士的修炼技巧。有人说在弹幕中能找到隐藏的修炼秘诀...',
    type: 'LINK',
    difficulty: 'EASY',
    category: 'DAILY',
    rewardQi: 20,
    rewardContribution: 10,
    rewardStones: 5,
    duration: 45,
    url: 'https://www.bilibili.com',
    tags: ['神通', '视频', '学习'],
  },
  {
    title: '浏览《知乎问道》',
    description: '前往知乎，查看"如何快速突破境界"等修仙问题。据说有位隐世高人经常在知乎分享修炼心得...',
    type: 'LINK',
    difficulty: 'EASY',
    category: 'DAILY',
    rewardQi: 12,
    rewardContribution: 6,
    rewardStones: 2,
    duration: 20,
    url: 'https://www.zhihu.com',
    tags: ['问道', '知识', '交流'],
  },
  {
    title: '清理灵识传音',
    description: '处理堆积的传音符（邮件），回复重要的宗门事务。据说及时处理传音能提升心境稳定度...',
    type: 'GAME',
    difficulty: 'EASY',
    category: 'DAILY',
    rewardQi: 10,
    rewardContribution: 5,
    rewardStones: 2,
    duration: 30,
    tags: ['邮件', '管理', '日常'],
  },
  {
    title: '参悟《GitHub道藏》',
    description: '前往GitHub，研究开源项目的代码，从中领悟编程之道。有传言说某位大佬的代码中蕴含天地至理...',
    type: 'LINK',
    difficulty: 'MEDIUM',
    category: 'DAILY',
    rewardQi: 25,
    rewardContribution: 15,
    rewardStones: 8,
    duration: 60,
    url: 'https://github.com',
    tags: ['代码', '开源', '学习'],
  },
  {
    title: '逛《淘宝灵宝阁》',
    description: '前往淘宝，浏览各种"灵宝"（数码产品）。虽然买不起，但看看也能增长见识，说不定能激发灵感...',
    type: 'LINK',
    difficulty: 'EASY',
    category: 'DAILY',
    rewardQi: 8,
    rewardContribution: 4,
    rewardStones: 1,
    duration: 25,
    url: 'https://www.taobao.com',
    tags: ['购物', '灵宝', '娱乐'],
  },
];

/**
 * 每周摸鱼任务
 */
export const WEEKLY_MOYU_TASKS: MoyuTask[] = [
  {
    title: '深入《Steam仙境》',
    description: '前往Steam平台，研究各类游戏的"修炼系统"。据说有些游戏的设计能启发真实的修炼思路...',
    type: 'LINK',
    difficulty: 'MEDIUM',
    category: 'WEEKLY',
    rewardQi: 40,
    rewardContribution: 20,
    rewardStones: 10,
    duration: 90,
    url: 'https://store.steampowered.com',
    tags: ['游戏', '娱乐', '研究'],
  },
  {
    title: '探索《Reddit异界》',
    description: '前往Reddit，与海外修士交流修炼心得。据说那里有许多奇特的修炼方法...',
    type: 'LINK',
    difficulty: 'HARD',
    category: 'WEEKLY',
    rewardQi: 50,
    rewardContribution: 30,
    rewardStones: 15,
    duration: 120,
    url: 'https://www.reddit.com',
    tags: ['交流', '国际', '探索'],
  },
  {
    title: '修习《网易云音律》',
    description: '前往网易云音乐，聆听各种音乐，修炼音律之道。有人说在评论区能找到知音...',
    type: 'LINK',
    difficulty: 'EASY',
    category: 'WEEKLY',
    rewardQi: 30,
    rewardContribution: 15,
    rewardStones: 8,
    duration: 60,
    url: 'https://music.163.com',
    tags: ['音乐', '音律', '放松'],
  },
  {
    title: '挑战《代码审查大阵》',
    description: '审查同门师兄弟提交的代码，指出其中的问题。这是一项艰巨的任务，但能大幅提升你的威望...',
    type: 'GAME',
    difficulty: 'HARD',
    category: 'WEEKLY',
    rewardQi: 60,
    rewardContribution: 40,
    rewardStones: 20,
    duration: 120,
    tags: ['代码', '审查', '挑战'],
  },
];

/**
 * 成就任务
 */
export const ACHIEVEMENT_TASKS: MoyuTask[] = [
  {
    title: '《摸鱼宗师》',
    description: '连续摸鱼7天不被发现，证明你已经掌握了摸鱼的最高境界。完成此任务将获得"摸鱼宗师"称号！',
    type: 'GAME',
    difficulty: 'HARD',
    category: 'ACHIEVEMENT',
    rewardQi: 100,
    rewardContribution: 50,
    rewardStones: 30,
    duration: 180,
    tags: ['成就', '称号', '挑战'],
  },
  {
    title: '《网络遨游者》',
    description: '访问100个不同的网站，探索互联网的每个角落。据说完成此任务能开启"千里眼"神通...',
    type: 'LINK',
    difficulty: 'MEDIUM',
    category: 'ACHIEVEMENT',
    rewardQi: 80,
    rewardContribution: 40,
    rewardStones: 25,
    duration: 150,
    url: 'https://www.google.com',
    tags: ['探索', '成就', '神通'],
  },
];

/**
 * 获取随机摸鱼任务
 */
export function getRandomMoyuTasks(count: number = 3): MoyuTask[] {
  const allTasks = [...DAILY_MOYU_TASKS, ...WEEKLY_MOYU_TASKS];
  const shuffled = allTasks.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

/**
 * 根据难度获取任务
 */
export function getTasksByDifficulty(difficulty: 'EASY' | 'MEDIUM' | 'HARD'): MoyuTask[] {
  const allTasks = [...DAILY_MOYU_TASKS, ...WEEKLY_MOYU_TASKS, ...ACHIEVEMENT_TASKS];
  return allTasks.filter(task => task.difficulty === difficulty);
}

/**
 * 根据类型获取任务
 */
export function getTasksByType(type: 'LINK' | 'GAME' | 'BATTLE'): MoyuTask[] {
  const allTasks = [...DAILY_MOYU_TASKS, ...WEEKLY_MOYU_TASKS, ...ACHIEVEMENT_TASKS];
  return allTasks.filter(task => task.type === type);
}