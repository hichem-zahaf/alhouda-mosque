/**
 * Settings Panel Modal - Shadcn-style design
 */

'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { LocationSettings } from './LocationSettings';
import { ThemeSettings } from './ThemeSettings';
import { PrayerSettings } from './PrayerSettings';
import { SoundSettings } from './SoundSettings';

type SettingsTab = 'location' | 'theme' | 'prayer' | 'sound';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsPanel({ isOpen, onClose }: SettingsPanelProps) {
  const [activeTab, setActiveTab] = useState<SettingsTab>('location');

  const tabs = [
    { id: 'location' as SettingsTab, label: 'الموقع', icon: '📍' },
    { id: 'theme' as SettingsTab, label: 'المظهر', icon: '🎨' },
    { id: 'prayer' as SettingsTab, label: 'الصلوات', icon: '🕌' },
    { id: 'sound' as SettingsTab, label: 'الصوت', icon: '🔊' },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-[var(--color-background)] border border-[var(--color-secondary)] rounded-lg w-full max-w-4xl max-h-[85vh] overflow-hidden flex flex-col shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--color-secondary)]">
          <h2 className="text-xl font-semibold text-[var(--color-text)]">الإعدادات</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[var(--color-secondary)]/20 rounded-md transition-colors"
            aria-label="إغلاق"
          >
            <X className="w-5 h-5 text-[var(--color-text)]" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[var(--color-secondary)]">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex-1 flex items-center justify-center gap-2 py-3 px-4
                font-medium transition-colors border-b-2 -mb-px
                ${activeTab === tab.id
                  ? 'text-[var(--color-primary)] border-[var(--color-primary)]'
                  : 'text-[var(--color-secondary)] hover:text-[var(--color-text)] border-transparent hover:border-[var(--color-secondary)]'
                }
              `}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'location' && <LocationSettings />}
          {activeTab === 'theme' && <ThemeSettings />}
          {activeTab === 'prayer' && <PrayerSettings />}
          {activeTab === 'sound' && <SoundSettings />}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[var(--color-secondary)] bg-[var(--color-secondary)]/5">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md border border-[var(--color-secondary)] text-[var(--color-text)] hover:bg-[var(--color-secondary)]/10 transition-colors"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
}
