/**
 * Mosque Logo component
 */

'use client';

import Image from 'next/image';
import { useSettingsStore } from '@/store';

interface MosqueLogoProps {
  className?: string;
}

export function MosqueLogo({ className = '' }: MosqueLogoProps) {
  const { settings } = useSettingsStore();

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {settings.mosque.logo ? (
        <div className="relative w-16 h-16">
          <Image
            src={settings.mosque.logo}
            alt={settings.mosque.name}
            fill
            className="object-contain"
          />
        </div>
      ) : (
        <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-3xl">
          🕌
        </div>
      )}
      <div>
        <h1 className="text-2xl font-bold text-primary">
          {settings.mosque.name}
        </h1>
      </div>
    </div>
  );
}
