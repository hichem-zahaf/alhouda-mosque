import { PrayerName } from '@/store/use-prayer-store';

// Shafaq options for Moonsighting Committee method
export enum Shafaq {
  General = 'general',
  Ahmer = 'ahmer',
  Abyad = 'abyad',
}

// Midnight mode options
export enum MidnightMode {
  Standard = 0,
  Jafari = 1,
}

// Latitude adjustment method for high latitudes
export enum LatitudeAdjustmentMethod {
  MiddleOfNight = 1,
  OneSeventh = 2,
  AngleBased = 3,
}

// Calendar calculation method
export enum CalendarMethod {
  HJCoSA = 'HJCoSA',
  UAQ = 'UAQ',
  DIYANET = 'DIYANET',
  MATHEMATICAL = 'MATHEMATICAL',
}

export interface AladhanPrayerTimes {
  Fajr: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
}

export interface AladhanDateInfo {
  readable: string;
  timestamp: string;
  gregorian: {
    date: string;
    format: string;
    day: string;
    month: {
      number: number;
      en: string;
    };
    year: string;
    designation: {
      abbreviated: string;
      expanded: string;
    };
  };
  hijri: {
    date: string;
    format: string;
    day: string;
    month: {
      number: number;
      en: string;
      ar: string;
    };
    year: string;
    designation: {
      abbreviated: string;
      expanded: string;
    };
    holidays?: string[];
  };
}

export interface AladhanResponse {
  code: number;
  status: string;
  data: {
    timings: AladhanPrayerTimes;
    date: AladhanDateInfo;
    meta: {
      latitude: number;
      longitude: number;
      timezone: string;
      method: {
        id: number;
        name: string;
        params: {
          Fajr: number | string;
          Isha: number | string;
        };
      };
    };
  };
}

export interface PrayerTimesCalculationParams {
  latitude: number;
  longitude: number;
  method?: number;
  asrMethod?: number;
  school?: number; // 0 = Shafi, 1 = Hanafi
  date?: string; // YYYY-MM-DD format
  shafaq?: Shafaq;
  tune?: string; // Comma-separated string of 9 integers
  midnightMode?: MidnightMode;
  latitudeAdjustmentMethod?: LatitudeAdjustmentMethod;
  calendarMethod?: CalendarMethod;
  iso8601?: boolean;
  timezonestring?: string;
  adjustment?: number; // Calendar adjustment days (-2 to +2)
}

export interface ManualPrayerTimes {
  date: string; // YYYY-MM-DD
  prayers: {
    Fajr: string;
    Dhuhr: string;
    Asr: string;
    Maghrib: string;
    Isha: string;
  };
}

export interface IqamaTime {
  prayer: PrayerName;
  originalTime: string;
  iqamaTime: string;
  adjustmentMinutes: number;
}

// Calculation methods from Aladhan API
export enum CalculationMethod {
  MWL = 1, // Muslim World League
  ISNA = 2, // Islamic Society of North America
  Egypt = 3, // Egyptian General Authority of Survey
  Makkah = 4, // Umm Al-Qura University, Makkah
  Karachi = 5, // University of Islamic Sciences, Karachi
  Tehran = 7, // Institute of Geophysics, University of Tehran
  Jafari = 0, // Shia Ithna-Ashari (Jafari)
}

// Asr calculation methods
export enum AsrMethod {
  Shafi = 1, // Shafi, Maliki, Ja'fari, Hanbali
  Hanafi = 2, // Hanafi
}
