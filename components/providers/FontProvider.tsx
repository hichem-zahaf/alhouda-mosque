/**
 * FontProvider - Applies the selected font globally
 */

'use client';

import { useEffect } from 'react';
import { useSettingsStore } from '@/store';

const fontVariables: Record<string, string> = {
  'cairo': 'var(--font-cairo)',
  'amiri': 'var(--font-amiri)',
  'tajawal': 'var(--font-tajawal)',
  'ibm-plex': 'var(--font-ibm-plex)',
};

const fontFallbacks: Record<string, string> = {
  'cairo': '"Noto Sans Arabic", "Arabic UI", sans-serif',
  'amiri': '"Traditional Arabic", "Arabic Typesetting", serif',
  'tajawal': '"Noto Sans Arabic", "Arabic UI", sans-serif',
  'ibm-plex': '"Noto Sans Arabic", "Arabic UI", sans-serif',
};

export function FontProvider({ children }: { children: React.ReactNode }) {
  const { settings } = useSettingsStore();
  const selectedFont = settings.theme.font;

  useEffect(() => {
    const fontVar = fontVariables[selectedFont] || fontVariables['cairo'];
    const fallback = fontFallbacks[selectedFont] || fontFallbacks['cairo'];
    const fontStack = `${fontVar}, ${fallback}`;

    // Apply to document root
    document.documentElement.style.setProperty('--selected-font', fontStack);

    // Also apply to body for immediate effect
    document.body.style.setProperty('--selected-font', fontStack);
    document.body.style.fontFamily = fontStack;
  }, [selectedFont]);

  return <>{children}</>;
}
