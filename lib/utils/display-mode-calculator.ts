/**
 * Display mode calculator - determines which mode to show based on time and prayer times
 */

import type { PrayerName } from '@/store/use-prayer-store';
import type { DisplayMode } from '@/store/use-display-store';
import {
  isInPrePrayerWindow,
  isInAdhanWindow,
  isInPostPrayerWindow,
} from './countdown-timer';

export interface DisplayModeCalculation {
  mode: DisplayMode;
  activePrayer: PrayerName | null;
  reason: string;
}

export interface DisplayModeConfig {
  prePrayerWindowMinutes: number;
  adhanDurationMinutes: number;
  postPrayerDurationMinutes: number;
}

const DEFAULT_CONFIG: DisplayModeConfig = {
  prePrayerWindowMinutes: 3,
  adhanDurationMinutes: 3,
  postPrayerDurationMinutes: 4,
};

/**
 * Calculate the current display mode based on prayer times
 */
export function calculateDisplayMode(
  prayers: Array<{ name: PrayerName; time: string }>,
  currentTime: Date = new Date(),
  config: DisplayModeConfig = DEFAULT_CONFIG
): DisplayModeCalculation {
  // Check each prayer for mode conditions
  for (const prayer of prayers) {
    // Check adhan window FIRST (highest priority at prayer time)
    if (isInAdhanWindow(prayer.time, currentTime, config.adhanDurationMinutes)) {
      return {
        mode: 'adhan',
        activePrayer: prayer.name,
        reason: `In adhan window for ${prayer.name}`,
      };
    }

    // Check pre-prayer window (before prayer time)
    if (isInPrePrayerWindow(prayer.time, currentTime, config.prePrayerWindowMinutes)) {
      return {
        mode: 'pre-prayer',
        activePrayer: prayer.name,
        reason: `In pre-prayer window for ${prayer.name}`,
      };
    }

    // Check post-prayer window (after adhan completes)
    if (
      isInPostPrayerWindow(
        prayer.time,
        currentTime,
        config.adhanDurationMinutes,
        config.postPrayerDurationMinutes
      )
    ) {
      return {
        mode: 'post-prayer',
        activePrayer: prayer.name,
        reason: `In post-prayer window for ${prayer.name}`,
      };
    }
  }

  // Default mode
  return {
    mode: 'default',
    activePrayer: null,
    reason: 'Normal operation',
  };
}

/**
 * Check if a mode transition is needed
 */
export function shouldTransitionMode(
  currentMode: DisplayMode,
  prayers: Array<{ name: PrayerName; time: string }>,
  currentTime: Date = new Date(),
  config: DisplayModeConfig = DEFAULT_CONFIG
): { shouldTransition: boolean; newMode: DisplayMode | null; activePrayer: PrayerName | null } {
  const calculation = calculateDisplayMode(prayers, currentTime, config);

  if (calculation.mode !== currentMode) {
    return {
      shouldTransition: true,
      newMode: calculation.mode,
      activePrayer: calculation.activePrayer,
    };
  }

  return {
    shouldTransition: false,
    newMode: null,
    activePrayer: null,
  };
}

/**
 * Check if a timed mode has expired
 */
export function hasModeExpired(
  mode: DisplayMode,
  modeStartTime: number | null,
  currentTime: Date = new Date(),
  config: DisplayModeConfig = DEFAULT_CONFIG
): boolean {
  if (mode === 'default' || modeStartTime === null) {
    return false;
  }

  const elapsed = currentTime.getTime() - modeStartTime;

  switch (mode) {
    case 'pre-prayer':
      // Pre-prayer mode expires when prayer time is reached
      return elapsed > config.prePrayerWindowMinutes * 60 * 1000;

    case 'adhan':
      // Adhan mode expires after the configured duration
      return elapsed > config.adhanDurationMinutes * 60 * 1000;

    case 'post-prayer':
      // Post-prayer mode expires after the configured duration
      return elapsed > config.postPrayerDurationMinutes * 60 * 1000;

    default:
      return false;
  }
}

/**
 * Get the duration for a mode in milliseconds
 */
export function getModeDuration(
  mode: DisplayMode,
  config: DisplayModeConfig = DEFAULT_CONFIG
): number {
  switch (mode) {
    case 'pre-prayer':
      return config.prePrayerWindowMinutes * 60 * 1000;

    case 'adhan':
      return config.adhanDurationMinutes * 60 * 1000;

    case 'post-prayer':
      return config.postPrayerDurationMinutes * 60 * 1000;

    default:
      return 0;
  }
}

/**
 * Calculate when the next mode transition will occur
 */
export function getNextModeTransition(
  prayers: Array<{ name: PrayerName; time: string }>,
  currentTime: Date = new Date(),
  config: DisplayModeConfig = DEFAULT_CONFIG
): { time: Date; mode: DisplayMode; prayer: PrayerName | null } | null {
  const transitions: Array<{
    time: Date;
    mode: DisplayMode;
    prayer: PrayerName | null;
  }> = [];

  for (const prayer of prayers) {
    const prayerDate = new Date(prayer.time);

    // Pre-prayer transition
    const prePrayerTime = new Date(
      prayerDate.getTime() - config.prePrayerWindowMinutes * 60 * 1000
    );
    if (prePrayerTime > currentTime) {
      transitions.push({
        time: prePrayerTime,
        mode: 'pre-prayer',
        prayer: prayer.name,
      });
    }

    // Adhan transition
    if (prayerDate > currentTime) {
      transitions.push({
        time: prayerDate,
        mode: 'adhan',
        prayer: prayer.name,
      });
    }

    // Post-prayer transition
    const postPrayerTime = new Date(
      prayerDate.getTime() +
        (config.adhanDurationMinutes + config.postPrayerDurationMinutes) * 60 * 1000
    );
    if (postPrayerTime > currentTime) {
      transitions.push({
        time: postPrayerTime,
        mode: 'post-prayer',
        prayer: prayer.name,
      });
    }
  }

  // Sort by time and return the earliest future transition
  transitions.sort((a, b) => a.time.getTime() - b.time.getTime());
  return transitions.length > 0 ? transitions[0] : null;
}
