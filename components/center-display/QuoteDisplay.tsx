/**
 * Quote Display component
 */

'use client';

import { useQuotes } from '@/hooks/use-quotes';
import { Quote } from 'lucide-react';

interface QuoteDisplayProps {
  className?: string;
  category?: 'general' | 'pre-prayer' | 'post-prayer' | 'friday' | 'ramadan';
}

export function QuoteDisplay({ className = '', category = 'general' }: QuoteDisplayProps) {
  const { currentQuote } = useQuotes(category);

  if (!currentQuote) {
    return null;
  }

  return (
    <div
      className={`
        flex items-center gap-4
        p-6 rounded-xl
        bg-gradient-to-l from-primary/10 to-transparent
        border-r-4 border-primary
        ${className}
      `}
    >
      <Quote className="w-8 h-8 text-primary flex-shrink-0" />
      <div className="flex-1">
        <p className="text-2xl font-semibold text-light-f1 text-center leading-relaxed">
          {currentQuote.text}
        </p>
        {currentQuote.source && (
          <p className="text-lg text-accent-d4 text-center mt-2">
            {currentQuote.source}
          </p>
        )}
      </div>
    </div>
  );
}
