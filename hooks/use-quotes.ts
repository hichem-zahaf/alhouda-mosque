/**
 * Hook for managing quotes display with rotation and conditional injection
 */

'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { getRandomQuote, getQuotes, type QuoteCategory } from '@/lib/quotes/quotes-manager';
import { createEvaluationContext, findMatchingRule } from '@/lib/quotes/conditional-quotes';
import type { Quote } from '@/lib/quotes/quotes-manager';
import type { ConditionalQuoteRule } from '@/lib/quotes/conditional-quotes';

// Default conditional rules (built-in)
const defaultConditionalRules: ConditionalQuoteRule[] = [
  {
    id: 'friday-dhuhr',
    name: 'جمعة - الظهر',
    enabled: true,
    priority: 10,
    conditions: [
      { type: 'day', days: [5] },
      { type: 'prayer', prayers: ['Dhuhr'] },
    ],
    quote: {
      id: 'friday-special',
      text: 'خَيْرُ يَوْمٍ طَلَعَتْ عَلَيْهِ الشَّمْسُ يَوْمُ الْجُمُعَةِ',
      source: 'النبي ﷺ',
    },
  },
  {
    id: 'ramadan-greetings',
    name: 'رمضان كريم',
    enabled: true,
    priority: 8,
    conditions: [
      { type: 'hijri-month', hijriMonths: [9] },
    ],
    quote: {
      id: 'ramadan-mubarak',
      text: 'رَمَضَانُ كَرِيمٌ',
      source: 'تهنئة',
    },
  },
];

export function useQuotes(
  category: QuoteCategory = 'general',
  intervalMinutes: number = 5,
  conditionalRules: ConditionalQuoteRule[] = []
) {
  const [currentQuote, setCurrentQuote] = useState<Quote | null>(null);
  const [isClient, setIsClient] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Get a random quote from general category
  const getRandomQuoteFromGeneral = useCallback((): Quote => {
    const quotes = getQuotes('general');
    const randomIndex = Math.floor(Math.random() * quotes.length);
    return quotes[randomIndex];
  }, []);

  // Update quote based on context
  const updateQuote = useCallback(() => {
    const context = createEvaluationContext();

    // Combine default rules with custom rules
    const allRules = [...defaultConditionalRules, ...conditionalRules].filter(r => r.enabled);

    // Check conditional rules first (priority based)
    const sortedRules = [...allRules].sort((a, b) => b.priority - a.priority);
    for (const rule of sortedRules) {
      if (rule.conditions.length === 0) continue;

      const matches = rule.conditions.every(condition => {
        // Simple matching logic for common conditions
        if (condition.type === 'day' && condition.days) {
          return condition.days.includes(context.currentTime.getDay());
        }
        if (condition.type === 'hijri-month' && condition.hijriMonths) {
          return context.hijriDate && condition.hijriMonths.includes(context.hijriDate.month);
        }
        if (condition.type === 'prayer' && condition.prayers) {
          return (context.currentPrayer && condition.prayers.includes(context.currentPrayer)) ||
                 (context.nextPrayer && condition.prayers.includes(context.nextPrayer));
        }
        return false;
      });

      if (matches && rule.conditions.length > 0) {
        setCurrentQuote(rule.quote);
        return;
      }
    }

    // Fall back to contextual quotes
    const contextualQuote = getRandomQuote(category);
    if (contextualQuote) {
      setCurrentQuote(contextualQuote);
    }
  }, [category, conditionalRules]);

  // Initial quote and periodic updates
  useEffect(() => {
    // Mark as client-side
    setIsClient(true);

    // Set initial random quote only on client
    setCurrentQuote(getRandomQuoteFromGeneral());

    // Update quote periodically
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      updateQuote();
    }, intervalMinutes * 60 * 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [intervalMinutes, updateQuote, getRandomQuoteFromGeneral]);

  // Also update quote when context changes (like day changes)
  useEffect(() => {
    const handleContextChange = () => {
      updateQuote();
    };

    // Check every minute for context changes
    const contextInterval = setInterval(handleContextChange, 60000);

    return () => clearInterval(contextInterval);
  }, [updateQuote]);

  // Manually advance to next quote
  const nextQuote = () => {
    setCurrentQuote(getRandomQuoteFromGeneral());
  };

  return {
    currentQuote,
    nextQuote,
  };
}
