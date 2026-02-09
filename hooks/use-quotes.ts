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

/**
 * Calculate rotation duration based on quote length
 * Short quotes (< 50 chars): 3 seconds
 * Long quotes (>= 50 chars): 5 seconds
 */
function calculateQuoteDuration(quote: Quote): number {
  const textLength = quote.text.length;
  return textLength < 50 ? 3000 : 5000; // 3 or 5 seconds in milliseconds
}

export function useQuotes(
  category: QuoteCategory = 'general',
  intervalMinutes: number = 5,
  conditionalRules: ConditionalQuoteRule[] = []
) {
  const [currentQuote, setCurrentQuote] = useState<Quote | null>(null);
  const [isClient, setIsClient] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const currentDurationRef = useRef<number>(3000); // Current rotation duration

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
    const initialQuote = getRandomQuoteFromGeneral();
    setCurrentQuote(initialQuote);
    currentDurationRef.current = calculateQuoteDuration(initialQuote);

    // Update quote periodically with dynamic duration based on quote length
    const scheduleNextQuote = () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }

      const newQuote = getRandomQuoteFromGeneral();
      setCurrentQuote(newQuote);
      const duration = calculateQuoteDuration(newQuote);
      currentDurationRef.current = duration;

      intervalRef.current = setInterval(scheduleNextQuote, duration);
    };

    // Start the rotation
    intervalRef.current = setInterval(scheduleNextQuote, currentDurationRef.current);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [getRandomQuoteFromGeneral]);

  // Also update quote when context changes (like day changes)
  useEffect(() => {
    const handleContextChange = () => {
      updateQuote();
      // Update duration based on new quote
      if (currentQuote) {
        const newDuration = calculateQuoteDuration(currentQuote);
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
        currentDurationRef.current = newDuration;
        intervalRef.current = setInterval(handleContextChange, newDuration);
      }
    };

    // Check every minute for context changes
    const contextInterval = setInterval(handleContextChange, 60000);

    return () => clearInterval(contextInterval);
  }, [updateQuote, currentQuote]);

  // Manually advance to next quote
  const nextQuote = () => {
    setCurrentQuote(getRandomQuoteFromGeneral());
  };

  return {
    currentQuote,
    nextQuote,
  };
}
