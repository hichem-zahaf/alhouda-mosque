/**
 * Theme Store - Manages theme switching and current theme
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Theme {
  id: string;
  name: string;
  type: 'light' | 'dark';
  colors: {
    background: string;
    text: string;
    primary: string;
    secondary: string;
    accent: string;
  };
}

export const themes: Theme[] = [
  // Light themes (4)
  {
    id: 'light-1',
    name: 'فاتح 1',
    type: 'light',
    colors: {
      background: '#F5F0E8',
      text: '#4A4A4A',
      primary: '#1DCD9F',
      secondary: '#2C3E50',
      accent: '#D4A574',
    },
  },
  {
    id: 'light-2',
    name: 'فاتح 2',
    type: 'light',
    colors: {
      background: '#FFF8E7',
      text: '#5D4E37',
      primary: '#C8A951',
      secondary: '#8B7355',
      accent: '#D4B578',
    },
  },
  {
    id: 'light-3',
    name: 'فاتح 3',
    type: 'light',
    colors: {
      background: '#FDF6E3',
      text: '#657B83',
      primary: '#268BD2',
      secondary: '#586E75',
      accent: '#B58900',
    },
  },
  {
    id: 'light-4',
    name: 'فاتح 4',
    type: 'light',
    colors: {
      background: '#BFC9D1',
      text: '#FFFDF1',
      primary: '#FFFDF1',
      secondary: '#7F8C8D',
      accent: '#ECECEC',
    },
  },
  // Dark themes (2)
  {
    id: 'dark-1',
    name: 'داكن 1',
    type: 'dark',
    colors: {
      background: '#1A1A1A',
      text: '#FFEAD3',
      primary: '#1DCD9F',
      secondary: '#A0A0A0',
      accent: '#D4C9BE',
    },
  },
  {
    id: 'dark-2',
    name: 'داكن 2',
    type: 'dark',
    colors: {
      background: '#0D1117',
      text: '#FFEAD3',
      primary: '#58A6FF',
      secondary: '#8B949E',
      accent: '#1F6FEB',
    },
  },
];

interface ThemeState {
  currentThemeIndex: number;
  currentTheme: Theme;
  setTheme: (index: number) => void;
  nextTheme: () => void;
  previousTheme: () => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      currentThemeIndex: 4, // Start with dark-1 (index 4) as default
      currentTheme: themes[4],

      setTheme: (index: number) =>
        set({
          currentThemeIndex: index,
          currentTheme: themes[index],
        }),

      nextTheme: () =>
        set((state) => {
          const nextIndex = (state.currentThemeIndex + 1) % themes.length;
          return {
            currentThemeIndex: nextIndex,
            currentTheme: themes[nextIndex],
          };
        }),

      previousTheme: () =>
        set((state) => {
          const prevIndex = (state.currentThemeIndex - 1 + themes.length) % themes.length;
          return {
            currentThemeIndex: prevIndex,
            currentTheme: themes[prevIndex],
          };
        }),
    }),
    {
      name: 'mosque-theme-storage',
    }
  )
);

// Hook to apply theme to document
export function useApplyTheme() {
  const { currentTheme } = useThemeStore();

  const applyTheme = () => {
    const root = document.documentElement;
    root.style.setProperty('--color-background', currentTheme.colors.background);
    root.style.setProperty('--color-text', currentTheme.colors.text);
    root.style.setProperty('--color-primary', currentTheme.colors.primary);
    root.style.setProperty('--color-secondary', currentTheme.colors.secondary);
    root.style.setProperty('--color-accent', currentTheme.colors.accent);

    // Apply theme class to body for additional styling
    document.body.className = currentTheme.type;
  };

  return { applyTheme };
}
