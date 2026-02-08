/**
 * Format date in Arabic
 */

export interface ArabicDate {
  day: string;
  month: string;
  year: string;
  fullDate: string;
  dayName: string;
}

export interface HijriDate {
  day: string;
  month: string;
  year: string;
  fullDate: string;
  monthArabic: string;
}

const ARABIC_MONTHS = [
  'يناير',
  'فبراير',
  'مارس',
  'أبريل',
  'مايو',
  'يونيو',
  'يوليو',
  'أغسطس',
  'سبتمبر',
  'أكتوبر',
  'نوفمبر',
  'ديسمبر',
];

const ARABIC_DAYS = [
  'الأحد',
  'الاثنين',
  'الثلاثاء',
  'الأربعاء',
  'الخميس',
  'الجمعة',
  'السبت',
];

const HIJRI_MONTHS = [
  'محرم',
  'صفر',
  'ربيع الأول',
  'ربيع الآخر',
  'جمادى الأولى',
  'جمادى الآخرة',
  'رجب',
  'شعبان',
  'رمضان',
  'شوال',
  'ذو القعدة',
  'ذو الحجة',
];

/**
 * Format Gregorian date in Arabic
 */
export function formatArabicDate(date: Date = new Date()): ArabicDate {
  const day = String(date.getDate()).padStart(2, '0');
  const month = ARABIC_MONTHS[date.getMonth()];
  const year = String(date.getFullYear());

  return {
    day,
    month,
    year,
    fullDate: `${day} ${month} ${year}`,
    dayName: ARABIC_DAYS[date.getDay()],
  };
}

/**
 * Convert Arabic numbers to Eastern Arabic numerals
 */
export function toArabicNumerals(num: string | number): string {
  const arabicNumerals = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return String(num).replace(/\d/g, (digit) => arabicNumerals[parseInt(digit)]);
}

/**
 * Format time in Arabic (24-hour format)
 */
export function formatArabicTime(date: Date = new Date()): string {
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return toArabicNumerals(`${hours}:${minutes}:${seconds}`);
}

/**
 * Format time in 12-hour format with AM/PM
 */
export function formatArabicTime12Hour(date: Date = new Date()): string {
  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const ampm = hours >= 12 ? 'م' : 'ص'; // مساء/صباح

  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'

  return toArabicNumerals(`${String(hours).padStart(2, '0')}:${minutes} ${ampm}`);
}

/**
 * Format countdown time
 */
export function formatCountdown(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hours > 0) {
    return toArabicNumerals(`${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`);
  }

  return toArabicNumerals(`${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`);
}

/**
 * Format countdown time in words
 */
export function formatCountdownWords(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  const parts: string[] = [];

  if (hours > 0) {
    parts.push(`${toArabicNumerals(hours)} ${hours === 1 ? 'ساعة' : 'ساعات'}`);
  }

  if (minutes > 0) {
    parts.push(`${toArabicNumerals(minutes)} ${minutes === 1 ? 'دقيقة' : 'دقائق'}`);
  }

  if (parts.length === 0) {
    return 'أقل من دقيقة';
  }

  return parts.join(' و ');
}

/**
 * Check if today is Friday
 */
export function isFriday(date: Date = new Date()): boolean {
  return date.getDay() === 5;
}

/**
 * Get Hijri month name in Arabic
 */
export function getHijriMonthName(monthNumber: number): string {
  return HIJRI_MONTHS[monthNumber - 1] || '';
}
