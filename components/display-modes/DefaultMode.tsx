/**
 * Default Mode component - Standard display with all information
 */

'use client';

import { Clock } from '@/components/center-display/Clock';
import { CountdownTimer } from '@/components/center-display/CountdownTimer';
import { QuoteDisplay } from '@/components/center-display/QuoteDisplay';
import { PrayerTimesSimple } from '@/components/prayer-times/PrayerTimesSimple';

interface DefaultModeProps {
  className?: string;
}

export function DefaultMode({ className = '' }: DefaultModeProps) {
  return (
    <div className={`flex flex-col ${className}`}>
      {/* Main content area - clock, countdown, quote */}
      <div className="flex-1 flex items-center justify-center">
        <div className="flex items-center gap-16">
          {/* Clock - centered */}
          <Clock />

          {/* Countdown - on the right of time */}
          <CountdownTimer />
        </div>
      </div>

      {/* Quote - below clock/countdown */}
      <div className="flex justify-center py-8">
        <QuoteDisplay />
      </div>

      {/* Prayer times - at bottom, simple display without cards */}
      <div className="py-8">
        <PrayerTimesSimple />
      </div>
    </div>
  );
}
