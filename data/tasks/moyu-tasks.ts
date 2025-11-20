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
  {
    title: '探访《微博江湖》',
    description: '前往微博，查看修仙界的最新八卦和热点事件。据说关注热搜能提前预知天机...',
    type: 'LINK',
    difficulty: 'EASY',
    category: 'DAILY',
    rewardQi: 10,
    rewardContribution: 5,
    rewardStones: 2,
    duration: 20,
    url: 'https://weibo.com',
    tags: ['八卦', '热点', '社交'],
  },
  {
    title: '研读《掘金宝典》',
    description: '前往掘金，学习前端修炼之术。据说这里藏着许多提升战力的秘籍...',
    type: 'LINK',
    difficulty: 'MEDIUM',
    category: 'DAILY',
    rewardQi: 22,
    rewardContribution: 12,
    rewardStones: 6,
    duration: 40,
    url: 'https://juejin.cn',
    tags: ['技术', '前端', '学习'],
  },
  {
    title: '浏览《豆瓣书院》',
    description: '前往豆瓣，阅读书评影评，提升文化修养。据说在这里能找到志同道合的道友...',
    type: 'LINK',
    difficulty: 'EASY',
    category: 'DAILY',
    rewardQi: 14,
    rewardContribution: 7,
    rewardStones: 3,
    duration: 30,
    url: 'https://www.douban.com',
    tags: ['文化', '书籍', '影视'],
  },
  {
    title: '访问《V2EX论道》',
    description: '前往V2EX，与技术修士们交流心得。这里聚集着许多高手，能学到不少东西...',
    type: 'LINK',
    difficulty: 'MEDIUM',
    category: 'DAILY',
    rewardQi: 20,
    rewardContribution: 10,
    rewardStones: 5,
    duration: 35,
    url: 'https://www.v2ex.com',
    tags: ['技术', '社区', '交流'],
  },
  {
    title: '游览《小红书秘境》',
    description: '前往小红书，探索生活修炼之道。据说这里有许多提升生活品质的秘诀...',
    type: 'LINK',
    difficulty: 'EASY',
    category: 'DAILY',
    rewardQi: 12,
    rewardContribution: 6,
    rewardStones: 2,
    duration: 25,
    url: 'https://www.xiaohongshu.com',
    tags: ['生活', '分享', '种草'],
  },
  {
    title: '探索《抖音幻境》',
    description: '前往抖音，观看短视频放松心神。据说在这里能找到许多有趣的修炼灵感...',
    type: 'LINK',
    difficulty: 'EASY',
    category: 'DAILY',
    rewardQi: 10,
    rewardContribution: 5,
    rewardStones: 2,
    duration: 30,
    url: 'https://www.douyin.com',
    tags: ['短视频', '娱乐', '放松'],
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
    title: '研究《YouTube神通》',
    description: '前往YouTube，观看海外修士的修炼视频。据说能学到许多国内没有的独特技巧...',
    type: 'LINK',
    difficulty: 'MEDIUM',
    category: 'WEEKLY',
    rewardQi: 45,
    rewardContribution: 25,
    rewardStones: 12,
    duration: 90,
    url: 'https://www.youtube.com',
    tags: ['视频', '国际', '学习'],
  },
  {
    title: '探访《Twitter灵界》',
    description: '前往Twitter，了解全球修仙界的最新动态。据说这里能第一时间获知重大事件...',
    type: 'LINK',
    difficulty: 'MEDIUM',
    category: 'WEEKLY',
    rewardQi: 35,
    rewardContribution: 18,
    rewardStones: 9,
    duration: 60,
    url: 'https://twitter.com',
    tags: ['社交', '国际', '资讯'],
  },
  {
    title: '浏览《Medium道场》',
    description: '前往Medium，阅读高质量的技术文章。据说这里的文章能大幅提升修为...',
    type: 'LINK',
    difficulty: 'MEDIUM',
    category: 'WEEKLY',
    rewardQi: 38,
    rewardContribution: 20,
    rewardStones: 10,
    duration: 75,
    url: 'https://medium.com',
    tags: ['技术', '文章', '深度'],
  },
  {
    title: '访问《Stack Overflow问答殿》',
    description: '前往Stack Overflow，解答或学习编程问题。据说帮助他人能积累功德...',
    type: 'LINK',
    difficulty: 'HARD',
    category: 'WEEKLY',
    rewardQi: 55,
    rewardContribution: 35,
    rewardStones: 18,
    duration: 120,
    url: 'https://stackoverflow.com',
    tags: ['编程', '问答', '互助'],
  },
  {
    title: '探索《Pinterest灵感库》',
    description: '前往Pinterest，收集设计灵感。据说这里能激发创造力，提升审美修为...',
    type: 'LINK',
    difficulty: 'EASY',
    category: 'WEEKLY',
    rewardQi: 28,
    rewardContribution: 14,
    rewardStones: 7,
    duration: 50,
    url: 'https://www.pinterest.com',
    tags: ['设计', '灵感', '创意'],
  },
  {
    title: '研读《Hacker News宝典》',
    description: '前往Hacker News，了解科技界最新动态。据说这里聚集着最顶尖的技术修士...',
    type: 'LINK',
    difficulty: 'HARD',
    category: 'WEEKLY',
    rewardQi: 48,
    rewardContribution: 28,
    rewardStones: 14,
    duration: 90,
    url: 'https://news.ycombinator.com',
    tags: ['科技', '资讯', '前沿'],
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