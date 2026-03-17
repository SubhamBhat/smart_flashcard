'use server';

import { generateText, Output } from 'ai';
import { z } from 'zod';

const flashcardSchema = z.object({
  flashcards: z.array(
    z.object({
      id: z.number(),
      question: z.string(),
      answer: z.string(),
    })
  ),
});

export async function generateFlashcards(notes: string) {
  try {
    console.log('[v0] Generating flashcards from notes:', notes.substring(0, 50) + '...');

    const result = await generateText({
      model: 'openai/gpt-4o-mini',
      prompt: `You are an expert educator. Generate flashcards from the following study notes. 
      
Create 5-8 flashcards that cover the key concepts and important details. Each flashcard should have a clear question on one side and a concise, informative answer on the other.

Format the response as JSON with this exact structure:
{
  "flashcards": [
    {
      "id": 1,
      "question": "question text",
      "answer": "answer text"
    }
  ]
}

Study Notes:
${notes}`,
      output: Output.object({ schema: flashcardSchema }),
    });

    console.log('[v0] Generated flashcards:', result.object);
    return result.object;
  } catch (error) {
    console.error('[v0] Error generating flashcards:', error);
    throw new Error(
      error instanceof Error
        ? error.message
        : 'Failed to generate flashcards'
    );
  }
}
