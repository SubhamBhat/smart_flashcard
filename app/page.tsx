'use client';

import { useState, useEffect } from 'react';
import NoteInput from '@/components/NoteInput';
import { generateFlashcards } from '@/app/actions/generate-flashcards';
import FlashcardDeck from '@/components/FlashcardDeck';
import { useToast } from '@/hooks/use-toast';

interface Flashcard {
  id: number;
  question: string;
  answer: string;
  category: 'science' | 'history' | 'language' | 'math' | 'art' | 'technology';
}

const DUMMY_FLASHCARDS: Flashcard[] = [
  {
    id: 1,
    category: 'science',
    question: 'What is photosynthesis?',
    answer: 'Photosynthesis is the process by which plants convert light energy into chemical energy, using carbon dioxide and water to produce glucose and oxygen.'
  },
  {
    id: 2,
    category: 'history',
    question: 'In what year did the American Revolution begin?',
    answer: 'The American Revolution began in 1775 with the Battles of Lexington and Concord in Massachusetts.'
  },
  {
    id: 3,
    category: 'language',
    question: 'What is a metaphor?',
    answer: 'A metaphor is a figure of speech that describes one thing as if it were another, without using "like" or "as" to make the comparison.'
  },
  {
    id: 4,
    category: 'math',
    question: 'What is the Pythagorean theorem?',
    answer: 'The Pythagorean theorem states that in a right triangle, the square of the hypotenuse equals the sum of squares of the other two sides: a² + b² = c².'
  },
  {
    id: 5,
    category: 'art',
    question: 'Who painted the Mona Lisa?',
    answer: 'Leonardo da Vinci painted the Mona Lisa during the Renaissance, likely between 1503 and 1519.'
  },
  {
    id: 6,
    category: 'technology',
    question: 'What does API stand for?',
    answer: 'API stands for Application Programming Interface, a set of rules allowing different software applications to communicate with each other.'
  }
];

export default function App() {
  const { toast } = useToast();
  const [inputText, setInputText] = useState<string>('');
  const [flashcards, setFlashcards] = useState<Flashcard[]>(DUMMY_FLASHCARDS);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [showAnimation, setShowAnimation] = useState<boolean>(true);

  useEffect(() => {
    setShowAnimation(true);
  }, []);

  const handleGenerate = async () => {
    setError('');
    
    if (!inputText.trim()) {
      setError('Please paste some study notes to generate flashcards.');
      return;
    }

    setIsLoading(true);

    try {
      const result = await generateFlashcards(inputText);
      setFlashcards(result.flashcards);
      setShowAnimation(true);
      toast({
        title: "Success!",
        description: "Flashcards generated and saved to database.",
      });
    } catch (err: any) {
      console.error('Generation Error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate flashcards. Please try again.';
      setError(errorMessage);
      setFlashcards([]);
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background text-foreground overflow-hidden">
      {/* Animated background gradient */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-background via-background to-primary/10 pointer-events-none" />
      <div className="fixed inset-0 -z-10 opacity-30 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-accent/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className={`text-center mb-16 transition-all duration-1000 ${showAnimation ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8'}`}>
          <div className="mb-6 inline-flex items-center justify-center px-4 py-2 bg-primary/20 rounded-full border border-primary/30">
            <span className="text-sm font-medium text-primary">AI-Powered Learning</span>
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold mb-4 leading-tight text-balance">
            Smart Flashcard <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">Generator</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Paste your study notes and instantly generate interactive 3D flashcards. Learn smarter, not harder.
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-8 p-4 bg-destructive/10 border border-destructive/30 rounded-lg animate-in fade-in slide-in-from-top-2 duration-500">
            <p className="text-destructive font-medium">{error}</p>
          </div>
        )}

        {/* Note Input Section */}
        <div className={`mb-16 transition-all duration-1000 delay-200 ${showAnimation ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <NoteInput
            inputText={inputText}
            onInputChange={setInputText}
            onGenerate={handleGenerate}
            isLoading={isLoading}
          />
        </div>

        {/* Flashcard Deck Section */}
        {flashcards.length > 0 && (
          <div className={`transition-all duration-1000 delay-300 ${showAnimation ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="mb-12">
              <h2 className="text-3xl font-bold mb-2">
                Generated Flashcards <span className="text-primary">({flashcards.length} cards)</span>
              </h2>
              <p className="text-muted-foreground">Click any card to flip and reveal the answer.</p>
            </div>
            <FlashcardDeck flashcards={flashcards} />
          </div>
        )}
      </div>
    </main>
  );
}
