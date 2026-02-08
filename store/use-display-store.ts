import { create } from 'zustand';

export type DisplayMode = 'default' | 'pre-prayer' | 'adhan' | 'post-prayer';

interface DisplayState {
  currentMode: DisplayMode;
  previousMode: DisplayMode;
  modeStartTime: number | null;
  modeDuration: number | null; // in milliseconds
  activePrayer: string | null; // Which prayer triggered the current mode

  setMode: (mode: DisplayMode, prayer?: string) => void;
  setModeDuration: (duration: number) => void;
  resetMode: () => void;
  canTransitionTo: (mode: DisplayMode) => boolean;
}

export const useDisplayStore = create<DisplayState>((set, get) => ({
  currentMode: 'default',
  previousMode: 'default',
  modeStartTime: null,
  modeDuration: null,
  activePrayer: null,

  setMode: (mode, prayer) =>
    set((state) => ({
      previousMode: state.currentMode,
      currentMode: mode,
      modeStartTime: Date.now(),
      activePrayer: prayer || null,
    })),

  setModeDuration: (duration) => set({ modeDuration: duration }),

  resetMode: () =>
    set({
      currentMode: 'default',
      previousMode: 'default',
      modeStartTime: null,
      modeDuration: null,
      activePrayer: null,
    }),

  canTransitionTo: (mode) => {
    const state = get();
    const current = state.currentMode;

    // Define allowed transitions
    const transitions: Record<DisplayMode, DisplayMode[]> = {
      'default': ['pre-prayer', 'adhan'],
      'pre-prayer': ['adhan', 'default'],
      'adhan': ['post-prayer', 'default'],
      'post-prayer': ['default'],
    };

    return transitions[current]?.includes(mode) || false;
  },
}));
