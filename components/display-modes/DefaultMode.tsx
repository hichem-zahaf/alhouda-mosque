/**
 * Default Mode component - Standard display with all information
 */

'use client';

import { CenterDisplay } from '@/components/center-display/CenterDisplay';
import { PrayerTimes } from '@/components/prayer-times/PrayerTimes';

interface DefaultModeProps {
  className?: string;
}

export function DefaultMode({ className = '' }: DefaultModeProps) {
  return (
    <div className={`space-y-8 ${className}`}>
      <CenterDisplay />
      <PrayerTimes />
    </div>
  );
}
