/**
 * Hook for managing display mode transitions
 */

'use client';

import { useEffect, useCallback } from 'react';
import { useDisplayStore, usePrayerStore } from '@/store';
import { shouldTransitionMode, hasModeExpired, getModeDuration } from '@/lib/utils/display-mode-calculator';
import type { DisplayMode } from '@/store/use-display-store';

export interface DisplayModeConfig {
  prePrayerWindowMinutes?: number;
  adhanDurationMinutes?: number;
  postPrayerDurationMinutes?: number;
}

export function useDisplayMode(config: DisplayModeConfig = {}) {
  const {
    currentMode,
    previousMode,
    modeStartTime,
    setMode,
    setModeDuration,
    resetMode,
  } = useDisplayStore();

  const { todayPrayers } = usePrayerStore();

  const {
    prePrayerWindowMinutes = 2,
    adhanDurationMinutes = 3,
    postPrayerDurationMinutes = 4,
  } = config;

  // Check if mode should transition
  const checkModeTransition = useCallback(() => {
    const prayerList = todayPrayers.map((p) => ({ name: p.name, time: p.time }));
    const now = new Date();

    const { shouldTransition, newMode, activePrayer } = shouldTransitionMode(
      currentMode,
      prayerList,
      now,
      {
        prePrayerWindowMinutes,
        adhanDurationMinutes,
        postPrayerDurationMinutes,
      }
    );

    if (shouldTransition && newMode) {
      const duration = getModeDuration(newMode, {
        prePrayerWindowMinutes,
        adhanDurationMinutes,
        postPrayerDurationMinutes,
      });

      setMode(newMode, activePrayer || undefined);
      setModeDuration(duration);
    }
  }, [
    currentMode,
    todayPrayers,
    prePrayerWindowMinutes,
    adhanDurationMinutes,
    postPrayerDurationMinutes,
    setMode,
    setModeDuration,
  ]);

  // Check if current mode has expired
  const checkModeExpiration = useCallback(() => {
    if (currentMode !== 'default' && hasModeExpired(currentMode, modeStartTime, new Date(), {
      prePrayerWindowMinutes,
      adhanDurationMinutes,
      postPrayerDurationMinutes,
    })) {
      resetMode();
    }
  }, [
    currentMode,
    modeStartTime,
    prePrayerWindowMinutes,
    adhanDurationMinutes,
    postPrayerDurationMinutes,
    resetMode,
  ]);

  // Run checks every second
  useEffect(() => {
    const interval = setInterval(() => {
      checkModeTransition();
      checkModeExpiration();
    }, 1000);

    return () => clearInterval(interval);
  }, [checkModeTransition, checkModeExpiration]);

  // Manually set mode (for testing or user override)
  const setDisplayMode = useCallback((mode: DisplayMode, prayer?: string) => {
    setMode(mode, prayer);
  }, [setMode]);

  // Force reset to default mode
  const forceDefaultMode = useCallback(() => {
    resetMode();
  }, [resetMode]);

  return {
    currentMode,
    previousMode,
    modeStartTime,
    setDisplayMode,
    forceDefaultMode,
  };
}
