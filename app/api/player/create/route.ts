import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth';
import { prisma } from '@/lib/db/prisma';
import { SpiritRootType as PrismaSpiritRootType } from '@prisma/client';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: '未登录' },
        { status: 401 }
      );
    }

    const { mindState, spiritRoot, avatar } = await request.json();
    
    // 检查是否已有 Player
    const existing = await prisma.player.findUnique({
      where: { userId: session.user.id }
    });
    
    if (existing) {
      return NextResponse.json(
        { error: '已创建角色' },
        { status: 400 }
      );
    }

    // 创建 Player
    const player = await prisma.player.create({
      data: {
        userId: session.user.id,
        name: session.user.name || '无名修士',
        avatar: avatar || '',
        spiritRoot: spiritRoot as PrismaSpiritRootType,
        mindState: mindState || '初入仙途',
        rank: 'QI_REFINING',
        level: 1,
        qi: 0,
        maxQi: 100,
        spiritStones: 100,
      }
    });

    return NextResponse.json({ success: true, player });
  } catch (error) {
    console.error('创建玩家失败:', error);
    return NextResponse.json(
      { error: '创建玩家失败' },
      { status: 500 }
    );
  }
}