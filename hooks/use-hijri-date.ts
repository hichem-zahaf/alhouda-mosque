/**
 * Hook for Hijri date
 */

'use client';

import { useState, useEffect } from 'react';
import { toHijri, formatHijriArabic, getSpecialIslamicDay, getIslamicGreeting } from '@/lib/hijri/hijri-converter';

export function useHijriDate() {
  const [hijriDate, setHijriDate] = useState(() => {
    const date = toHijri();
    return {
      ...date,
      formattedArabic: formatHijriArabic(date),
      specialDay: getSpecialIslamicDay(date),
      greeting: getIslamicGreeting(date),
    };
  });

  useEffect(() => {
    // Update at midnight
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const msUntilMidnight = tomorrow.getTime() - now.getTime();

    const timeout = setTimeout(() => {
      const date = toHijri();
      setHijriDate({
        ...date,
        formattedArabic: formatHijriArabic(date),
        specialDay: getSpecialIslamicDay(date),
        greeting: getIslamicGreeting(date),
      });
    }, msUntilMidnight);

    return () => clearTimeout(timeout);
  }, []);

  return hijriDate;
}
