import Flashcard from './Flashcard';

interface FlashcardData {
  id: number;
  question: string;
  answer: string;
  category: 'science' | 'history' | 'language' | 'math' | 'art' | 'technology';
}

interface FlashcardDeckProps {
  flashcards: FlashcardData[];
}

export default function FlashcardDeck({ flashcards }: FlashcardDeckProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 auto-rows-max">
      {flashcards.map((card, index) => (
        <div
          key={card.id}
          className="animate-in fade-in slide-in-from-bottom-4 duration-500"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <Flashcard
            id={card.id}
            question={card.question}
            answer={card.answer}
            category={card.category}
          />
        </div>
      ))}
    </div>
  );
}
