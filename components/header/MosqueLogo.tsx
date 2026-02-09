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
      <div>
        <h1 className="text-2xl font-bold text-primary">
          {settings.mosque.name}
        </h1>
      </div>
    </div>
  );
}
