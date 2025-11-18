import { generateAIText } from '@/lib/ai/client';
import { GENERATE_STRUCTURED_TASK } from '@/lib/ai/prompts';
import { aiGeneratedTaskSchema } from '@/features/tasks/schemas';

/**
 * Generates the next task for a player using the AI model.
 * It includes retry logic to handle potential parsing or validation errors.
 *
 * @param playerContext - The current state of the player to be sent to the AI.
 * @param maxRetries - The maximum number of times to retry on failure.
 * @returns A promise that resolves to a validated AI-generated task.
 */
export async function generateNextTask(playerContext: object, maxRetries: number = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const prompt = GENERATE_STRUCTURED_TASK(playerContext);
      const rawResponse = await generateAIText(prompt);

      // Clean the response by removing markdown code blocks
      const jsonString = rawResponse.replace(/```json\n|```/g, '').trim();
      
      const parsedTask = JSON.parse(jsonString);

      // Validate the parsed object against our Zod schema
      return aiGeneratedTaskSchema.parse(parsedTask);

    } catch (error) {
      console.error(`AI task generation attempt ${i + 1} failed.`, { error, playerContext });
      if (i === maxRetries - 1) {
        throw new Error('Failed to generate a valid task from AI after multiple retries.');
      }
    }
  }
  // This line should be unreachable
  throw new Error('Exited task generation loop unexpectedly.');
}