import {
  AladhanResponse,
  AladhanPrayerTimes,
  PrayerTimesCalculationParams,
  CalculationMethod,
  ManualPrayerTimes,
} from './prayer-times.types';
import { PrayerName, PrayerTime } from '@/store/use-prayer-store';

const ALADHAN_API_BASE = 'https://api.aladhan.com/v1';

/**
 * Fetch prayer times from Aladhan API
 */
export async function fetchPrayerTimes(
  params: PrayerTimesCalculationParams
): Promise<AladhanResponse> {
  const { latitude, longitude, method = CalculationMethod.MWL, date } = params;

  const url = new URL(`${ALADHAN_API_BASE}/timings`);
  url.searchParams.append('latitude', latitude.toString());
  url.searchParams.append('longitude', longitude.toString());
  url.searchParams.append('method', method.toString());

  if (date) {
    url.searchParams.append('date', date);
  }

  const response = await fetch(url.toString());

  if (!response.ok) {
    throw new Error(`Aladhan API error: ${response.status} ${response.statusText}`);
  }

  const data: AladhanResponse = await response.json();

  if (data.code !== 200) {
    throw new Error(`Aladhan API returned error: ${data.status}`);
  }

  return data;
}

/**
 * Parse prayer times from API response
 */
export function parsePrayerTimes(
  response: AladhanResponse,
  iqamaAdjustments: Record<PrayerName, number>
): PrayerTime[] {
  const timings = response.data.timings;
  const prayers: PrayerName[] = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

  return prayers.map((prayer) => {
    const time = timings[prayer as keyof AladhanPrayerTimes];
    const iqamaTime = calculateIqamaTime(time, iqamaAdjustments[prayer]);

    return {
      name: prayer,
      nameArabic: getPrayerNameArabic(prayer),
      time: formatTime(time),
      iqamaTime: formatTime(iqamaTime),
      isNext: false,
      isCurrent: false,
    };
  });
}

/**
 * Calculate iqama time based on prayer time and adjustment
 */
export function calculateIqamaTime(
  prayerTime: string,
  adjustmentMinutes: number
): string {
  // Parse time in HH:MM format
  const [hours, minutes] = prayerTime.split(':').map(Number);

  // Create date object
  const date = new Date();
  date.setHours(hours, minutes + adjustmentMinutes, 0, 0);

  // Format back to HH:MM
  return formatTime(`${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`);
}

/**
 * Format time string (remove (XXX) timezone info from API)
 */
export function formatTime(time: string): string {
  // Remove any timezone info like "(EST)" or similar
  return time.replace(/\s*\([^)]*\)\s*$/, '').trim();
}

/**
 * Get Arabic name for prayer
 */
export function getPrayerNameArabic(prayer: PrayerName): string {
  const arabicNames: Record<PrayerName, string> = {
    Fajr: 'الفجر',
    Dhuhr: 'الظهر',
    Asr: 'العصر',
    Maghrib: 'المغرب',
    Isha: 'العشاء',
  };

  return arabicNames[prayer];
}

/**
 * Get Jumu'a (Friday) name for Dhuhr
 */
export function getPrayerNameForDay(prayer: PrayerName, isFriday: boolean): string {
  if (prayer === 'Dhuhr' && isFriday) {
    return 'الجمعة';
  }
  return getPrayerNameArabic(prayer);
}

/**
 * Load manual prayer times from JSON
 */
export async function loadManualPrayerTimes(
  jsonContent: string
): Promise<ManualPrayerTimes[]> {
  try {
    const data = JSON.parse(jsonContent);

    if (!Array.isArray(data)) {
      throw new Error('Manual prayer times must be an array');
    }

    return data as ManualPrayerTimes[];
  } catch (error) {
    throw new Error(`Failed to parse manual prayer times: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Get prayer times for a specific date from manual data
 */
export function getManualPrayerTimesForDate(
  manualTimes: ManualPrayerTimes[],
  date: Date
): ManualPrayerTimes | null {
  const dateString = formatDateForAPI(date);

  return (
    manualTimes.find((entry) => entry.date === dateString) || null
  );
}

/**
 * Format date for API (YYYY-MM-DD)
 */
export function formatDateForAPI(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

/**
 * Convert prayer time string to Date object
 */
export function prayerTimeToDate(time: string, date: Date = new Date()): Date {
  const [hours, minutes] = time.split(':').map(Number);
  const result = new Date(date);
  result.setHours(hours, minutes, 0, 0);
  return result;
}

/**
 * Check if a prayer time has passed
 */
export function hasPrayerTimePassed(prayerTime: string, currentDate: Date = new Date()): boolean {
  const prayerDate = prayerTimeToDate(prayerTime, currentDate);
  return prayerDate <= currentDate;
}
