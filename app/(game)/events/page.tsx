'use client';

import { useState, useEffect } from 'react';
import { EventDisplay } from '@/components/events/EventDisplay';
import { processEventChoice } from '@/features/events/actions';
import { generateNextEvent } from '@/lib/ai/generators/event-generator';
import { buildEventContext } from '@/features/events/utils';
import type { GameEvent, EventResult } from '@/types/events';
import { PageHeader } from '@/components/ui/PageHeader';

export default function EventsPage() {
  const [currentEvent, setCurrentEvent] = useState<GameEvent | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<EventResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadInitialEvent();
  }, []);

  const loadInitialEvent = async () => {
    try {
      // TODO: 从服务端获取玩家数据
      const mockContext = {
        playerId: 1,
        playerState: {
          rank: 'QI_REFINING',
          level: 5,
          qi: 150,
          spiritStones: 100,
          mindState: '刚入职',
        },
        recentEvents: [],
      };

      const event = await generateNextEvent(mockContext);
      setCurrentEvent(event);
    } catch (error) {
      console.error('加载事件失败:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChoiceSelect = async (choiceId: string) => {
    if (!currentEvent) return;

    setIsProcessing(true);
    setResult(null);

    try {
      const response = await processEventChoice({
        playerId: 1, // TODO: 从会话获取真实玩家ID
        eventId: currentEvent.id,
        choiceId,
      });

      setResult(response.result);

      // 3秒后加载下一个事件
      setTimeout(async () => {
        await loadInitialEvent();
        setResult(null);
      }, 3000);
    } catch (error) {
      console.error('处理选择失败:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-gray-500">加载中...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader
        title="修仙事件"
        subtitle="在修仙路上，每个选择都会影响你的命运"
      />

      <div className="mt-8">
        {currentEvent && (
          <EventDisplay
            event={currentEvent}
            onChoiceSelect={handleChoiceSelect}
            isProcessing={isProcessing}
          />
        )}

        {result && (
          <div className="mt-6 max-w-2xl mx-auto">
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-green-800 mb-2">结果</h3>
              <p className="text-green-700">{result.narration}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}