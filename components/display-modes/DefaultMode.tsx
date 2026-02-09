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
      {/* Main content area - clock centered, countdown positioned to the left */}
      <div className="flex-1 flex items-center justify-center relative">
        {/* Clock stays centered */}
        <div className="z-10" style={{ paddingTop: '50px !important' }}>
          <Clock />
        </div>

        {/* Countdown positioned to the left of the clock */}
        <div className="absolute left-8 top-1/2 transform -translate-y-1/2">
          <CountdownTimer />
        </div>
      </div>

      {/* Quote - below clock/countdown */}
      <div className="flex justify-center py-6">
        <QuoteDisplay />
      </div>

      {/* Prayer times - at bottom, simple display without cards */}
      <div className="" style={{ paddingTop: '100px !important' }}>  
        <PrayerTimesSimple />
      </div>
    </div>
  );
}
