import { generateAIText } from '@/lib/ai/client';
import { GENERATE_STRUCTURED_EVENT } from '@/lib/ai/prompts';
import { aiGeneratedEventSchema } from '@/features/events/schemas';
import type { z } from 'zod';

type AIEvent = z.infer<typeof aiGeneratedEventSchema>;

/**
 * Generates the next game event using AI.
 * Includes retry logic to ensure valid JSON output.
 * @param playerContext - The current state of the player.
 * @param maxRetries - The maximum number of retries.
 * @returns The generated event object.
 */
export async function generateNextEvent(
  playerContext: object,
  maxRetries: number = 3
): Promise<AIEvent> {
  let lastError: Error | null = null;

  for (let i = 0; i < maxRetries; i++) {
    try {
      const prompt = GENERATE_STRUCTURED_EVENT(playerContext);
      const rawResponse = await generateAIText(prompt);

      // Clean the response by removing markdown fences
      const jsonString = rawResponse.replace(/```json\n|```/g, '').trim();
      
      // Parse and validate the JSON
      const parsedEvent = JSON.parse(jsonString);
      const validatedEvent = aiGeneratedEventSchema.parse(parsedEvent);

      return validatedEvent;
    } catch (error) {
      console.error(`AI event generation attempt ${i + 1} failed:`, error);
      if (error instanceof Error) {
        lastError = error;
      }
    }
  }

  // If all retries fail, throw an error
  if (lastError) {
    throw new Error(`Failed to generate a valid event after ${maxRetries} attempts. Last error: ${lastError.message}`);
  } else {
    throw new Error(`Failed to generate a valid event after ${maxRetries} attempts.`);
  }
}