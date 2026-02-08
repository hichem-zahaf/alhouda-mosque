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
        flex items-center justify-between
        px-6 py-4
        border-b border-primary/20
        bg-gradient-to-l from-dark-222 to-dark-222/95
        backdrop-blur-sm
        ${className}
      `}
    >
      <MosqueLogo />
      <DateDisplay />
      <div className="flex items-center gap-4">
        <Temperature />
        {onSettingsToggle && (
          <SettingsToggle onToggle={onSettingsToggle} />
        )}
      </div>
    </header>
  );
}
