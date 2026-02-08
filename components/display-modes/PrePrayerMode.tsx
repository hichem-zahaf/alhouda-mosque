/**
 * Pre-Prayer Mode component - Large countdown with phone reminder
 */

'use client';

import { usePrayerStore } from '@/store';
import { useCurrentTime } from '@/hooks/use-current-time';
import { calculateCountdown } from '@/lib/utils/countdown-timer';
import { Bell, PhoneOff } from 'lucide-react';
import { isFriday } from '@/lib/utils/date-formatter';

interface PrePrayerModeProps {
  className?: string;
}

export function PrePrayerMode({ className = '' }: PrePrayerModeProps) {
  const { nextPrayer } = usePrayerStore();
  const time = useCurrentTime();

  if (!nextPrayer) {
    return null;
  }

  const countdown = calculateCountdown(
    time.date.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
    time.date
  );

  const prayerName = isFriday() && nextPrayer.name === 'Dhuhr' ? 'الجمعة' : nextPrayer.nameArabic;

  return (
    <div
      className={`
        flex flex-col items-center justify-center
        min-h-[60vh]
        ${className}
      `}
    >
      <div className="text-center space-y-8">
        {/* Prayer Name */}
        <div className="flex items-center justify-center gap-4">
          <Bell className="w-12 h-12 text-primary animate-pulse" />
          <h2 className="text-5xl font-bold text-primary">
            اقترب وقت {prayerName}
          </h2>
        </div>

        {/* Large Countdown */}
        <div className="py-8">
          <div className="text-[12rem] font-bold text-primary leading-none animate-pulse-glow">
            {countdown.formatted}
          </div>
        </div>

        {/* Phone Reminder */}
        <div className="flex items-center justify-center gap-4 bg-primary/10 border-2 border-primary rounded-2xl px-12 py-6 animate-pulse-glow">
          <PhoneOff className="w-12 h-12 text-primary" />
          <p className="text-4xl font-semibold text-light-f1">
            يُرجَى إيقَافُ الهَوَاتِفِ النَّقَّالَةِ
          </p>
        </div>

        {/* Pre-prayer quote */}
        <div className="mt-8">
          <p className="text-3xl text-accent-d4 font-medium">
            حَيَّ عَلَى الصَّلَاةِ
          </p>
        </div>
      </div>
    </div>
  );
}
