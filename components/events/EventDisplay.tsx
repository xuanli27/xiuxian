'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import type { GameEvent } from '@/types/events';

interface EventDisplayProps {
  event: GameEvent;
  onChoiceSelect: (choiceId: string) => Promise<void>;
  isProcessing?: boolean;
}

export function EventDisplay({ event, onChoiceSelect, isProcessing = false }: EventDisplayProps) {
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);

  const handleChoice = async (choiceId: string) => {
    setSelectedChoice(choiceId);
    await onChoiceSelect(choiceId);
    setSelectedChoice(null);
  };

  return (
    <Card className="max-w-2xl mx-auto p-6">
      <div className="space-y-6">
        {/* 事件标题 */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-purple-600">{event.content.title}</h2>
          <div className="mt-2 inline-block px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
            {event.eventType === 'MAJOR' && '重大事件'}
            {event.eventType === 'MINOR' && '日常小事'}
            {event.eventType === 'CHAIN' && '连锁事件'}
          </div>
        </div>

        {/* 事件图片 */}
        {event.content.imageUrl && (
          <div className="rounded-lg overflow-hidden">
            <img 
              src={event.content.imageUrl} 
              alt={event.content.title}
              className="w-full h-64 object-cover"
            />
          </div>
        )}

        {/* 事件描述 */}
        <div className="prose prose-purple max-w-none">
          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
            {event.content.description}
          </p>
        </div>

        {/* 选项列表 */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-800">你的选择：</h3>
          {event.choices.map((choice) => (
            <Button
              key={choice.id}
              onClick={() => handleChoice(choice.id)}
              disabled={isProcessing}
              variant={selectedChoice === choice.id ? 'primary' : 'outline'}
              className="w-full text-left justify-start h-auto py-4 px-6"
            >
              <span className="text-base">{choice.text}</span>
            </Button>
          ))}
        </div>

        {/* 处理中提示 */}
        {isProcessing && (
          <div className="text-center text-gray-500 animate-pulse">
            处理中...
          </div>
        )}
      </div>
    </Card>
  );
}