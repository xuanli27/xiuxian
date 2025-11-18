import { NextRequest, NextResponse } from 'next/server';
import { generateSpiritRootFeedback } from '@/lib/ai/game-generators';

export async function POST(request: NextRequest) {
  try {
    const { chaosScore } = await request.json();
    
    if (typeof chaosScore !== 'number') {
      return NextResponse.json(
        { error: 'Invalid chaos score' },
        { status: 400 }
      );
    }
    
    const feedback = await generateSpiritRootFeedback(chaosScore);
    
    return NextResponse.json({ feedback });
  } catch (error) {
    console.error('Spirit feedback generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate feedback' },
      { status: 500 }
    );
  }
}