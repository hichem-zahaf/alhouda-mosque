/**
 * Hook for managing prayer times
 */

'use client';

import { useEffect, useState } from 'react';
import { usePrayerStore, useSettingsStore } from '@/store';
import { fetchPrayerTimes, parsePrayerTimes, prayerTimeToDate } from '@/lib/prayer-times/aladhan-api';
import { getNextPrayer } from '@/lib/utils/countdown-timer';

export function usePrayerTimes() {
  const { settings } = useSettingsStore();
  const {
    todayPrayers,
    nextPrayer,
    currentPrayer,
    timeUntilNext,
    timeUntilIqama,
    setTodayPrayers,
    setNextPrayer,
    setCurrentPrayer,
    setTimeUntilNext,
    setTimeUntilIqama,
    isManualMode,
  } = usePrayerStore();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch prayer times on mount and when settings change
  useEffect(() => {
    if (settings.prayer.useManualTimes) {
      // Manual mode - prayer times should be loaded separately
      setIsLoading(false);
      return;
    }

    const fetchTimes = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetchPrayerTimes({
          latitude: settings.location.coordinates.lat,
          longitude: settings.location.coordinates.lng,
          method: settings.prayer.calculationMethod,
        });

        const prayers = parsePrayerTimes(response, settings.prayer.iqamaAdjustments);
        setTodayPrayers(prayers);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch prayer times');
        console.error('Error fetching prayer times:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTimes();
  }, [
    settings.location.coordinates.lat,
    settings.location.coordinates.lng,
    settings.prayer.calculationMethod,
    settings.prayer.iqamaAdjustments,
    settings.prayer.useManualTimes,
    setTodayPrayers,
  ]);

  // Update next prayer and countdowns
  useEffect(() => {
    const updateNextPrayer = () => {
      if (todayPrayers.length === 0) return;

      const now = new Date();
      const prayerList = todayPrayers.map((p) => ({ name: p.name, time: p.time }));
      const next = getNextPrayer(prayerList, now);

      if (next) {
        const prayerTime = prayerTimeToDate(next.time, now);
        const iqamaTime = prayerTimeToDate(
          todayPrayers.find((p) => p.name === next.name)?.iqamaTime || next.time,
          now
        );

        const timeToPrayer = Math.max(0, Math.floor((prayerTime.getTime() - now.getTime()) / 1000));
        const timeToIqama = Math.max(0, Math.floor((iqamaTime.getTime() - now.getTime()) / 1000));

        setNextPrayer({
          name: next.name,
          nameArabic: todayPrayers.find((p) => p.name === next.name)?.nameArabic || next.name,
          time: prayerTime,
          iqamaTime,
        });

        setTimeUntilNext(timeToPrayer);
        setTimeUntilIqama(timeToIqama);
      }

      // Check if we're currently in a prayer time window
      for (const prayer of todayPrayers) {
        const prayerDate = prayerTimeToDate(prayer.time, now);
        const iqamaDate = prayerTimeToDate(prayer.iqamaTime, now);

        if (now >= prayerDate && now < iqamaDate) {
          setCurrentPrayer({
            name: prayer.name,
            nameArabic: prayer.nameArabic,
            time: prayerDate,
            iqamaTime: iqamaDate,
          });
          return;
        }
      }

      setCurrentPrayer(null);
    };

    updateNextPrayer();
    const interval = setInterval(updateNextPrayer, 1000);

    return () => clearInterval(interval);
  }, [todayPrayers, setNextPrayer, setCurrentPrayer, setTimeUntilNext, setTimeUntilIqama]);

  return {
    todayPrayers,
    nextPrayer,
    currentPrayer,
    timeUntilNext,
    timeUntilIqama,
    isLoading,
    error,
    isManualMode,
  };
}
