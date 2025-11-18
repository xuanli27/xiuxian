'use server';

import { prisma } from '@/lib/db/prisma';
import { getCurrentUserId } from '@/lib/auth/guards';
import { cache } from 'react';
import type { Sect } from '@prisma/client';

/**
 * Gets the sect information for the current player.
 */
export const getPlayerSect = cache(async () => {
  const userId = await getCurrentUserId();
  const player = await prisma.player.findUnique({ where: { userId }, select: { id: true } });
  
  if (!player) return null;

  const sectMember = await prisma.sectMember.findUnique({
    where: { playerId: player.id },
    include: {
      sect: {
        include: {
          _count: {
            select: { members: true },
          },
        },
      },
    },
  });

  if (!sectMember) return null;

  return {
    ...sectMember.sect,
    playerRank: sectMember.rank,
    memberCount: sectMember.sect._count.members,
  };
});

/**
 * Gets a list of all sects, with pagination.
 */
export const getAllSects = cache(async ({ page = 1, pageSize = 20 }: { page?: number, pageSize?: number }) => {
  const [sects, totalSects] = await prisma.$transaction([
    prisma.sect.findMany({
      include: {
        _count: {
          select: { members: true },
        },
      },
      orderBy: { reputation: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.sect.count(),
  ]);
  
  // Define a more specific type for the sect with member count
  type SectWithCount = Sect & { _count: { members: number } };

  return {
    sects: (sects as SectWithCount[]).map(s => ({ ...s, memberCount: s._count.members })),
    totalPages: Math.ceil(totalSects / pageSize),
    currentPage: page,
  };
});

/**
 * Gets detailed information about a specific sect.
 */
export const getSectDetails = cache(async (sectId: string) => {
  const sect = await prisma.sect.findUnique({
    where: { id: sectId },
    include: {
      members: {
        include: {
          player: {
            select: {
              id: true,
              name: true,
              avatar: true,
              rank: true,
              level: true,
            },
          },
        },
        orderBy: { joinedAt: 'asc' },
      },
    },
  });

  if (!sect) return null;
  
  return sect;
});