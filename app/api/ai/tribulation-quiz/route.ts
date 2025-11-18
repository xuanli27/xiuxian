import { NextRequest, NextResponse } from 'next/server';
import { generateTribulationQuiz } from '@/lib/ai/game-generators';

export async function POST(request: NextRequest) {
  try {
    const { rank } = await request.json();
    
    if (!rank) {
      return NextResponse.json(
        { error: '缺少境界参数' },
        { status: 400 }
      );
    }

    const quiz = await generateTribulationQuiz(rank);
    return NextResponse.json(quiz);
  } catch (error) {
    console.error('生成天劫问答失败:', error);
    return NextResponse.json(
      { error: '生成天劫问答失败' },
      { status: 500 }
    );
  }
}