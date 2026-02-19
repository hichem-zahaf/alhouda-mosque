import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type PrayerName = 'Fajr' | 'Dhuhr' | 'Asr' | 'Maghrib' | 'Isha';

export interface PrayerTime {
  name: PrayerName;
  nameArabic: string;
  time: string; // HH:MM format
  iqamaTime: string; // HH:MM format
  isNext: boolean;
  isCurrent: boolean;
}

export interface PrayerInfo {
  name: PrayerName;
  nameArabic: string;
  time: Date;
  iqamaTime: Date;
}

export interface HijriDateInfo {
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
}

interface CachedPrayerData {
  date: string; // YYYY-MM-DD
  calculationMethod: number;
  prayers: PrayerTime[];
  hijriDate: HijriDateInfo | null;
}

interface PrayerState {
  todayPrayers: PrayerTime[];
  nextPrayer: PrayerInfo | null;
  currentPrayer: PrayerInfo | null;
  timeUntilNext: number; // in seconds
  timeUntilIqama: number; // in seconds
  isManualMode: boolean;
  lastUpdated: number | null;
  cachedPrayerData: CachedPrayerData | null; // Cache with date and method
  hijriDate: HijriDateInfo | null; // Hijri date from API
  isLoading: boolean;
  error: string | null;

  setTodayPrayers: (prayers: PrayerTime[]) => void;
  setNextPrayer: (prayer: PrayerInfo | null) => void;
  setCurrentPrayer: (prayer: PrayerInfo | null) => void;
  setTimeUntilNext: (seconds: number) => void;
  setTimeUntilIqama: (seconds: number) => void;
  setManualMode: (isManual: boolean) => void;
  updatePrayerTime: (name: PrayerName, time: string, iqamaTime: string) => void;
  setCachedPrayerData: (data: CachedPrayerData | null) => void;
  setHijriDate: (hijri: HijriDateInfo | null) => void;
  isCachedDataValid: (date: string, method: number) => boolean;
  clearCache: () => void;
  reset: () => void;
}

const defaultPrayerTimes: PrayerTime[] = [
  {
    name: 'Fajr',
    nameArabic: 'الفجر',
    time: '05:00',
    iqamaTime: '05:10',
    isNext: false,
    isCurrent: false,
  },
  {
    name: 'Dhuhr',
    nameArabic: 'الظهر',
    time: '12:30',
    iqamaTime: '12:40',
    isNext: false,
    isCurrent: false,
  },
  {
    name: 'Asr',
    nameArabic: 'العصر',
    time: '15:45',
    iqamaTime: '15:55',
    isNext: false,
    isCurrent: false,
  },
  {
    name: 'Maghrib',
    nameArabic: 'المغرب',
    time: '18:30',
    iqamaTime: '18:35',
    isNext: false,
    isCurrent: false,
  },
  {
    name: 'Isha',
    nameArabic: 'العشاء',
    time: '19:45',
    iqamaTime: '19:55',
    isNext: false,
    isCurrent: false,
  },
];

export const usePrayerStore = create<PrayerState>()(
  persist(
    (set, get) => ({
      todayPrayers: defaultPrayerTimes,
      nextPrayer: null,
      currentPrayer: null,
      timeUntilNext: 0,
      timeUntilIqama: 0,
      isManualMode: false,
      lastUpdated: null,
      cachedPrayerData: null,
      hijriDate: null,
      isLoading: false,
      error: null,

      setTodayPrayers: (prayers) => set({ todayPrayers: prayers }),

      setNextPrayer: (prayer) => set({ nextPrayer: prayer }),

      setCurrentPrayer: (prayer) => set({ currentPrayer: prayer }),

      setTimeUntilNext: (seconds) => set({ timeUntilNext: seconds }),

      setTimeUntilIqama: (seconds) => set({ timeUntilIqama: seconds }),

      setManualMode: (isManual) => set({ isManualMode: isManual }),

      updatePrayerTime: (name, time, iqamaTime) =>
        set((state) => ({
          todayPrayers: state.todayPrayers.map((p) =>
            p.name === name ? { ...p, time, iqamaTime } : p
          ),
        })),

      setCachedPrayerData: (data) => set({ cachedPrayerData: data }),

      setHijriDate: (hijri) => set({ hijriDate: hijri }),

      isCachedDataValid: (date, method) => {
        const cached = get().cachedPrayerData;
        return cached !== null && cached.date === date && cached.calculationMethod === method;
      },

      clearCache: () => set({ cachedPrayerData: null }),

      reset: () =>
        set({
          todayPrayers: defaultPrayerTimes,
          nextPrayer: null,
          currentPrayer: null,
          timeUntilNext: 0,
          timeUntilIqama: 0,
          isManualMode: false,
          lastUpdated: null,
          cachedPrayerData: null,
          hijriDate: null,
          error: null,
        }),
    }),
    {
      name: 'mosque-prayer-storage',
      partialize: (state) => ({
        todayPrayers: state.todayPrayers,
        isManualMode: state.isManualMode,
        lastUpdated: state.lastUpdated,
        cachedPrayerData: state.cachedPrayerData,
        hijriDate: state.hijriDate,
      }),
    }
  )
);
