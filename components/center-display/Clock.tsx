/**
 * Clock component - Large current time display
 */

'use client';

import { useEffect, useState } from 'react';
import { useCurrentTime } from '@/hooks/use-current-time';

interface ClockProps {
  className?: string;
  showSeconds?: boolean;
}

export function Clock({ className = '', showSeconds = true }: ClockProps) {
  const [isClient, setIsClient] = useState(false);
  const time = useCurrentTime();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const formatTime = () => {
    const hours = String(time.hours).padStart(2, '0');
    const minutes = String(time.minutes).padStart(2, '0');
    const seconds = String(time.seconds).padStart(2, '0');

    if (showSeconds) {
      return `${hours}:${minutes}:${seconds}`;
    }
    return `${hours}:${minutes}`;
  };

  // Don't render until client-side to prevent hydration mismatch
  if (!isClient) {
    return (
      <div
        className={`
          text-6xl md:text-[16rem] font-bold text-primary
          tracking-wider
          ${className}
        `}
        style={{
          textShadow: '0 0 30px var(--color-primary)',
        }}
        aria-hidden="true"
      >
        00:00:00
      </div>
    );
  }

  return (
    <div
      className={`
        text-6xl md:text-[16rem] font-bold text-primary
        tracking-wider
        ${className}
      `}
      style={{
        textShadow: '0 0 30px var(--color-primary)',
      }}
    >
      {formatTime()}
    </div>
  );
}
