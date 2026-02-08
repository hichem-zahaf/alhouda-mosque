/**
 * Countdown Timer component
 */

'use client';

import { usePrayerStore } from '@/store';
import { formatCountdown, toArabicNumerals } from '@/lib/utils/countdown-timer';
import { isFriday } from '@/lib/utils/date-formatter';
import { Clock } from 'lucide-react';

interface CountdownTimerProps {
  className?: string;
}

export function CountdownTimer({ className = '' }: CountdownTimerProps) {
  const { nextPrayer, timeUntilNext, timeUntilIqama } = usePrayerStore();

  if (!nextPrayer) {
    return null;
  }

  const prayerName = isFriday() && nextPrayer.name === 'Dhuhr' ? 'الجمعة' : nextPrayer.nameArabic;
  const countdown = formatCountdown(Math.max(0, timeUntilNext));
  const iqamaCountdown = formatCountdown(Math.max(0, timeUntilIqama));

  return (
    <div className={`text-center ${className}`}>
      <div className="flex items-center justify-center gap-3 mb-4">
        <Clock className="w-6 h-6 text-primary animate-pulse" />
        <h2 className="text-2xl font-semibold text-accent-d4">
          الوقت حتى {prayerName}
        </h2>
      </div>
      <div className="text-6xl font-bold text-primary mb-4">
        {countdown}
      </div>
      <div className="text-xl text-accent-d4">
        الإقامة: {iqamaCountdown}
      </div>
    </div>
  );
}
