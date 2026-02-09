import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface LocationSettings {
  city: string;
  country: string;
  coordinates: Coordinates;
}

export type ArabicFont = 'cairo' | 'amiri' | 'tajawal' | 'ibm-plex';

export interface ThemeColors {
  primary: string;
  dark: string;
  light: string;
  accent: string;
}

export interface ThemeSettings {
  colors: ThemeColors;
  font: ArabicFont;
  background: string | null;
}

export interface IqamaAdjustments {
  Fajr: number;
  Dhuhr: number;
  Asr: number;
  Maghrib: number;
  Isha: number;
}

export interface PrayerSettings {
  calculationMethod: number;
  asrMethod: number;
  iqamaAdjustments: IqamaAdjustments;
  useManualTimes: boolean;
}

export interface SoundSettings {
  enabled: boolean;
  type: 'adhan' | 'notification';
  volume: number;
}

export interface MosqueSettings {
  name: string;
  logo: string | null;
}

export interface DisplaySettings {
  temperatureUnit: 'celsius' | 'fahrenheit';
  showTemperature: boolean;
  showDate: boolean;
  showHijri: boolean;
  quoteIntervalMinutes: number;
  prePrayerWindowMinutes: number;
  adhanDurationMinutes: number;
  postPrayerDurationMinutes: number;
}

export interface Settings {
  mosque: MosqueSettings;
  location: LocationSettings;
  theme: ThemeSettings;
  prayer: PrayerSettings;
  sound: SoundSettings;
  display: DisplaySettings;
}

interface SettingsState {
  settings: Settings;
  isLoading: boolean;
  error: string | null;
  updateSettings: (updates: Partial<Settings>) => void;
  updateMosqueSettings: (mosque: Partial<MosqueSettings>) => void;
  updateLocationSettings: (location: Partial<LocationSettings>) => void;
  updateThemeSettings: (theme: Partial<ThemeSettings>) => void;
  updatePrayerSettings: (prayer: Partial<PrayerSettings>) => void;
  updateSoundSettings: (sound: Partial<SoundSettings>) => void;
  updateDisplaySettings: (display: Partial<DisplaySettings>) => void;
  resetSettings: () => void;
  loadSettingsFromJSON: (json: string) => void;
}

const defaultSettings: Settings = {
  mosque: {
    name: 'مسجد الحودة',
    logo: null,
  },
  location: {
    city: 'Mecca',
    country: 'Saudi Arabia',
    coordinates: {
      lat: 21.4225,
      lng: 39.8262,
    },
  },
  theme: {
    colors: {
      primary: '#1DCD9F',
      dark: '#222222',
      light: '#F1EFEC',
      accent: '#D4C9BE',
    },
    font: 'cairo',
    background: null,
  },
  prayer: {
    calculationMethod: 1, // Muslim World League
    asrMethod: 1, // Shafi
    iqamaAdjustments: {
      Fajr: 10,
      Dhuhr: 10,
      Asr: 10,
      Maghrib: 5,
      Isha: 10,
    },
    useManualTimes: false,
  },
  sound: {
    enabled: true,
    type: 'adhan',
    volume: 0.8,
  },
  display: {
    temperatureUnit: 'celsius',
    showTemperature: true,
    showDate: true,
    showHijri: true,
    quoteIntervalMinutes: 5,
    prePrayerWindowMinutes: 2,
    adhanDurationMinutes: 3,
    postPrayerDurationMinutes: 4,
  },
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      settings: defaultSettings,
      isLoading: false,
      error: null,

      updateSettings: (updates) =>
        set((state) => ({
          settings: { ...state.settings, ...updates },
        })),

      updateMosqueSettings: (mosque) =>
        set((state) => ({
          settings: {
            ...state.settings,
            mosque: { ...state.settings.mosque, ...mosque },
          },
        })),

      updateLocationSettings: (location) =>
        set((state) => ({
          settings: {
            ...state.settings,
            location: { ...state.settings.location, ...location },
          },
        })),

      updateThemeSettings: (theme) =>
        set((state) => ({
          settings: {
            ...state.settings,
            theme: { ...state.settings.theme, ...theme },
          },
        })),

      updatePrayerSettings: (prayer) =>
        set((state) => ({
          settings: {
            ...state.settings,
            prayer: { ...state.settings.prayer, ...prayer },
          },
        })),

      updateSoundSettings: (sound) =>
        set((state) => ({
          settings: {
            ...state.settings,
            sound: { ...state.settings.sound, ...sound },
          },
        })),

      updateDisplaySettings: (display) =>
        set((state) => ({
          settings: {
            ...state.settings,
            display: { ...state.settings.display, ...display },
          },
        })),

      resetSettings: () => set({ settings: defaultSettings, error: null }),

      loadSettingsFromJSON: (jsonString) => {
        try {
          const parsed = JSON.parse(jsonString);
          set({ settings: { ...defaultSettings, ...parsed }, error: null });
        } catch (error) {
          set({ error: 'Invalid JSON format' });
        }
      },
    }),
    {
      name: 'mosque-settings-storage',
    }
  )
);
