/**
 * Clock component - Large current time display
 */

'use client';

import { useCurrentTime } from '@/hooks/use-current-time';
import { toArabicNumerals } from '@/lib/utils/date-formatter';

interface ClockProps {
  className?: string;
  showSeconds?: boolean;
}

export function Clock({ className = '', showSeconds = true }: ClockProps) {
  const time = useCurrentTime();

  const formatTime = () => {
    const hours = toArabicNumerals(String(time.hours).padStart(2, '0'));
    const minutes = toArabicNumerals(String(time.minutes).padStart(2, '0'));
    const seconds = toArabicNumerals(String(time.seconds).padStart(2, '0'));

    if (showSeconds) {
      return `${hours}:${minutes}:${seconds}`;
    }
    return `${hours}:${minutes}`;
  };

  return (
    <div
      className={`
        text-8xl font-bold text-primary
        tracking-wider
        ${className}
      `}
      style={{
        textShadow: '0 0 30px rgba(29, 205, 159, 0.3)',
      }}
    >
      {formatTime()}
    </div>
  );
}
