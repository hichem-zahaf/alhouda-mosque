/**
 * Quote Display component
 */

'use client';

import { useQuotes } from '@/hooks/use-quotes';
import { Quote } from 'lucide-react';

interface QuoteDisplayProps {
  readonly className?: string;
  readonly category?: 'general' | 'pre-prayer' | 'post-prayer' | 'friday' | 'ramadan';
}

export function QuoteDisplay({ className = '', category = 'general' }: QuoteDisplayProps) {
  const { currentQuote } = useQuotes(category);

  // Don't render anything until we have a quote (prevents hydration mismatch)
  if (!currentQuote) {
    return (
      <div
        className={`
          flex items-center gap-4
          px-8 py-4 rounded-xl
          bg-secondary/10
          ${className}
        `}
        aria-hidden="true"
      >
        <Quote className="w-8 h-8 text-primary flex-shrink-0" />
        <div className="flex-1">
          <p className="text-2xl font-semibold text-current text-center leading-relaxed">
            &nbsp;
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`
        flex items-center gap-4
        px-8 py-4 rounded-xl
        bg-secondary/10
        font-arabic
        ${className}
      `}
    >
      <Quote className="w-8 h-8 text-primary flex-shrink-0" />
      <div className="flex-1">
        <p className="text-2xl font-semibold text-current text-center leading-relaxed font-quran">
          {currentQuote.text}
        </p>
        {currentQuote.source && (
          <p className="text-lg text-secondary text-center mt-2 font-amiri">
            {currentQuote.source}
          </p>
        )}
      </div>
    </div>
  );
}
