import { z } from 'zod';
import { processEventChoiceSchema, aiGeneratedEventSchema } from './schemas';
import type { Rank } from '@prisma/client';

/**
 * The type for an AI-generated event, inferred from the Zod schema.
 * This ensures type safety between the AI generation, backend processing, and frontend display.
 */
export type AIEvent = z.infer<typeof aiGeneratedEventSchema>;

/**
 * Input type for processing a player's choice in an event.
 */
export type ProcessEventChoiceInput = z.infer<typeof processEventChoiceSchema>;

/**
 * Event context for AI generation
 */
export type EventContext = {
  playerId: number;
  playerState: {
    rank: Rank;
    level: number;
    qi: number;
    spiritStones: number;
    mindState: string;
  };
  recentEvents: string[];
};