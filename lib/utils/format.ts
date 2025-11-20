/**
 * 格式化工具函数
 */

import { SpiritRootType as PrismaSpiritRootType, SectRank as PrismaSectRank, Rank as PrismaRank } from '@/types/enums';

// 灵根类型中文映射
export const SPIRIT_ROOT_LABELS: Record<PrismaSpiritRootType, string> = {
  HEAVEN: '天灵根',
  EARTH: '异灵根',
  HUMAN: '真灵根',
  WASTE: '杂灵根',
};

// 宗门等级中文映射
export const SECT_RANK_LABELS: Record<PrismaSectRank, string> = {
  OUTER: '外门弟子',
  INNER: '内门弟子',
  ELITE: '真传弟子',
  ELDER: '长老',
  MASTER: '掌门',
};

// 修为境界中文映射
export const RANK_LABELS: Record<PrismaRank, string> = {
  MORTAL: '凡人',
  QI_REFINING: '练气期',
  FOUNDATION: '筑基期',
  GOLDEN_CORE: '金丹期',
  NASCENT_SOUL: '元婴期',
  SPIRIT_SEVERING: '化神期',
  VOID_REFINING: '炼虚期',
  MAHAYANA: '大乘期',
  IMMORTAL: '仙人',
};

/**
 * 格式化灵根类型显示
 */
export function formatSpiritRoot(root: PrismaSpiritRootType): string {
  return SPIRIT_ROOT_LABELS[root] || root;
}

/**
 * 格式化宗门等级显示
 */
export function formatSectRank(rank: PrismaSectRank): string {
  return SECT_RANK_LABELS[rank] || rank;
}

/**
 * 格式化修为境界显示
 */
export function formatRank(rank: PrismaRank): string {
  return RANK_LABELS[rank] || rank;
}

/**
 * 格式化数字（添加千分位）
 */
export function formatNumber(num: number): string {
  return num.toLocaleString('zh-CN');
}

/**
 * 格式化百分比
 */
export function formatPercent(value: number, decimals: number = 1): string {
  return `${(value * 100).toFixed(decimals)}%`;
}