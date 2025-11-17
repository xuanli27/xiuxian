import { cache } from 'react'
import { prisma } from '@/lib/db/prisma'
import type { SectRank } from '@prisma/client'
import type { SectInfo, SectMember, SectStats, ContributionRecord, SectPosition } from './types'

/**
 * 门派系统数据查询函数
 */

/**
 * 获取门派信息
 */
export const getSectInfo = cache(async (): Promise<SectInfo> => {
  // 统计所有玩家
  const totalMembers = await prisma.player.count()
  
  // 计算平均等级
  const players = await prisma.player.findMany({
    select: { level: true }
  })
  
  const averageLevel = players.length > 0
    ? Math.floor(players.reduce((sum, p) => sum + p.level, 0) / players.length)
    : 1

  // 计算总贡献
  const totalContribution = await prisma.player.aggregate({
    _sum: { contribution: true }
  })

  return {
    name: '仙欲宗',
    description: '能坐着绝不站着，能躺着绝不坐着',
    totalMembers,
    averageLevel,
    totalContribution: totalContribution._sum.contribution || 0,
    ranking: 1, // TODO: 实现跨服排名
  }
})

/**
 * 获取玩家的门派等级
 */
export const getPlayerSectRank = cache(async (playerId: number): Promise<SectRank> => {
  const player = await prisma.player.findUnique({
    where: { id: playerId },
    select: { sectRank: true }
  })
  
  return player?.sectRank || 'OUTER'
})

/**
 * 获取门派成员列表
 */
export const getSectMembers = cache(async (
  page: number = 1,
  pageSize: number = 20,
  sortBy: 'CONTRIBUTION' | 'RANK' | 'JOIN_DATE' | 'LAST_ACTIVE' = 'CONTRIBUTION'
): Promise<SectMember[]> => {
  const orderBy: any = {}
  
  switch (sortBy) {
    case 'CONTRIBUTION':
      orderBy.contribution = 'desc'
      break
    case 'RANK':
      orderBy.sectRank = 'desc'
      break
    case 'JOIN_DATE':
      orderBy.createTime = 'desc'
      break
    case 'LAST_ACTIVE':
      orderBy.lastLoginTime = 'desc'
      break
  }

  const players = await prisma.player.findMany({
    select: {
      id: true,
      name: true,
      sectRank: true,
      contribution: true,
      createTime: true,
      lastLoginTime: true,
    },
    orderBy,
    skip: (page - 1) * pageSize,
    take: pageSize,
  })

  return players.map(p => ({
    playerId: p.id,
    playerName: p.name,
    rank: p.sectRank,
    contribution: p.contribution,
    joinedAt: p.createTime,
    lastActiveAt: p.lastLoginTime,
  }))
})

/**
 * 获取玩家门派统计
 */
export const getPlayerSectStats = cache(async (playerId: number): Promise<SectStats> => {
  const player = await prisma.player.findUnique({
    where: { id: playerId },
    select: {
      contribution: true,
      history: true,
    }
  })

  if (!player) {
    return {
      totalContribution: 0,
      contributionRank: 0,
      tasksCompleted: 0,
      donationsTotal: 0,
      currentStreak: 0,
    }
  }

  // 解析历史记录
  const history = Array.isArray(player.history) ? player.history : []
  
  const tasksCompleted = history.filter((r: any) => 
    r.type === 'SECT_MISSION' && r.completed
  ).length

  const donationsTotal = history.filter((r: any) => 
    r.type === 'DONATION'
  ).reduce((sum: number, r: any) => sum + (r.amount || 0), 0)

  // 计算贡献排名
  const higherRanked = await prisma.player.count({
    where: {
      contribution: {
        gt: player.contribution
      }
    }
  })

  return {
    totalContribution: player.contribution,
    contributionRank: higherRanked + 1,
    tasksCompleted,
    donationsTotal,
    currentStreak: 0, // TODO: 实现连续完成任务天数
  }
})

/**
 * 获取门派职位信息
 */
export const getSectPositions = cache(async (): Promise<SectPosition[]> => {
  return [
    {
      rank: 'OUTER',
      name: '外门弟子',
      requiredContribution: 0,
      benefits: ['基础修炼', '接取简单任务'],
      permissions: ['使用公共设施'],
    },
    {
      rank: 'INNER',
      name: '内门弟子',
      requiredContribution: 500,
      benefits: ['中级修炼', '获得灵石补贴', '接取中级任务'],
      permissions: ['使用内门藏书阁', '购买中级物品'],
    },
    {
      rank: 'ELITE',
      name: '精英弟子',
      requiredContribution: 2000,
      benefits: ['高级修炼', '双倍灵石补贴', '接取高级任务'],
      permissions: ['使用精英修炼室', '购买高级物品'],
    },
    {
      rank: 'ELDER',
      name: '长老',
      requiredContribution: 5000,
      benefits: ['顶级修炼', '三倍灵石补贴', '接取任何任务'],
      permissions: ['使用长老殿', '购买稀有物品', '指导弟子'],
    },
    {
      rank: 'MASTER',
      name: '掌门',
      requiredContribution: 10000,
      benefits: ['无上修炼', '五倍灵石补贴', '所有特权'],
      permissions: ['管理宗门', '所有权限'],
    },
  ]
})

/**
 * 获取贡献记录
 */
export const getContributionRecords = cache(async (
  playerId: number,
  limit: number = 20
): Promise<ContributionRecord[]> => {
  const player = await prisma.player.findUnique({
    where: { id: playerId },
    select: { history: true, name: true }
  })

  if (!player) return []

  const history = Array.isArray(player.history) ? player.history : []
  
  const contributionRecords = history
    .filter((r: any) => 
      r.type === 'DONATION' || 
      r.type === 'SECT_MISSION' || 
      r.type === 'EVENT'
    )
    .map((r: any) => ({
      id: r.id || `record_${Date.now()}_${Math.random()}`,
      playerId,
      playerName: player.name,
      amount: r.contribution || 0,
      type: r.type,
      description: r.description || '',
      createdAt: new Date(r.timestamp || Date.now()),
    }))
    .slice(0, limit)

  return contributionRecords
})

/**
 * 检查是否可以晋升
 */
export const canPromote = cache(async (playerId: number): Promise<boolean> => {
  const player = await prisma.player.findUnique({
    where: { id: playerId },
    select: { sectRank: true, contribution: true }
  })

  if (!player) return false

  const positions = await getSectPositions()
  const currentIndex = positions.findIndex(p => p.rank === player.sectRank)
  
  if (currentIndex === -1 || currentIndex >= positions.length - 1) {
    return false // 已是最高职位
  }

  const nextPosition = positions[currentIndex + 1]
  return player.contribution >= nextPosition.requiredContribution
})