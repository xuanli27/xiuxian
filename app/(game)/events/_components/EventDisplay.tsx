'use client'

import { GameEvent } from '@/types/events'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'

interface Props {
  event: GameEvent
  onChoiceSelect: (choiceId: string) => void
  isProcessing: boolean
}

export function EventDisplay({ event, onChoiceSelect, isProcessing }: Props) {
  return (
    <div className="max-w-2xl mx-auto">
      <Card className="p-6">
        <div className="space-y-4">
          <div>
            <h2 className="text-2xl font-bold text-content-900 mb-2">
              {event.content.title}
            </h2>
            <p className="text-content-600 leading-relaxed">
              {event.content.description}
            </p>
          </div>

          {event.content.imageUrl && (
            <div className="rounded-lg overflow-hidden">
              <img 
                src={event.content.imageUrl} 
                alt={event.content.title}
                className="w-full h-48 object-cover"
              />
            </div>
          )}

          <div className="space-y-3 pt-4">
            <h3 className="text-lg font-semibold text-content-800">
              你的选择：
            </h3>
            {event.choices.map((choice) => (
              <Button
                key={choice.id}
                onClick={() => onChoiceSelect(choice.id)}
                disabled={isProcessing}
                variant="outline"
                className="w-full text-left justify-start h-auto py-3 px-4"
              >
                <span className="font-medium">{choice.text}</span>
              </Button>
            ))}
          </div>

          {isProcessing && (
            <div className="text-center text-content-500 pt-2">
              处理中...
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}