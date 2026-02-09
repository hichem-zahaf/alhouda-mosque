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
        px-8 py-4 rounded-xl
        bg-secondary/10
        ${className}
      `}
    >
      <Quote className="w-8 h-8 text-primary flex-shrink-0" />
      <div className="flex-1">
        <p className="text-2xl font-semibold text-current text-center leading-relaxed">
          {currentQuote.text}
        </p>
        {currentQuote.source && (
          <p className="text-lg text-secondary text-center mt-2">
            {currentQuote.source}
          </p>
        )}
      </div>
    </div>
  );
}
