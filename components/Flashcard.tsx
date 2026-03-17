'use client';

import { useState } from 'react';

interface FlashcardProps {
  id: number;
  question: string;
  answer: string;
  category: 'science' | 'history' | 'language' | 'math' | 'art' | 'technology';
}

const categoryConfig = {
  science: {
    gradient: 'from-emerald-500 via-teal-500 to-cyan-500',
    light: 'from-emerald-50 to-teal-50',
    icon: '🧪',
    label: 'Science'
  },
  history: {
    gradient: 'from-amber-500 via-orange-500 to-red-500',
    light: 'from-amber-50 to-orange-50',
    icon: '📚',
    label: 'History'
  },
  language: {
    gradient: 'from-rose-500 via-pink-500 to-fuchsia-500',
    light: 'from-rose-50 to-pink-50',
    icon: '✍️',
    label: 'Language'
  },
  math: {
    gradient: 'from-violet-500 via-purple-500 to-indigo-500',
    light: 'from-violet-50 to-purple-50',
    icon: '∑',
    label: 'Math'
  },
  art: {
    gradient: 'from-sky-500 via-blue-500 to-indigo-500',
    light: 'from-sky-50 to-blue-50',
    icon: '🎨',
    label: 'Art'
  },
  technology: {
    gradient: 'from-cyan-500 via-blue-500 to-purple-500',
    light: 'from-cyan-50 to-blue-50',
    icon: '💻',
    label: 'Technology'
  }
};

export default function Flashcard({ id, question, answer, category }: FlashcardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const config = categoryConfig[category];

  return (
    <div
      onClick={() => setIsFlipped(!isFlipped)}
      className="h-80 cursor-pointer perspective group transform-gpu"
      style={{
        perspective: '1200px',
      }}
    >
      <div
        className="relative w-full h-full transition-transform duration-700 transform-gpu"
        style={{
          transformStyle: 'preserve-3d',
          transform: isFlipped ? 'rotateY(180deg) scale(1.02)' : 'rotateY(0deg) scale(1)',
        }}
      >
        {/* Front of Card (Question) */}
        <div
          className="absolute w-full h-full bg-white rounded-3xl shadow-xl p-8 flex flex-col items-center justify-center border border-gray-200 group-hover:shadow-2xl group-hover:border-gray-300 transition-all duration-500"
          style={{ backfaceVisibility: 'hidden' }}
        >
          {/* Category badge top left */}
          <div className={`absolute top-6 left-6 flex items-center gap-2 px-4 py-2 bg-gradient-to-r ${config.gradient} rounded-full shadow-md`}>
            <span className="text-lg">{config.icon}</span>
            <span className="text-xs font-bold text-white uppercase tracking-wide">{config.label}</span>
          </div>
          
          {/* Card number top right */}
          <div className={`absolute top-6 right-6 w-10 h-10 rounded-full bg-gradient-to-br ${config.gradient} flex items-center justify-center text-xs font-bold text-white shadow-lg`}>
            {id}
          </div>
          
          {/* Content area with proper top padding to avoid badge overlap */}
          <div className="flex flex-col items-center justify-center h-full w-full pt-12">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Question</span>
            <p className="text-2xl font-bold text-gray-900 text-center leading-relaxed flex-1 flex items-center max-w-lg mt-6">
              {question}
            </p>
            <span className="text-xs text-gray-400 mt-8 flex items-center gap-2 opacity-70 group-hover:opacity-100 transition-opacity">
              <span className="inline-block animate-bounce">👆</span> Click to reveal answer
            </span>
          </div>
        </div>

        {/* Back of Card (Answer) */}
        <div
          className={`absolute w-full h-full bg-gradient-to-br ${config.gradient} rounded-3xl shadow-xl p-8 flex flex-col items-center justify-center border border-white/20 group-hover:shadow-2xl transition-all duration-500`}
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          {/* Shine overlay effect */}
          <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 bg-gradient-to-r from-transparent via-white to-transparent" />
          
          {/* Category badge top left */}
          <div className="absolute top-6 left-6 flex items-center gap-2 px-4 py-2 bg-white/20 rounded-full backdrop-blur-sm">
            <span className="text-lg">{config.icon}</span>
            <span className="text-xs font-bold text-white uppercase tracking-wide">Answer</span>
          </div>
          
          {/* Card number top right */}
          <div className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/25 flex items-center justify-center text-xs font-bold text-white shadow-lg backdrop-blur-sm">
            {id}
          </div>
          
          <span className="text-xs font-semibold text-white/80 mb-8 uppercase tracking-widest">Solution</span>
          <p className="text-lg font-bold text-white text-center leading-relaxed flex-1 flex items-center max-w-lg">
            {answer}
          </p>
          <span className="text-xs text-white/70 mt-8 flex items-center gap-2 opacity-70 group-hover:opacity-100 transition-opacity">
            <span className="inline-block animate-bounce">👆</span> Click to see question
          </span>
        </div>
      </div>
    </div>
  );
}
