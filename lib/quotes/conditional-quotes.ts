/**
 * Conditional quotes - quotes that display based on specific conditions
 */

import { Quote, QuoteCategory } from './quotes-manager';
import { PrayerName } from '@/store/use-prayer-store';
import { toHijri } from '@/lib/hijri/hijri-converter';

export interface ConditionalQuoteRule {
  id: string;
  name: string;
  enabled: boolean;
  conditions: QuoteCondition[];
  quote: Quote;
  priority: number; // Higher priority rules take precedence
}

export interface QuoteCondition {
  type: 'time' | 'day' | 'prayer' | 'holiday' | 'hijri-month' | 'custom';
  operator?: 'equals' | 'before' | 'after' | 'between';
  value?: string | number | [string, string]; // For 'between' operator
  days?: number[]; // For 'day' type: 0-6 (Sunday-Saturday)
  prayers?: PrayerName[]; // For 'prayer' type
  hijriMonths?: number[]; // 1-12
}

export interface ConditionalMatch {
  rule: ConditionalQuoteRule;
  matches: boolean;
  reason: string;
}

/**
 * Check if a condition matches
 */
export function evaluateCondition(
  condition: QuoteCondition,
  context: QuoteEvaluationContext
): boolean {
  switch (condition.type) {
    case 'time':
      return evaluateTimeCondition(condition, context);

    case 'day':
      return evaluateDayCondition(condition, context);

    case 'prayer':
      return evaluatePrayerCondition(condition, context);

    case 'holiday':
      return evaluateHolidayCondition(condition, context);

    case 'hijri-month':
      return evaluateHijriMonthCondition(condition, context);

    case 'custom':
      return String(condition.value) === 'true';

    default:
      return false;
  }
}

/**
 * Context for evaluating quote conditions
 */
export interface QuoteEvaluationContext {
  currentTime: Date;
  currentPrayer?: PrayerName | null;
  nextPrayer?: PrayerName | null;
  hijriDate?: {
    day: number;
    month: number;
    year: number;
  };
  isFriday?: boolean;
  isRamadan?: boolean;
}

/**
 * Evaluate time-based condition
 */
function evaluateTimeCondition(
  condition: QuoteCondition,
  context: QuoteEvaluationContext
): boolean {
  const currentHour = context.currentTime.getHours();
  const currentMinute = context.currentTime.getMinutes();
  const currentTimeValue = currentHour * 60 + currentMinute;

  if (!condition.value) return false;

  switch (condition.operator) {
    case 'before': {
      const [hour, minute] = (condition.value as string).split(':').map(Number);
      const targetTime = hour * 60 + minute;
      return currentTimeValue < targetTime;
    }

    case 'after': {
      const [hour, minute] = (condition.value as string).split(':').map(Number);
      const targetTime = hour * 60 + minute;
      return currentTimeValue >= targetTime;
    }

    case 'between': {
      const [start, end] = condition.value as [string, string];
      const [startHour, startMin] = start.split(':').map(Number);
      const [endHour, endMin] = end.split(':').map(Number);
      const startTime = startHour * 60 + startMin;
      const endTime = endHour * 60 + endMin;
      return currentTimeValue >= startTime && currentTimeValue <= endTime;
    }

    case 'equals': {
      const [hour, minute] = (condition.value as string).split(':').map(Number);
      return currentHour === hour && currentMinute === minute;
    }

    default:
      return false;
  }
}

/**
 * Evaluate day-based condition
 */
function evaluateDayCondition(
  condition: QuoteCondition,
  context: QuoteEvaluationContext
): boolean {
  const currentDay = context.currentTime.getDay();

  if (!condition.days || condition.days.length === 0) return false;

  return condition.days.includes(currentDay);
}

/**
 * Evaluate prayer-based condition
 */
function evaluatePrayerCondition(
  condition: QuoteCondition,
  context: QuoteEvaluationContext
): boolean {
  if (!condition.prayers || condition.prayers.length === 0) return false;

  return Boolean(
    (context.currentPrayer && condition.prayers.includes(context.currentPrayer)) ||
    (context.nextPrayer && condition.prayers.includes(context.nextPrayer))
  );
}

/**
 * Evaluate holiday-based condition
 */
function evaluateHolidayCondition(
  condition: QuoteCondition,
  context: QuoteEvaluationContext
): boolean {
  if (!context.hijriDate) return false;

  const { day, month } = context.hijriDate;

  // Eid al-Fitr (1-3 Shawwal)
  if (condition.value === 'eid-fitr') {
    return month === 10 && day >= 1 && day <= 3;
  }

  // Eid al-Adha (10-13 Dhu al-Hijjah)
  if (condition.value === 'eid-adha') {
    return month === 12 && day >= 10 && day <= 13;
  }

  // Ramadan (entire month)
  if (condition.value === 'ramadan') {
    return month === 9;
  }

  // Friday (Jumu'ah)
  if (condition.value === 'friday') {
    return context.isFriday || false;
  }

  return false;
}

/**
 * Evaluate Hijri month condition
 */
function evaluateHijriMonthCondition(
  condition: QuoteCondition,
  context: QuoteEvaluationContext
): boolean {
  if (!context.hijriDate || !condition.hijriMonths) return false;

  return condition.hijriMonths.includes(context.hijriDate.month);
}

/**
 * Find matching conditional quote rule
 */
export function findMatchingRule(
  rules: ConditionalQuoteRule[],
  context: QuoteEvaluationContext
): ConditionalQuoteRule | null {
  // Sort by priority (higher first)
  const sortedRules = [...rules].filter((r) => r.enabled).sort((a, b) => b.priority - a.priority);

  for (const rule of sortedRules) {
    const allMatch = rule.conditions.every((condition) =>
      evaluateCondition(condition, context)
    );

    if (allMatch && rule.conditions.length > 0) {
      return rule;
    }
  }

  return null;
}

/**
 * Create default conditional rules
 */
export function createDefaultConditionalRules(): ConditionalQuoteRule[] {
  return [
    {
      id: 'friday-dhuhr',
      name: 'جمعة - الظهر',
      enabled: true,
      priority: 10,
      conditions: [
        { type: 'day', days: [5] }, // Friday
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
    {
      id: 'fajr-morning',
      name: 'صباح الخير - الفجر',
      enabled: true,
      priority: 5,
      conditions: [
        { type: 'time', operator: 'between', value: ['04:00', '06:00'] },
      ],
      quote: {
        id: 'morning-dhikr',
        text: 'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ',
        source: 'أذكار الصباح',
      },
    },
  ];
}

/**
 * Parse conditional rules from JSON
 */
export function parseConditionalRulesFromJSON(
  jsonString: string
): ConditionalQuoteRule[] | null {
  try {
    const data = JSON.parse(jsonString);

    if (!Array.isArray(data)) {
      return null;
    }

    return data as ConditionalQuoteRule[];
  } catch {
    return null;
  }
}

/**
 * Create evaluation context from current state
 */
export function createEvaluationContext(
  currentTime: Date = new Date(),
  currentPrayer?: PrayerName | null,
  nextPrayer?: PrayerName | null
): QuoteEvaluationContext {
  const hijriDate = toHijri(currentTime);
  const isFriday = currentTime.getDay() === 5;
  const isRamadan = hijriDate.month === 9;

  return {
    currentTime,
    currentPrayer,
    nextPrayer,
    hijriDate,
    isFriday,
    isRamadan,
  };
}
