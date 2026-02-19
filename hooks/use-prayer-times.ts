/**
 * Hook for managing prayer times
 */

'use client';

import { useEffect, useState, useCallback } from 'react';
import { usePrayerStore, useSettingsStore } from '@/store';
import { fetchPrayerTimes, parsePrayerTimes, prayerTimeToDate, formatDateForAPI, calculateIqamaTime, getPrayerNameArabic } from '@/lib/prayer-times/aladhan-api';
import { getNextPrayer } from '@/lib/utils/countdown-timer';
import { PrayerName } from '@/store/use-prayer-store';
import { Shafaq, MidnightMode, LatitudeAdjustmentMethod, CalendarMethod } from '@/lib/prayer-times/prayer-times.types';

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
    cachedPrayerData,
    setCachedPrayerData,
    setHijriDate,
    isCachedDataValid,
    clearCache,
  } = usePrayerStore();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get today's date in YYYY-MM-DD format
  const getTodayDate = () => formatDateForAPI(new Date());

  // Create prayer times from manual settings
  const createManualPrayerTimes = () => {
    const prayers: PrayerName[] = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
    const manualTimes = settings.prayer.manualPrayerTimes || {
      Fajr: '05:00',
      Dhuhr: '12:30',
      Asr: '15:45',
      Maghrib: '18:30',
      Isha: '19:45',
    };

    return prayers.map((prayer) => {
      const time = manualTimes[prayer];
      const iqamaTime = calculateIqamaTime(time, settings.prayer.iqamaAdjustments[prayer]);

      return {
        name: prayer,
        nameArabic: getPrayerNameArabic(prayer),
        time,
        iqamaTime,
        isNext: false,
        isCurrent: false,
      };
    });
  };

  // Fetch prayer times on mount and when settings change
  useEffect(() => {
    if (settings.prayer.useManualTimes) {
      // Manual mode - use manually set times
      const prayers = createManualPrayerTimes();
      setTodayPrayers(prayers);
      setIsLoading(false);
      return;
    }

    const fetchTimes = async () => {
      const todayDate = getTodayDate();
      const currentMethod = settings.prayer.calculationMethod;

      // Check if we have valid cached data
      if (isCachedDataValid(todayDate, currentMethod) && cachedPrayerData) {
        // Load from cache
        setTodayPrayers(cachedPrayerData.prayers);
        setHijriDate(cachedPrayerData.hijriDate);
        setIsLoading(false);
        return;
      }

      // Fetch from API
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetchPrayerTimes({
          latitude: settings.location.coordinates.lat,
          longitude: settings.location.coordinates.lng,
          method: settings.prayer.calculationMethod,
          school: settings.prayer.school,
          shafaq: settings.prayer.shafaq,
          tune: settings.prayer.tune,
          midnightMode: settings.prayer.midnightMode,
          latitudeAdjustmentMethod: settings.prayer.latitudeAdjustmentMethod,
          calendarMethod: settings.prayer.calendarMethod,
          iso8601: settings.prayer.iso8601,
          timezonestring: settings.prayer.timezone || undefined,
          adjustment: settings.prayer.calendarAdjustment,
        });

        const prayers = parsePrayerTimes(response, settings.prayer.iqamaAdjustments);
        setTodayPrayers(prayers);

        // Save Hijri date from API
        setHijriDate(response.data.date.hijri);

        // Save to cache
        setCachedPrayerData({
          date: todayDate,
          calculationMethod: settings.prayer.calculationMethod,
          prayers,
          hijriDate: response.data.date.hijri,
        });
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
    settings.prayer.manualPrayerTimes,
    setTodayPrayers,
    setCachedPrayerData,
    setHijriDate,
    cachedPrayerData,
    isCachedDataValid,
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

  // Refetch prayer times from API (clears cache first)
  const refetchPrayerTimes = useCallback(async () => {
    if (settings.prayer.useManualTimes) {
      const prayers = createManualPrayerTimes();
      setTodayPrayers(prayers);
      return;
    }

    setIsLoading(true);
    setError(null);
    clearCache();

    try {
      const todayDate = getTodayDate();
      const response = await fetchPrayerTimes({
        latitude: settings.location.coordinates.lat,
        longitude: settings.location.coordinates.lng,
        method: settings.prayer.calculationMethod,
        school: settings.prayer.school,
        shafaq: settings.prayer.shafaq,
        tune: settings.prayer.tune,
        midnightMode: settings.prayer.midnightMode,
        latitudeAdjustmentMethod: settings.prayer.latitudeAdjustmentMethod,
        calendarMethod: settings.prayer.calendarMethod,
        iso8601: settings.prayer.iso8601,
        timezonestring: settings.prayer.timezone || undefined,
        adjustment: settings.prayer.calendarAdjustment,
      });

      const prayers = parsePrayerTimes(response, settings.prayer.iqamaAdjustments);
      setTodayPrayers(prayers);
      setHijriDate(response.data.date.hijri);

      setCachedPrayerData({
        date: todayDate,
        calculationMethod: settings.prayer.calculationMethod,
        prayers,
        hijriDate: response.data.date.hijri,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch prayer times');
      console.error('Error fetching prayer times:', err);
    } finally {
      setIsLoading(false);
    }
  }, [
    settings.prayer.useManualTimes,
    settings.prayer.calculationMethod,
    settings.prayer.school,
    settings.prayer.shafaq,
    settings.prayer.tune,
    settings.prayer.midnightMode,
    settings.prayer.latitudeAdjustmentMethod,
    settings.prayer.calendarMethod,
    settings.prayer.iso8601,
    settings.prayer.timezone,
    settings.prayer.calendarAdjustment,
    settings.prayer.iqamaAdjustments,
    settings.location.coordinates.lat,
    settings.location.coordinates.lng,
    clearCache,
    setTodayPrayers,
    setHijriDate,
    setCachedPrayerData,
  ]);

  return {
    todayPrayers,
    nextPrayer,
    currentPrayer,
    timeUntilNext,
    timeUntilIqama,
    isLoading,
    error,
    isManualMode,
    refetchPrayerTimes,
  };
}
