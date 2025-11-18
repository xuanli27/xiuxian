import { z } from 'zod';

export const processEventChoiceSchema = z.object({
  playerId: z.number().int().positive(),
  eventId: z.string().min(1),
  choiceId: z.string().min(1),
});

export const eventContextSchema = z.object({
  playerId: z.number().int().positive(),
  playerState: z.object({
    rank: z.string(),
    level: z.number().int().positive(),
    qi: z.number(),
    spiritStones: z.number().int(),
    mindState: z.string(),
  }),
  recentEvents: z.array(z.string()),
});