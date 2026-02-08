/**
 * Settings Toggle button
 */

'use client';

import { Settings } from 'lucide-react';
import { useState } from 'react';

interface SettingsToggleProps {
  onToggle: () => void;
  className?: string;
}

export function SettingsToggle({ onToggle, className = '' }: SettingsToggleProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      onClick={onToggle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`
        p-3 rounded-lg transition-all duration-200
        ${isHovered ? 'bg-primary/20 scale-110' : 'hover:bg-primary/10'}
        ${className}
      `}
      aria-label="الإعدادات"
    >
      <Settings
        className={`w-6 h-6 transition-colors ${
          isHovered ? 'text-primary' : 'text-accent-d4'
        }`}
      />
    </button>
  );
}
