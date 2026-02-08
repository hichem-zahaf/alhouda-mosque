/**
 * Prayer Card component
 */

'use client';

import { useCurrentTime } from '@/hooks/use-current-time';
import { calculateCountdown } from '@/lib/utils/countdown-timer';
import { toArabicNumerals } from '@/lib/utils/date-formatter';
import type { PrayerTime } from '@/store/use-prayer-store';

interface PrayerCardProps {
  prayer: PrayerTime;
  className?: string;
}

export function PrayerCard({ prayer, className = '' }: PrayerCardProps) {
  const time = useCurrentTime();

  const getCountdown = () => {
    const countdown = calculateCountdown(prayer.time, time.date);
    return countdown.isPast ? '٠٠:٠٠' : countdown.formatted;
  };

  return (
    <div
      className={`
        relative overflow-hidden
        bg-gradient-to-br from-dark-222/80 to-dark-222/60
        backdrop-blur-sm
        border-2 rounded-xl p-6
        transition-all duration-300
        ${prayer.isNext ? 'border-primary shadow-lg shadow-primary/20' : 'border-primary/30'}
        ${prayer.isCurrent ? 'border-primary/60 ring-4 ring-primary/30' : ''}
        hover:scale-105 hover:shadow-xl
        ${className}
      `}
    >
      {prayer.isNext && (
        <div className="absolute top-0 right-0 bg-primary text-dark-222 text-xs font-bold px-3 py-1 rounded-bl-lg">
          القادم
        </div>
      )}

      <div className="text-center">
        <h3 className="text-2xl font-bold text-primary mb-4">
          {prayer.nameArabic}
        </h3>

        <div className="space-y-2">
          <div>
            <p className="text-sm text-accent-d4 mb-1">الأذان</p>
            <p className="text-3xl font-semibold text-light-f1">
              {toArabicNumerals(prayer.time)}
            </p>
          </div>

          <div className="border-t border-primary/20 pt-2">
            <p className="text-sm text-accent-d4 mb-1">الإقامة</p>
            <p className="text-xl font-medium text-accent-d4">
              {toArabicNumerals(prayer.iqamaTime)}
            </p>
          </div>

          {!prayer.isCurrent && (
            <div className="text-sm text-primary/70 mt-2">
              الباقي: {getCountdown()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
