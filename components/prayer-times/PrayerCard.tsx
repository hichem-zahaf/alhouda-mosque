/**
 * Prayer Card component
 */

'use client';

import { useState } from 'react';
import { useCurrentTime } from '@/hooks/use-current-time';
import { calculateCountdown } from '@/lib/utils/countdown-timer';
import { prayerTimeToDate } from '@/lib/prayer-times/aladhan-api';
import type { PrayerTime } from '@/store/use-prayer-store';

interface PrayerCardProps {
  prayer: PrayerTime;
  className?: string;
}

export function PrayerCard({ prayer, className = '' }: PrayerCardProps) {
  const [isAlternateTheme, setIsAlternateTheme] = useState(false);
  const time = useCurrentTime();

  const countdown = calculateCountdown(prayer.time, time.date);
  const isPast = countdown.isPast;

  // Calculate iqama minutes difference
  const getIqamaMinutes = () => {
    const prayerDate = prayerTimeToDate(prayer.time, time.date);
    const iqamaDate = prayerTimeToDate(prayer.iqamaTime, time.date);
    const diffMs = iqamaDate.getTime() - prayerDate.getTime();
    const diffMinutes = Math.round(diffMs / (1000 * 60));
    return `${diffMinutes}'`;
  };

  const toggleTheme = () => {
    setIsAlternateTheme(!isAlternateTheme);
  };

  // Determine base styling based on prayer state
  const getBaseStyles = () => {
    if (isPast) {
      return 'opacity-50 bg-gradient-to-br from-zinc-800/60 to-zinc-900/40 border-2 border-zinc-700/30';
    }
    if (prayer.isNext) {
      return 'bg-gradient-to-br from-emerald-500/30 to-emerald-600/20 border-2 border-emerald-400 shadow-lg shadow-emerald-500/30';
    }
    return 'bg-gradient-to-br from-zinc-800/80 to-zinc-900/60 border-2 border-emerald-500/30';
  };

  // Apply alternate theme overlay when clicked
  const getThemeStyles = () => {
    if (isAlternateTheme && !isPast) {
      return 'from-blue-500/30 to-purple-600/20 border-blue-400/60 shadow-blue-500/20';
    }
    return '';
  };

  return (
    <div
      onClick={toggleTheme}
      className={`
        relative overflow-hidden
        rounded-xl p-6
        transition-all duration-300
        cursor-pointer
        hover:scale-105 hover:shadow-xl
        bg-gradient-to-br ${getBaseStyles()} ${getThemeStyles()}
        ${prayer.isCurrent ? 'ring-4 ring-emerald-400/30' : ''}
        ${className}
      `}
    >
      {prayer.isNext && (
        <div className="absolute top-0 right-0 bg-emerald-400 text-black text-xs font-bold px-3 py-1 rounded-bl-lg">
          القادم
        </div>
      )}

      <div className="text-center">
        <h3 className="text-2xl font-bold text-emerald-400 mb-4">
          {prayer.nameArabic}
        </h3>

        <div className="space-y-2">
          <div>
            <p className="text-sm text-zinc-400 mb-1">الأذان</p>
            <p className="text-6xl font-black text-white drop-shadow-lg">
              {prayer.time}
            </p>
          </div>

          <div className="border-t border-emerald-500/20 pt-2">
            <p className="text-sm text-zinc-400 mb-1">الإقامة</p>
            <p className="text-4xl font-bold text-emerald-300">
              {getIqamaMinutes()}
            </p>
          </div>

          {!prayer.isCurrent && !isPast && (
            <div className="text-sm text-emerald-400/80 mt-2">
              الباقي: {countdown.formatted}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
