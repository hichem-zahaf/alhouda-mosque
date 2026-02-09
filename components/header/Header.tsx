/**
 * Main Header component
 */

'use client';

import { MosqueLogo } from './MosqueLogo';
import { DateDisplay } from './DateDisplay';
import { Temperature } from './Temperature';
import { SettingsToggle } from './SettingsToggle';

interface HeaderProps {
  onSettingsToggle?: () => void;
  className?: string;
}

export function Header({ onSettingsToggle, className = '' }: HeaderProps) {
  return (
    <header
      className={`
        relative flex flex-col items-center justify-center
        px-4 py-3 md:px-6 md:py-4
        border-b border-primary/20
        bg-gradient-to-l from-dark-222 to-dark-222/95
        backdrop-blur-sm
        ${className}
      `}
    >
      {/* Desktop layout - centered date with logo on left, temp/settings on right */}
      <div className="hidden md:flex items-center justify-center w-full">
        {/* Mosque logo - absolute positioned on left */}
        <div className="absolute left-6">
          <MosqueLogo />
        </div>

        {/* Date - centered */}
        <DateDisplay />

        {/* Temperature and Settings - absolute positioned on right */}
        <div className="absolute right-6 flex items-center gap-4">
          <Temperature />
          {onSettingsToggle && (
            <SettingsToggle onToggle={onSettingsToggle} />
          )}
        </div>
      </div>

      {/* Mobile layout - stacked logo and date, with temp/settings */}
      <div className="md:hidden flex flex-col items-center w-full">
        <div className="flex items-center justify-between w-full mb-2">
          <MosqueLogo />
          <div className="flex items-center gap-4">
            <Temperature />
            {onSettingsToggle && (
              <SettingsToggle onToggle={onSettingsToggle} />
            )}
          </div>
        </div>
        <DateDisplay />
      </div>
    </header>
  );
}
