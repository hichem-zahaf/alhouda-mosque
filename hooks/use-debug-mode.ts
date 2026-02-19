/**
 * Hook for managing debug mode
 */

'use client';

import { useEffect, useState, useCallback } from 'react';
import { useDisplayStore } from '@/store';
import type { DisplayMode } from '@/store/use-display-store';

export function useDebugMode() {
  const [isDebugMode, setIsDebugMode] = useState(false);
  const { setMode } = useDisplayStore();

  useEffect(() => {
    // Check URL for debug parameter
    const params = new URLSearchParams(window.location.search);
    const debug = params.get('debug');
    setIsDebugMode(debug === '1' || debug === 'true');
  }, []);

  const setDisplayMode = useCallback((mode: DisplayMode, prayer?: string) => {
    setMode(mode, prayer);
  }, [setMode]);

  return {
    isDebugMode,
    setDisplayMode,
  };
}
