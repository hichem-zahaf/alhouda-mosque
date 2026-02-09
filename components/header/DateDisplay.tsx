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
      {/* Date in one line */}
      <div className="text-xl font-semibold flex items-center justify-center gap-4">
        <span>{gregorianDate.fullDate}</span>
        <span>-</span>
        <span>{hijriDate.formattedArabic}</span>
      </div>

      {/* Special day and greeting - if present */}
      {(hijriDate.specialDay || hijriDate.greeting) && (
        <div className="text-sm mt-2">
          {hijriDate.specialDay && (
            <span className="mr-3">{hijriDate.specialDay}</span>
          )}
          {hijriDate.greeting && (
            <span>{hijriDate.greeting}</span>
          )}
        </div>
      )}
    </div>
  );
}
