'use server';

import { prisma } from '@/lib/db/prisma';
import { getCurrentUserId } from '@/lib/auth/guards';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { SectRank } from '@prisma/client';
import { SHOP_ITEMS } from './data/shop';

const createSectSchema = z.object({
  name: z.string().min(2, "宗门名称至少需要2个字").max(20, "宗门名称不能超过20个字"),
  description: z.string().min(10, "宗门描述至少需要10个字").max(200, "宗门描述不能超过200个字"),
});

export async function createSect(input: z.infer<typeof createSectSchema>) {
  const userId = await getCurrentUserId();
  const player = await prisma.player.findUnique({
    where: { userId },
    include: { sectMembership: true },
  });

  if (!player) throw new Error("玩家不存在");
  if (player.sectMembership) throw new Error("你已经加入了一个宗门");

  // Validate input
  const validatedInput = createSectSchema.parse(input);

  const newSect = await prisma.$transaction(async (tx) => {
    const sect = await tx.sect.create({
      data: {
        name: validatedInput.name,
        description: validatedInput.description,
        leaderId: player.id,
      },
    });

    await tx.sectMember.create({
      data: {
        playerId: player.id,
        sectId: sect.id,
        rank: SectRank.MASTER, // The creator is the master
      },
    });

    return sect;
  });

  revalidatePath('/(game)/sect');
  return { success: true, sect: newSect };
}

export async function joinSect(sectId: string) {
  const userId = await getCurrentUserId();
  const player = await prisma.player.findUnique({
    where: { userId },
    include: { sectMembership: true },
  });

  if (!player) throw new Error("玩家不存在");
  if (player.sectMembership) throw new Error("你已经加入了一个宗门");

  const sect = await prisma.sect.findUnique({ where: { id: sectId } });
  if (!sect) throw new Error("宗门不存在");

  await prisma.sectMember.create({
    data: {
      playerId: player.id,
      sectId: sectId,
      rank: SectRank.OUTER, // New members start as outer disciples
    },
  });

  revalidatePath('/(game)/sect');
  return { success: true };
}

export async function requestPromotion(input: { playerId: number }) {
  // Placeholder for promotion logic
  const userId = await getCurrentUserId();
  // ... logic ...
  revalidatePath('/(game)/sect');
  return { success: true, message: "Promotion requested (placeholder)" };
}

/**
 * 购买物品
 */
export async function purchaseItem(itemId: string) {
  const userId = await getCurrentUserId();

  const player = await prisma.player.findUnique({
    where: { userId }
  });

  if (!player) {
    throw new Error('玩家不存在');
  }

  const item = SHOP_ITEMS.find(i => i.id === itemId);
  if (!item) {
    throw new Error('商品不存在');
  }

  if (player.contribution < item.price) {
    throw new Error('贡献不足');
  }

  // 扣除贡献并添加物品/效果
  const updateData: any = {
    contribution: {
      decrement: item.price
    }
  };

  // 处理即时效果
  if (item.effect) {
    switch (item.effect.type) {
      case 'ADD_SPIRIT_STONE':
        updateData.spiritStones = { increment: item.effect.value };
        break;
      case 'RESTORE_QI':
        updateData.qi = { increment: item.effect.value };
        break;
      case 'REDUCE_DEMON':
        updateData.innerDemon = { decrement: item.effect.value };
        break;
    }
  }

  const currentInventory = (player.inventory as Record<string, number>) || {};
  const newCount = (currentInventory[itemId] || 0) + 1;

  updateData.inventory = {
    ...currentInventory,
    [itemId]: newCount
  };

  await prisma.player.update({
    where: { id: player.id },
    data: updateData
  });

  revalidatePath('/sect');
  return { success: true, message: `购买 ${item.name} 成功` };
}