/**
 * Hijri calendar conversion utility
 */

export interface HijriDate {
  day: number;
  month: number;
  year: number;
  dayName: string;
  monthName: string;
  formatted: string;
  formattedShort: string;
}

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

const HIJRI_DAYS = [
  'الأحد',
  'الاثنين',
  'الثلاثاء',
  'الأربعاء',
  'الخميس',
  'الجمعة',
  'السبت',
];

/**
 * Convert Gregorian date to Hijri (approximate calculation)
 * Uses the algorithm from the Umm al-Qura calendar
 */
export function toHijri(gregorianDate: Date = new Date()): HijriDate {
  // This is an approximation - for production, consider using a more accurate library
  // or integrate with an API like Aladhan which provides Hijri dates

  const jd = Math.floor(gregorianDate.getTime() / 86400000) + 2440587.5;
  const l = jd - 1948440 + 10632;
  const n = Math.floor((l - 1) / 10631);
  const lp = l - 10631 * n + 354;
  const j = Math.floor((10985 - lp) / 5316) * Math.floor((50 * lp) / 17719) + Math.floor(lp / 5670) * Math.floor((43 * lp) / 15238);
  const lpp = lp - Math.floor((30 - j) / 15) * Math.floor((17719 * j) / 50) - Math.floor(j / 16) * Math.floor((15238 * j) / 43) + 29;
  const m = Math.floor((24 * lpp) / 709);
  const d = lpp - Math.floor((709 * m) / 24);
  const y = 30 * n + j - 30;

  return {
    day: d,
    month: m + 1, // 1-indexed
    year: y,
    dayName: HIJRI_DAYS[gregorianDate.getDay()],
    monthName: HIJRI_MONTHS[m],
    formatted: `${d} ${HIJRI_MONTHS[m]} ${y}`,
    formattedShort: `${d}/${m + 1}/${y}`,
  };
}

/**
 * Format Hijri date with Arabic numerals
 */
export function formatHijriArabic(hijriDate: HijriDate): string {
  const arabicNumerals = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  const toArabic = (num: number) => String(num).replace(/\d/g, (d) => arabicNumerals[parseInt(d)]);

  return `${toArabic(hijriDate.day)} ${hijriDate.monthName} ${toArabic(hijriDate.year)}`;
}

/**
 * Check if current date is a special Islamic day
 */
export function getSpecialIslamicDay(hijriDate: HijriDate): string | null {
  const specialDays: Record<string, string> = {
    '1-1': 'رأس السنة الهجرية',
    '10-1': 'يوم عاشوراء',
    '9-1': 'يوم عرفة',
    '10-12': 'عيد الأضحى',
    '11-12': 'عيد الأضحى',
    '12-12': 'عيد الأضحى',
    '1-9': 'ليلة القدر',
    '27-9': 'ليلة القدر',
    '1-10': 'عيد الفطر',
    '2-10': 'عيد الفطر',
    '3-10': 'عيد الفطر',
  };

  const key = `${hijriDate.day}-${hijriDate.month}`;
  return specialDays[key] || null;
}

/**
 * Get Islamic greeting based on Hijri month
 */
export function getIslamicGreeting(hijriDate: HijriDate): string | null {
  const greetings: Record<number, string> = {
    9: 'رمضان كريم',
    10: 'عيدكم مبارك',
    12: 'عيدكم مبارك',
  };

  return greetings[hijriDate.month] || null;
}

/**
 * Calculate days until next special Islamic day
 */
export function getDaysUntilNextSpecialDay(currentHijri: HijriDate): {
  days: number;
  occasion: string;
} | null {
  const specialDays = [
    { month: 1, day: 1, name: 'رأس السنة الهجرية' },
    { month: 1, day: 10, name: 'يوم عاشوراء' },
    { month: 9, day: 1, name: 'بداية رمضان' },
    { month: 10, day: 1, name: 'عيد الفطر' },
    { month: 12, day: 10, name: 'عيد الأضحى' },
  ];

  // Find next special day
  for (const special of specialDays) {
    if (special.month > currentHijri.month || (special.month === currentHijri.month && special.day > currentHijri.day)) {
      const daysUntil = (special.month - currentHijri.month) * 30 + (special.day - currentHijri.day);
      return {
        days: daysUntil,
        occasion: special.name,
      };
    }
  }

  // If no special days found in current year, look to next year
  const firstSpecial = specialDays[0];
  const daysUntil = (12 - currentHijri.month) * 30 + (firstSpecial.day - currentHijri.day);

  return {
    days: daysUntil,
    occasion: firstSpecial.name,
  };
}
