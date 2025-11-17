'use server'

import { prisma } from '@/lib/db/prisma'
import { getCurrentUserId } from '@/lib/auth/guards'
import { revalidatePath } from 'next/cache'
import {
  joinSectSchema,
  leaveSectSchema,
  donateSchema,
  requestPromotionSchema,
} from './schemas'
import {
  getNextSectRank,
  getPromotionRequirement,
  calculateContributionFromDonation,
  calculateDailyAllowance,
} from './utils'
import type { PromotionResult } from './types'

/**
 * Sect Server Actions
 */

/**
 * 加入门派
 */
export async function joinSect(input: { playerId: number }) {
  const userId = await getCurrentUserId()
  
  // 验证输入
  const validated = joinSectSchema.parse(input)
  
  // 获取玩家
  const player = await prisma.player.findUnique({
    where: { id: validated.playerId, userId }
  })
  
  if (!player) {
    throw new Error('玩家不存在')
  }
  
  // 设置为外门弟子
  await prisma.player.update({
    where: { id: player.id },
    data: {
      sectRank: 'OUTER',
      history: {
        push: {
          type: 'JOIN_SECT',
          timestamp: new Date().toISOString(),
        }
      }
    }
  })
  
  revalidatePath('/sect')
  
  return {
    success: true,
    message: '成功加入仙欲宗,成为外门弟子!'
  }
}

/**
 * 离开门派
 */
export async function leaveSect(input: {
  playerId: number
  confirm: true
}) {
  const userId = await getCurrentUserId()
  
  // 验证输入
  const validated = leaveSectSchema.parse(input)
  
  // 获取玩家
  const player = await prisma.player.findUnique({
    where: { id: validated.playerId, userId }
  })
  
  if (!player) {
    throw new Error('玩家不存在')
  }
  
  // 离开门派会失去所有贡献
  await prisma.player.update({
    where: { id: player.id },
    data: {
      sectRank: 'OUTER',
      contribution: 0,
      history: {
        push: {
          type: 'LEAVE_SECT',
          timestamp: new Date().toISOString(),
          contributionLost: player.contribution
        }
      }
    }
  })
  
  revalidatePath('/sect')
  
  return {
    success: true,
    message: '已离开门派,所有贡献清零'
  }
}

/**
 * 捐献资源
 */
export async function donateToSect(input: {
  amount: number
  resourceType: 'SPIRIT_STONES' | 'MATERIALS' | 'PILLS'
}) {
  const userId = await getCurrentUserId()
  
  // 验证输入
  const validated = donateSchema.parse(input)
  
  // 获取玩家
  const player = await prisma.player.findUnique({
    where: { userId }
  })
  
  if (!player) {
    throw new Error('玩家不存在')
  }
  
  // 检查资源是否足够
  if (validated.resourceType === 'SPIRIT_STONES') {
    if (player.spiritStones < validated.amount) {
      throw new Error('灵石不足')
    }
  }
  
  // 计算获得的贡献
  const contributionGained = calculateContributionFromDonation(
    validated.amount,
    validated.resourceType
  )
  
  // 更新玩家
  const updateData: any = {
    contribution: {
      increment: contributionGained
    },
    history: {
      push: {
        type: 'DONATION',
        timestamp: new Date().toISOString(),
        resourceType: validated.resourceType,
        amount: validated.amount,
        contribution: contributionGained
      }
    }
  }
  
  if (validated.resourceType === 'SPIRIT_STONES') {
    updateData.spiritStones = {
      decrement: validated.amount
    }
  }
  
  await prisma.player.update({
    where: { id: player.id },
    data: updateData
  })
  
  revalidatePath('/sect')
  
  return {
    success: true,
    contributionGained,
    message: `捐献成功!获得${contributionGained}点贡献`
  }
}

/**
 * 申请晋升
 */
export async function requestPromotion(input: {
  playerId: number
}): Promise<PromotionResult> {
  const userId = await getCurrentUserId()
  
  // 验证输入
  const validated = requestPromotionSchema.parse(input)
  
  // 获取玩家
  const player = await prisma.player.findUnique({
    where: { id: validated.playerId, userId }
  })
  
  if (!player) {
    throw new Error('玩家不存在')
  }
  
  // 检查是否已是最高等级
  const nextRank = getNextSectRank(player.sectRank)
  if (!nextRank) {
    return {
      success: false,
      rankBefore: player.sectRank,
      rankAfter: null,
      message: '您已是掌门,无法继续晋升!'
    }
  }
  
  // 检查贡献是否足够
  const requiredContribution = getPromotionRequirement(player.sectRank)
  
  if (player.contribution < requiredContribution) {
    return {
      success: false,
      rankBefore: player.sectRank,
      rankAfter: null,
      message: `贡献不足!还需${requiredContribution - player.contribution}点贡献`,
      requirements: {
        contributionNeeded: requiredContribution,
        contributionCurrent: player.contribution
      }
    }
  }
  
  // 晋升成功
  await prisma.player.update({
    where: { id: player.id },
    data: {
      sectRank: nextRank,
      history: {
        push: {
          type: 'PROMOTION',
          timestamp: new Date().toISOString(),
          rankBefore: player.sectRank,
          rankAfter: nextRank
        }
      }
    }
  })
  
  revalidatePath('/sect')
  
  return {
    success: true,
    rankBefore: player.sectRank,
    rankAfter: nextRank,
    message: `恭喜!成功晋升为${nextRank}!`
  }
}

/**
 * 领取每日补贴
 */
export async function claimDailyAllowance() {
  const userId = await getCurrentUserId()
  
  // 获取玩家
  const player = await prisma.player.findUnique({
    where: { userId }
  })
  
  if (!player) {
    throw new Error('玩家不存在')
  }
  
  // 检查今天是否已领取
  const history = Array.isArray(player.history) ? player.history : []
  const today = new Date().toDateString()
  const alreadyClaimed = history.some((r: any) => 
    r.type === 'DAILY_ALLOWANCE' && 
    new Date(r.timestamp).toDateString() === today
  )
  
  if (alreadyClaimed) {
    throw new Error('今日已领取补贴')
  }
  
  // 计算补贴金额
  const allowance = calculateDailyAllowance(player.sectRank)
  
  // 发放补贴
  await prisma.player.update({
    where: { id: player.id },
    data: {
      spiritStones: {
        increment: allowance
      },
      history: {
        push: {
          type: 'DAILY_ALLOWANCE',
          timestamp: new Date().toISOString(),
          amount: allowance,
          rank: player.sectRank
        }
      }
    }
  })
  
  revalidatePath('/sect')
  
  return {
    success: true,
    amount: allowance,
    message: `领取成功!获得${allowance}灵石`
  }
}