/**
 * Hook for fetching temperature
 */

'use client';

import { useState, useEffect } from 'react';
import { useSettingsStore } from '@/store';
import { fetchTemperature, formatArabicTemperature } from '@/lib/utils/temperature-fetcher';

export function useTemperature() {
  const { settings } = useSettingsStore();
  const [temperature, setTemperature] = useState<string | null>(null);
  const [condition, setCondition] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!settings.display?.showTemperature) {
      return;
    }

    const fetchTemp = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await fetchTemperature(
          settings.location.coordinates.lat,
          settings.location.coordinates.lng,
          settings.display?.temperatureUnit || 'celsius'
        );

        setTemperature(formatArabicTemperature(data, { unit: settings.display?.temperatureUnit || 'celsius' }));
        setCondition(data.condition);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch temperature');
        console.error('Error fetching temperature:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTemp();

    // Update every 15 minutes
    const interval = setInterval(fetchTemp, 15 * 60 * 1000);

    return () => clearInterval(interval);
  }, [
    settings.location.coordinates.lat,
    settings.location.coordinates.lng,
    settings.display?.showTemperature,
    settings.display?.temperatureUnit,
  ]);

  return {
    temperature,
    condition,
    isLoading,
    error,
  };
}
