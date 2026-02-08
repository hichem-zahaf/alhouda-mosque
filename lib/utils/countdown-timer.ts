/**
 * Countdown timer utilities
 */

import { prayerTimeToDate, formatTime } from '@/lib/prayer-times/aladhan-api';
import type { PrayerName } from '@/store/use-prayer-store';

export interface CountdownInfo {
  totalSeconds: number;
  hours: number;
  minutes: number;
  seconds: number;
  isPast: boolean;
  formatted: string;
  formattedWords: string;
}

/**
 * Calculate countdown to a specific time
 */
export function calculateCountdown(targetTime: string, currentTime: Date = new Date()): CountdownInfo {
  const target = prayerTimeToDate(targetTime, currentTime);
  const diff = target.getTime() - currentTime.getTime();
  const totalSeconds = Math.floor(diff / 1000);
  const isPast = totalSeconds < 0;
  const absSeconds = Math.abs(totalSeconds);

  const hours = Math.floor(absSeconds / 3600);
  const minutes = Math.floor((absSeconds % 3600) / 60);
  const seconds = absSeconds % 60;

  return {
    totalSeconds,
    hours,
    minutes,
    seconds,
    isPast,
    formatted: formatCountdownTime(hours, minutes, seconds),
    formattedWords: formatCountdownWords(hours, minutes, seconds, isPast),
  };
}

/**
 * Calculate countdown to iqama time
 */
export function calculateIqamaCountdown(
  prayerTime: string,
  iqamaTime: string,
  currentTime: Date = new Date()
): CountdownInfo {
  return calculateCountdown(iqamaTime, currentTime);
}

/**
 * Format countdown from seconds directly
 */
export function formatCountdown(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);

  return formatCountdownTime(hours, minutes, seconds);
}

/**
 * Format countdown time as HH:MM:SS
 */
function formatCountdownTime(hours: number, minutes: number, seconds: number): string {
  const h = String(hours).padStart(2, '0');
  const m = String(minutes).padStart(2, '0');
  const s = String(seconds).padStart(2, '0');

  if (hours > 0) {
    return `${h}:${m}:${s}`;
  }
  return `${m}:${s}`;
}

/**
 * Format countdown in Arabic words
 */
function formatCountdownWords(
  hours: number,
  minutes: number,
  seconds: number,
  isPast: boolean
): string {
  const parts: string[] = [];

  if (hours > 0) {
    parts.push(`${toArabicNumerals(hours)} ${hours === 1 ? 'ساعة' : 'ساعات'}`);
  }

  if (minutes > 0) {
    parts.push(`${toArabicNumerals(minutes)} ${minutes === 1 ? 'دقيقة' : 'دقائق'}`);
  }

  if (parts.length === 0 && seconds > 0) {
    return 'أقل من دقيقة';
  }

  const timeStr = parts.length > 0 ? parts.join(' و ') : 'الآن';

  if (isPast) {
    return `منذ ${timeStr}`;
  }

  return timeStr;
}

/**
 * Convert numbers to Arabic numerals
 */
export function toArabicNumerals(num: number | string): string {
  const arabicNumerals = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return String(num).replace(/\d/g, (digit) => arabicNumerals[parseInt(digit)]);
}

/**
 * Check if we're within a pre-prayer window (default 2 minutes)
 */
export function isInPrePrayerWindow(
  prayerTime: string,
  currentTime: Date = new Date(),
  windowMinutes: number = 2
): boolean {
  const target = prayerTimeToDate(prayerTime, currentTime);
  const windowMs = windowMinutes * 60 * 1000;
  const diff = target.getTime() - currentTime.getTime();

  return diff > 0 && diff <= windowMs;
}

/**
 * Check if we're in an adhan window (at prayer time + duration)
 */
export function isInAdhanWindow(
  prayerTime: string,
  currentTime: Date = new Date(),
  durationMinutes: number = 3
): boolean {
  const target = prayerTimeToDate(prayerTime, currentTime);
  const windowMs = durationMinutes * 60 * 1000;
  const diff = currentTime.getTime() - target.getTime();

  return diff >= 0 && diff <= windowMs;
}

/**
 * Check if we're in a post-prayer window
 */
export function isInPostPrayerWindow(
  prayerTime: string,
  currentTime: Date = new Date(),
  adhanDurationMinutes: number = 3,
  postPrayerDurationMinutes: number = 4
): boolean {
  const target = prayerTimeToDate(prayerTime, currentTime);
  const startWindow = adhanDurationMinutes * 60 * 1000;
  const endWindow = (adhanDurationMinutes + postPrayerDurationMinutes) * 60 * 1000;
  const diff = currentTime.getTime() - target.getTime();

  return diff >= startWindow && diff <= endWindow;
}

/**
 * Get the next prayer time
 */
export function getNextPrayer(
  prayers: Array<{ name: PrayerName; time: string }>,
  currentTime: Date = new Date()
): { name: PrayerName; time: string } | null {
  for (const prayer of prayers) {
    const prayerDate = prayerTimeToDate(prayer.time, currentTime);
    if (prayerDate > currentTime) {
      return prayer;
    }
  }

  // If all prayers have passed, return first prayer of next day
  return prayers.length > 0 ? prayers[0] : null;
}
