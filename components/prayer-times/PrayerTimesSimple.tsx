/**
 * Prayer Times component - Simple display without cards
 */

'use client';

import { usePrayerTimes } from '@/hooks/use-prayer-times';
import { isFriday } from '@/lib/utils/date-formatter';

interface PrayerTimesSimpleProps {
  className?: string;
}

export function PrayerTimesSimple({ className = '' }: PrayerTimesSimpleProps) {
  const { todayPrayers, isLoading, error } = usePrayerTimes();

  if (isLoading) {
    return (
      <div className={`text-center ${className}`}>
        <div className="text-xl text-current">جاري تحميل أوقات الصلاة...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`text-center ${className}`}>
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
    <div className={`grid grid-cols-5 gap-8 text-center ${className}`}>
      {displayPrayers.map((prayer) => (
        <div key={prayer.name} className="flex flex-col">
          {/* Prayer name */}
          <h3 className="text-3xl font-bold mb-2 text-primary">
            {prayer.nameArabic}
          </h3>

          {/* Prayer time */}
          <div className="text-5xl font-semibold mb-1 text-current">
            {prayer.time}
          </div>

          {/* Iqama time */}
          <div className="text-xl text-secondary">
            الإقامة: {prayer.iqamaTime}
          </div>

          {/* Countdown if not current */}
          {!prayer.isCurrent && (
            <div className="text-sm mt-1 text-secondary">
              الباقي: {getCountdown(prayer.time)}
            </div>
          )}

          {/* Next prayer indicator */}
          {prayer.isNext && (
            <div className="text-sm font-semibold mt-1 text-primary">
              ← القادم
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function getCountdown(prayerTime: string): string {
  const now = new Date();
  const [hours, minutes] = prayerTime.split(':').map(Number);
  const prayerDate = new Date(now);
  prayerDate.setHours(hours, minutes, 0, 0);

  const diff = prayerDate.getTime() - now.getTime();
  const totalSeconds = Math.floor(diff / 1000);

  if (totalSeconds < 0) return '00:00';

  const hrs = Math.floor(totalSeconds / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);

  if (hrs > 0) {
    return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
  }
  return `${String(mins).padStart(2, '0')}:${String(Math.floor(totalSeconds % 60)).padStart(2, '0')}`;
}
