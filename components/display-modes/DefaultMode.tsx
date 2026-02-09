/**
 * Default Mode component - Standard display with all information
 */

'use client';

import { Clock } from '@/components/center-display/Clock';
import { CountdownTimer } from '@/components/center-display/CountdownTimer';
import { QuoteDisplay } from '@/components/center-display/QuoteDisplay';
import { PrayerTimes } from '@/components/prayer-times/PrayerTimes';

interface DefaultModeProps {
  className?: string;
}

export function DefaultMode({ className = '' }: DefaultModeProps) {
  return (
    <div className={`flex flex-col ${className}`}>
      {/* Main content area - clock centered, countdown positioned to the left on desktop */}
      <div className="flex-1 flex items-center justify-center relative md:px-0">
        {/* Clock stays centered */}
        <div className="z-10" style={{ paddingTop: '50px' }}>
          <Clock />
        </div>

        {/* Countdown positioned to the left of the clock on desktop, above on mobile */}
        <div className="absolute left-8 top-1/2 transform -translate-y-1/2 hidden md:block">
          <CountdownTimer />
        </div>
      </div>

      {/* Countdown on mobile - above clock */}
      <div className="md:hidden text-center mb-4 px-4">
        <CountdownTimer />
      </div>

      {/* Quote - below clock/countdown */}
      <div className="flex justify-center py-4 md:py-6 md:px-0 px-4">
        <QuoteDisplay />
      </div>

      {/* Prayer times - at bottom with cards */}
      <div className="md:px-0 px-4" style={{ paddingTop: '80px' }}>
        <PrayerTimes />
      </div>
    </div>
  );
}
