/**
 * Hook for Hijri date
 */

'use client';

import { useState, useEffect } from 'react';
import { usePrayerStore } from '@/store/use-prayer-store';
import { toHijri, formatHijriArabic, getSpecialIslamicDay, getIslamicGreeting } from '@/lib/hijri/hijri-converter';

export function useHijriDate() {
  const { hijriDate: apiHijriDate } = usePrayerStore();

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
    // Use Hijri date from API if available
    if (apiHijriDate) {
      const hijriMonths = [
        'محرم',
        'صفر',
        'ربيع الأول',
        'ربيع الآخر',
        'جمادى الأولى',
        'جمادى الآخرة',
        'رجب',
        'شعبان',
        'رمضان',
        'شوال',
        'ذو القعدة',
        'ذو الحجة',
      ];

      const day = parseInt(apiHijriDate.day);
      const month = apiHijriDate.month.number;
      const year = parseInt(apiHijriDate.year);

      const dateObj = {
        day,
        month,
        year,
        dayName: '',
        monthName: hijriMonths[month - 1] || hijriMonths[0],
        formatted: `${day} ${hijriMonths[month - 1]} ${year}`,
        formattedShort: `${day}/${month}/${year}`,
      };

      setHijriDate({
        ...dateObj,
        formattedArabic: formatHijriArabic(dateObj),
        specialDay: apiHijriDate.holidays?.[0] || getSpecialIslamicDay(dateObj),
        greeting: getIslamicGreeting(dateObj),
      });
    }
  }, [apiHijriDate]);

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
