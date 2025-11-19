import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth';
import { createPlayerService } from '@/features/player/service';
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

    try {
      const player = await createPlayerService({
        userId: session.user.id,
        name: session.user.name || '无名修士',
        avatar: avatar,
        spiritRoot: spiritRoot as PrismaSpiritRootType,
        mindState: mindState
      });

      return NextResponse.json({ success: true, player });
    } catch (error) {
      if (error instanceof Error && error.message === '玩家已存在') {
        return NextResponse.json(
          { error: '已创建角色' },
          { status: 400 }
        );
      }
      throw error;
    }

  } catch (error) {
    console.error('创建玩家失败:', error);
    return NextResponse.json(
      { error: '创建玩家失败' },
      { status: 500 }
    );
  }
}