import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type SoundType = 'adhan' | 'notification' | 'iqama';

interface AudioState {
  isPlaying: boolean;
  currentSound: SoundType | null;
  volume: number;
  isMuted: boolean;
  hasInteracted: boolean; // Track if user has interacted with the page
  lastPlayed: number | null; // Timestamp of last play
  autoPlayEnabled: boolean;

  play: (sound: SoundType) => void;
  stop: () => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  setHasInteracted: (hasInteracted: boolean) => void;
  setAutoPlayEnabled: (enabled: boolean) => void;
  reset: () => void;
}

export const useAudioStore = create<AudioState>()(
  persist(
    (set) => ({
      isPlaying: false,
      currentSound: null,
      volume: 0.8,
      isMuted: false,
      hasInteracted: false,
      lastPlayed: null,
      autoPlayEnabled: true,

      play: (sound) =>
        set({
          isPlaying: true,
          currentSound: sound,
          lastPlayed: Date.now(),
        }),

      stop: () =>
        set({
          isPlaying: false,
          currentSound: null,
        }),

      setVolume: (volume) =>
        set({
          volume: Math.max(0, Math.min(1, volume)),
          isMuted: volume === 0,
        }),

      toggleMute: () =>
        set((state) => ({
          isMuted: !state.isMuted,
          volume: state.isMuted ? 0.8 : 0,
        })),

      setHasInteracted: (hasInteracted) => set({ hasInteracted }),

      setAutoPlayEnabled: (enabled) => set({ autoPlayEnabled: enabled }),

      reset: () =>
        set({
          isPlaying: false,
          currentSound: null,
          volume: 0.8,
          isMuted: false,
          hasInteracted: false,
          lastPlayed: null,
          autoPlayEnabled: true,
        }),
    }),
    {
      name: 'mosque-audio-storage',
      partialize: (state) => ({
        volume: state.volume,
        isMuted: state.isMuted,
        autoPlayEnabled: state.autoPlayEnabled,
      }),
    }
  )
);
