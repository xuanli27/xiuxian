/**
 * 游戏随机算法库
 */

/**
 * 生成指定范围的随机整数
 */
export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

/**
 * 从数组中随机选择一个元素
 */
export function randomChoice<T>(array: T[]): T {
  return array[randomInt(0, array.length - 1)]
}

/**
 * 根据权重随机选择
 */
export function weightedRandom<T>(items: { item: T; weight: number }[]): T {
  const totalWeight = items.reduce((sum, item) => sum + item.weight, 0)
  let random = Math.random() * totalWeight
  
  for (const { item, weight } of items) {
    if (random < weight) return item
    random -= weight
  }
  
  return items[items.length - 1].item
}

/**
 * 随机生成灵根
 */
export function randomSpiritRoot(): 'METAL' | 'WOOD' | 'WATER' | 'FIRE' | 'EARTH' {
  const roots = ['METAL', 'WOOD', 'WATER', 'FIRE', 'EARTH']
  return randomChoice(roots as ('METAL' | 'WOOD' | 'WATER' | 'FIRE' | 'EARTH')[])
}

/**
 * 随机暴击判定
 */
export function checkCritical(critRate: number = 0.1): boolean {
  return Math.random() < critRate
}

/**
 * 随机成功率判定
 */
export function checkSuccess(successRate: number): boolean {
  return Math.random() < successRate
}

/**
 * 生成随机名称后缀
 */
export function randomNameSuffix(): string {
  const suffixes = ['真人', '道人', '仙子', '尊者', '上人', '居士']
  return randomChoice(suffixes)
}