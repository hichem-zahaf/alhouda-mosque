/**
 * Hook for managing quotes display
 */

'use client';

import { useState, useEffect } from 'react';
import { createQuoteCycler, getContextualQuote, type QuoteCategory } from '@/lib/quotes/quotes-manager';
import { createEvaluationContext, findMatchingRule } from '@/lib/quotes/conditional-quotes';
import type { Quote } from '@/lib/quotes/quotes-manager';
import type { ConditionalQuoteRule } from '@/lib/quotes/conditional-quotes';

export function useQuotes(
  category: QuoteCategory = 'general',
  intervalMinutes: number = 5,
  conditionalRules: ConditionalQuoteRule[] = []
) {
  const [currentQuote, setCurrentQuote] = useState<Quote | null>(() =>
    getContextualQuote({})
  );
  const [quoteCycler, setQuoteCycler] = useState(() => createQuoteCycler(intervalMinutes));

  // Update quote based on context
  useEffect(() => {
    const updateQuote = () => {
      const context = createEvaluationContext();

      // Check conditional rules first
      if (conditionalRules.length > 0) {
        const matchingRule = findMatchingRule(conditionalRules, context);
        if (matchingRule) {
          setCurrentQuote(matchingRule.quote);
          return;
        }
      }

      // Fall back to contextual quotes
      const contextualQuote = getContextualQuote({
        isFriday: context.isFriday,
        isRamadan: context.isRamadan,
      });

      if (contextualQuote) {
        setCurrentQuote(contextualQuote);
      }
    };

    updateQuote();

    // Update quote periodically
    const interval = setInterval(updateQuote, intervalMinutes * 60 * 1000);

    return () => clearInterval(interval);
  }, [intervalMinutes, conditionalRules]);

  // Manually advance to next quote
  const nextQuote = () => {
    const quote = quoteCycler.nextQuote();
    setCurrentQuote(quote);
  };

  return {
    currentQuote,
    nextQuote,
  };
}
