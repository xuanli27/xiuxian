'use client';

import { useState } from 'react';
import { useEvent } from '@/features/events/queries';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export function EventDisplay() {
  const { event, isGenerating, triggerNewEvent, processChoice, isProcessing, result } = useEvent();
  const [showResult, setShowResult] = useState(false);

  const handleGenerateEvent = () => {
    setShowResult(false);
    triggerNewEvent();
  };

  const handleChoice = (choiceId: string) => {
    if (event) {
      processChoice({ event, choiceId }, {
        onSuccess: () => {
          setShowResult(true);
        }
      });
    }
  };

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-4">奇遇</h2>
      
      {!event && !isGenerating && (
        <div className="text-center">
          <p className="mb-4">此地似乎风平浪静，要不要四处探索一番，看看有何机缘？</p>
          <Button onClick={handleGenerateEvent}>探索奇遇</Button>
        </div>
      )}

      {isGenerating && <p>正在探索中...</p>}

      {event && !showResult && (
        <div>
          <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
          <p className="mb-4 whitespace-pre-wrap">{event.description}</p>
          <div className="flex flex-col space-y-2">
            {event.choices.map((choice: { id: string; text: string }) => (
              <Button key={choice.id} onClick={() => handleChoice(choice.id)} disabled={isProcessing}>
                {choice.text}
              </Button>
            ))}
          </div>
        </div>
      )}

      {isProcessing && <p>正在抉择中...</p>}

      {showResult && result && (
        <div>
          <h3 className="text-xl font-semibold mb-2">尘埃落定</h3>
          <p className="mb-4 whitespace-pre-wrap">{result.result.narration}</p>
          <Button onClick={handleGenerateEvent} disabled={isGenerating}>
            继续探索
          </Button>
        </div>
      )}
    </Card>
  );
}