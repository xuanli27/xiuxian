import { prisma } from '@/lib/db/prisma'
import { SpiritRootType as PrismaSpiritRootType } from '@prisma/client'

/**
 * Player Service
 * Encapsulates business logic for player management.
 * Can be used by Server Actions, API Routes, or other services.
 */

export type CreatePlayerInput = {
    userId: string
    name: string
    avatar?: string
    spiritRoot: PrismaSpiritRootType
    mindState?: string
}

export async function createPlayerService(input: CreatePlayerInput) {
    // 检查是否已有玩家
    const existing = await prisma.player.findUnique({
        where: { userId: input.userId }
    })

    if (existing) {
        throw new Error('玩家已存在')
    }

    // 创建玩家
    const player = await prisma.player.create({
        data: {
            userId: input.userId,
            name: input.name,
            avatar: input.avatar || '',
            spiritRoot: input.spiritRoot,
            mindState: input.mindState || '初入仙途',
            rank: 'QI_REFINING',
            level: 1,
            qi: 0,
            maxQi: 100,
            spiritStones: 100,
            innerDemon: 0,
            contribution: 0,
            caveLevel: 1,
        }
    })

    return player
}

export async function getPlayerByUserIdService(userId: string) {
    return await prisma.player.findUnique({
        where: { userId }
    })
}
