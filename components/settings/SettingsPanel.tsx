/**
 * Settings Panel Modal
 */

'use client';

import { useState, useEffect } from 'react';
import { X, Save, RotateCcw } from 'lucide-react';
import { useSettingsStore } from '@/store';
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
  const { settings, updateSettings, resetSettings } = useSettingsStore();
  const [activeTab, setActiveTab] = useState<SettingsTab>('location');
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setHasChanges(false);
    }
  }, [isOpen]);

  const tabs = [
    { id: 'location' as SettingsTab, label: 'الموقع', icon: '📍' },
    { id: 'theme' as SettingsTab, label: 'المظهر', icon: '🎨' },
    { id: 'prayer' as SettingsTab, label: 'الصلوات', icon: '🕌' },
    { id: 'sound' as SettingsTab, label: 'الصوت', icon: '🔊' },
  ];

  const handleSave = () => {
    setHasChanges(false);
    onClose();
  };

  const handleReset = () => {
    if (confirm('هل أنت متأكد من إعادة تعيين جميع الإعدادات؟')) {
      resetSettings();
      setHasChanges(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-dark-222 border-2 border-primary rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-primary/20">
          <h2 className="text-3xl font-bold text-primary">الإعدادات</h2>
          <div className="flex items-center gap-4">
            {hasChanges && (
              <span className="text-sm text-accent-d4">يوجد تغييرات غير محفوظة</span>
            )}
            <button
              onClick={onClose}
              className="p-2 hover:bg-primary/20 rounded-lg transition-colors"
              aria-label="إغلاق"
            >
              <X className="w-6 h-6 text-primary" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-primary/20">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex-1 flex items-center justify-center gap-2 py-4 px-6
                font-semibold transition-colors
                ${activeTab === tab.id
                  ? 'text-primary bg-primary/10 border-b-2 border-primary'
                  : 'text-accent-d4 hover:bg-primary/5'
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
        <div className="flex items-center justify-end gap-4 p-6 border-t border-primary/20">
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-6 py-3 rounded-lg border-2 border-accent-d4 text-accent-d4 hover:bg-accent-d4/10 transition-colors"
          >
            <RotateCcw className="w-5 h-5" />
            <span>إعادة تعيين</span>
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-dark-222 font-semibold hover:bg-primary/80 transition-colors"
          >
            <Save className="w-5 h-5" />
            <span>حفظ</span>
          </button>
        </div>
      </div>
    </div>
  );
}
