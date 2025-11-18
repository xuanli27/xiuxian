import { NextRequest, NextResponse } from 'next/server';
import { generateNextEvent } from '@/lib/ai/generators/event-generator';

export async function POST(request: NextRequest) {
  try {
    const context = await request.json();
    
    if (!context.playerState) {
      return NextResponse.json(
        { error: '缺少玩家状态参数' },
        { status: 400 }
      );
    }

    const event = await generateNextEvent(context);
    return NextResponse.json(event);
  } catch (error) {
    console.error('生成事件失败:', error);
    return NextResponse.json(
      { error: '生成事件失败' },
      { status: 500 }
    );
  }
}