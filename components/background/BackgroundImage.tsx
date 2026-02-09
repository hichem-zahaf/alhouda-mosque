/**
 * Background Image component - Displays selected background image with overlay
 */

'use client';

import { useSettingsStore } from '@/store';
import { useEffect, useState } from 'react';

export function BackgroundImage() {
  const { settings } = useSettingsStore();
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    if (settings.theme.backgroundImageEnabled && settings.theme.backgroundImage) {
      setImageUrl(settings.theme.backgroundImage);
    } else {
      setImageUrl(null);
    }
  }, [settings.theme.backgroundImageEnabled, settings.theme.backgroundImage]);

  if (!imageUrl) {
    return null;
  }

  return (
    <div className="fixed inset-0 -z-10">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${imageUrl})` }}
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Gradient Overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/50 via-transparent to-black/50" />
    </div>
  );
}
