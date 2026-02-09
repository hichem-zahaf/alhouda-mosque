/**
 * Prayer Card component
 */

'use client';

import { useState } from 'react';
import { useCurrentTime } from '@/hooks/use-current-time';
import { calculateCountdown } from '@/lib/utils/countdown-timer';
import { prayerTimeToDate } from '@/lib/prayer-times/aladhan-api';
import { useThemeStore } from '@/store/use-theme-store';
import type { PrayerTime } from '@/store/use-prayer-store';

interface PrayerCardProps {
  prayer: PrayerTime;
  className?: string;
}

export function PrayerCard({ prayer, className = '' }: PrayerCardProps) {
  const [isAlternateTheme, setIsAlternateTheme] = useState(false);
  const { currentTheme } = useThemeStore();
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
      return 'opacity-40';
    }
    if (prayer.isNext) {
      return 'bg-primary/20 border-primary shadow-lg';
    }
    return 'bg-background/80 border-primary/30';
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
        border-2
        ${getBaseStyles()}
        ${isAlternateTheme && !isPast ? 'bg-accent/20 border-accent' : ''}
        ${prayer.isCurrent ? 'ring-4 ring-primary/30' : ''}
        ${className}
      `}
      style={{
        backgroundColor: isAlternateTheme && !isPast
          ? `${currentTheme.colors.accent}20`
          : prayer.isNext
          ? `${currentTheme.colors.primary}20`
          : `${currentTheme.colors.background}CC`,
        borderColor: isAlternateTheme && !isPast
          ? currentTheme.colors.accent
          : prayer.isNext
          ? currentTheme.colors.primary
          : `${currentTheme.colors.primary}4D`,
      }}
    >
      {prayer.isNext && (
        <div
          className="absolute top-0 right-0 text-black text-xs font-bold px-3 py-1 rounded-bl-lg"
          style={{ backgroundColor: currentTheme.colors.primary }}
        >
          القادم
        </div>
      )}

      <div className="text-center">
        <h3
          className="text-2xl font-bold mb-4"
          style={{ color: currentTheme.colors.primary }}
        >
          {prayer.nameArabic}
        </h3>

        <div className="space-y-2">
          <div>
            <p className="text-sm mb-1" style={{ color: currentTheme.colors.secondary }}>
              الأذان
            </p>
            <p
              className="text-6xl font-black drop-shadow-lg"
              style={{ color: currentTheme.colors.text }}
            >
              {prayer.time}
            </p>
          </div>

          <div
            className="border-t pt-2"
            style={{ borderColor: `${currentTheme.colors.primary}33` }}
          >
            <p className="text-sm mb-1" style={{ color: currentTheme.colors.secondary }}>
              الإقامة
            </p>
            <p
              className="text-4xl font-bold"
              style={{ color: currentTheme.colors.accent }}
            >
              {getIqamaMinutes()}
            </p>
          </div>

          {!prayer.isCurrent && !isPast && (
            <div
              className="text-sm mt-2"
              style={{ color: `${currentTheme.colors.primary}CC` }}
            >
              الباقي: {countdown.formatted}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
