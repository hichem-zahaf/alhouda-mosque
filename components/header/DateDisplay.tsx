/**
 * Date Display component - Shows Gregorian and Hijri dates in one line
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
      {/* Date in one line on desktop, stacked on mobile */}
      <div className="text-base md:text-xl font-semibold flex flex-col md:flex-row items-center justify-center gap-1 md:gap-4">
        <span>{gregorianDate.fullDate}</span>
        <span className="hidden md:inline">-</span>
        <span>{hijriDate.formattedArabic}</span>
      </div>

      {/* Special day and greeting - if present */}
      {(hijriDate.specialDay || hijriDate.greeting) && (
        <div className="text-xs md:text-sm mt-1 md:mt-2">
          {hijriDate.specialDay && (
            <span className="ml-0 md:mr-3 block md:inline">{hijriDate.specialDay}</span>
          )}
          {hijriDate.greeting && (
            <span>{hijriDate.greeting}</span>
          )}
        </div>
      )}
    </div>
  );
}
