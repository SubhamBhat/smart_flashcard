'use server';

import { generateText, Output } from 'ai';
import { google } from '@ai-sdk/google';
import { z } from 'zod';
import { getSupabaseServerClient } from '@/lib/supabase';

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
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    if (!apiKey) {
      throw new Error('GOOGLE_GENERATIVE_AI_API_KEY is not set in environment variables');
    }
    console.log('[v0] Generating flashcards from notes:', notes.substring(0, 50) + '...');

    // Use the most stable and widely available Gemini models
    const models = [
      'gemini-1.5-flash',
      'gemini-1.5-pro'
    ];

    let lastError = null;
    let result = null;

    for (const modelId of models) {
      try {
        console.log(`[v0] Attempting with model: ${modelId}`);
        result = await generateText({
          model: google(modelId),
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
        
        if (result) {
          console.log(`[v0] Successfully generated with model: ${modelId}`);
          break;
        }
      } catch (err: any) {
        console.warn(`[v0] Failed with model ${modelId}:`, err?.message || err);
        lastError = err;
      }
    }

    if (!result) {
      throw lastError || new Error('All models failed to generate flashcards');
    }

    console.log('[v0] Generated flashcards successfully');

    // Save to Supabase
    const supabase = getSupabaseServerClient();
    
    // Create a new deck for this session
    const { data: deck, error: deckError } = await supabase
      .from('decks')
      .insert({
        title: `Deck generated at ${new Date().toLocaleString()}`,
        description: `Generated from notes: ${notes.substring(0, 50)}...`,
      })
      .select()
      .single();

    if (deckError) {
      console.error('Error creating deck:', deckError);
      throw new Error('Failed to save flashcards deck to database');
    }

    // Insert flashcards into the database
    const flashcardsToInsert = result.object.flashcards.map((card: any) => ({
      deck_id: deck.id,
      question: card.question,
      answer: card.answer,
      category: 'general', // Default category
    }));

    const { error: flashcardsError } = await supabase
      .from('flashcards')
      .insert(flashcardsToInsert);

    if (flashcardsError) {
      console.error('Error saving flashcards:', flashcardsError);
      throw new Error('Failed to save flashcards to database');
    }

    return {
      deckId: deck.id,
      flashcards: result.object.flashcards,
    };
  } catch (error) {
    console.error('[v0] Error generating flashcards:', error);
    throw new Error(
      error instanceof Error
        ? error.message
        : 'Failed to generate flashcards'
    );
  }
}
