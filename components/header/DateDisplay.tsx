/**
 * Date Display component - Shows Gregorian and Hijri dates
 */

'use client';

import { useCurrentTime } from '@/hooks/use-current-time';
import { useHijriDate } from '@/hooks/use-hijri-date';
import { formatArabicDate } from '@/lib/utils/date-formatter';

interface DateDisplayProps {
  className?: string;
}

export function DateDisplay({ className = '' }: DateDisplayProps) {
  const time = useCurrentTime();
  const hijriDate = useHijriDate();
  const gregorianDate = formatArabicDate(time.date);

  return (
    <div className={`text-center ${className}`}>
      <div className="text-lg font-semibold text-primary">
        {gregorianDate.fullDate}
      </div>
      <div className="text-sm text-accent-d4 mt-1">
        {hijriDate.formattedArabic}
      </div>
      {hijriDate.specialDay && (
        <div className="text-sm text-accent-d4 mt-1 animate-pulse-glow">
          {hijriDate.specialDay}
        </div>
      )}
      {hijriDate.greeting && (
        <div className="text-sm text-primary mt-1">
          {hijriDate.greeting}
        </div>
      )}
    </div>
  );
}
