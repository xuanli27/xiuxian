import type { GameEvent, EventChoice, EventResult, EventType } from '@/types/events';

export type { GameEvent, EventChoice, EventResult, EventType };

export interface EventContext {
  playerId: number;
  playerState: {
    rank: string;
    level: number;
    qi: number;
    spiritStones: number;
    mindState: string;
  };
  recentEvents: string[];
}

export interface ProcessEventChoiceInput {
  playerId: number;
  eventId: string;
  choiceId: string;
}

export interface EventLogData {
  eventId: string;
  eventType: EventType;
  title: string;
  description: string;
  choiceId?: string;
  choiceText?: string;
  result: EventResult;
}