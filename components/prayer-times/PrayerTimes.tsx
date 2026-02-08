/**
 * Prayer Times component - Grid of all prayer cards
 */

'use client';

import { usePrayerTimes } from '@/hooks/use-prayer-times';
import { PrayerCard } from './PrayerCard';
import { isFriday } from '@/lib/utils/date-formatter';

interface PrayerTimesProps {
  className?: string;
}

export function PrayerTimes({ className = '' }: PrayerTimesProps) {
  const { todayPrayers, isLoading, error } = usePrayerTimes();

  if (isLoading) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <div className="text-xl text-accent-d4">جاري تحميل أوقات الصلاة...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <div className="text-xl text-red-400">خطأ: {error}</div>
      </div>
    );
  }

  // Update prayer names for Friday
  const displayPrayers = todayPrayers.map((prayer) => ({
    ...prayer,
    nameArabic:
      prayer.name === 'Dhuhr' && isFriday() ? 'الجمعة' : prayer.nameArabic,
  }));

  return (
    <div
      className={`
        grid grid-cols-5 gap-4
        ${className}
      `}
    >
      {displayPrayers.map((prayer) => (
        <PrayerCard key={prayer.name} prayer={prayer} />
      ))}
    </div>
  );
}
