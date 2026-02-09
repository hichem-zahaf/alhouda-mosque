/**
 * Countdown Timer component - Compact version for right side of clock
 */

'use client';

import { usePrayerStore } from '@/store';
import { formatCountdown } from '@/lib/utils/countdown-timer';
import { isFriday } from '@/lib/utils/date-formatter';

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
    <div className={`text-center md:text-right ${className}`}>
      {/* Next prayer name */}
      <div className="text-lg md:text-xl font-semibold mb-1 md:mb-2 text-current">
        {prayerName}
      </div>

      {/* Countdown time */}
      <div className="text-4xl md:text-6xl font-bold mb-1 md:mb-2 text-primary">
        {countdown}
      </div>

      {/* Iqama countdown */}
      <div className="text-sm md:text-lg text-secondary">
        الإقامة: {iqamaCountdown}
      </div>
    </div>
  );
}
