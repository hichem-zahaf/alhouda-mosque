/**
 * FontProvider - Applies the selected font globally
 */

'use client';

import { useEffect } from 'react';
import { useSettingsStore } from '@/store';

// Direct font family names (not CSS variables)
const fontFamilies: Record<string, string> = {
  'cairo': '"Cairo", "Noto Sans Arabic", sans-serif',
  'amiri': '"Amiri", "Traditional Arabic", serif',
  'tajawal': '"Tajawal", "Noto Sans Arabic", sans-serif',
  'ibm-plex': '"IBM Plex Sans Arabic", "Noto Sans Arabic", sans-serif',
};

export function FontProvider({ children }: { children: React.ReactNode }) {
  const { settings } = useSettingsStore();
  const selectedFont = settings.theme.font;

  useEffect(() => {
    const fontFamily = fontFamilies[selectedFont] || fontFamilies['cairo'];

    // Apply to all elements
    document.body.style.fontFamily = fontFamily;
    document.documentElement.style.fontFamily = fontFamily;

    // Force update on all elements with a data attribute
    const root = document.documentElement;
    root.setAttribute('data-font', selectedFont);

    // Add class to body for additional styling
    document.body.classList.remove('font-cairo', 'font-amiri', 'font-tajawal', 'font-ibm-plex');
    document.body.classList.add(`font-${selectedFont}`);
  }, [selectedFont]);

  return <>{children}</>;
}
