/**
 * Hook for tracking current time with updates
 */

import { useState, useEffect } from 'react';

export interface CurrentTime {
  hours: number;
  minutes: number;
  seconds: number;
  formatted: string;
  formatted12Hour: string;
  date: Date;
}

export function useCurrentTime(updateInterval: number = 1000): CurrentTime {
  const [time, setTime] = useState<CurrentTime>(() => getCurrentTime());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(getCurrentTime());
    }, updateInterval);

    return () => clearInterval(interval);
  }, [updateInterval]);

  return time;
}

function getCurrentTime(): CurrentTime {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();

  return {
    hours,
    minutes,
    seconds,
    formatted: formatTime(hours, minutes, seconds),
    formatted12Hour: formatTime12Hour(hours, minutes, seconds),
    date: now,
  };
}

function formatTime(hours: number, minutes: number, seconds: number): string {
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function formatTime12Hour(hours: number, minutes: number, seconds: number): string {
  const period = hours >= 12 ? 'م' : 'ص';
  const displayHours = hours % 12 || 12;
  return `${String(displayHours).padStart(2, '0')}:${String(minutes).padStart(2, '0')} ${period}`;
}
