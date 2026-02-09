/**
 * Sound Settings component - Shadcn-style
 */

'use client';

import { Volume2, VolumeX } from 'lucide-react';
import { useSettingsStore } from '@/store';

export function SoundSettings() {
  const { settings, updateSoundSettings } = useSettingsStore();

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-[var(--color-text)] mb-1">إعدادات الصوت</h3>
        <p className="text-sm text-[var(--color-secondary)]">تخصيص أصوات الأذان والإشعارات</p>
      </div>

      <div className="space-y-4">
        {/* Sound Enabled */}
        <div className="flex items-center justify-between p-4 border border-[var(--color-secondary)] rounded-md">
          <div className="flex items-center gap-3">
            {settings.sound.enabled ? (
              <Volume2 className="w-5 h-5 text-[var(--color-primary)]" />
            ) : (
              <VolumeX className="w-5 h-5 text-[var(--color-secondary)]" />
            )}
            <div>
              <p className="text-sm font-medium text-[var(--color-text)]">تفعيل الصوت</p>
              <p className="text-xs text-[var(--color-secondary)]">تشغيل الأذان والإشعارات</p>
            </div>
          </div>
          <button
            onClick={() => updateSoundSettings({ enabled: !settings.sound.enabled })}
            className={`
              px-4 py-2 rounded-md text-sm font-medium transition-colors
              ${settings.sound.enabled
                ? 'bg-[var(--color-primary)] text-[var(--color-background)]'
                : 'bg-[var(--color-secondary)]/20 text-[var(--color-text)] hover:bg-[var(--color-secondary)]/30'
              }
            `}
          >
            {settings.sound.enabled ? 'مفعّل' : 'معطّل'}
          </button>
        </div>

        {/* Sound Type */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-[var(--color-text)]">نوع الصوت</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => updateSoundSettings({ type: 'adhan' })}
              className={`
                p-4 rounded-md border-2 transition-all text-center
                ${settings.sound.type === 'adhan'
                  ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/10'
                  : 'border-[var(--color-secondary)] hover:border-[var(--color-secondary)]'
                }
              `}
            >
              <div className="text-2xl mb-2">🔔</div>
              <p className="text-sm font-medium text-[var(--color-text)]">الأذان الكامل</p>
              <p className="text-xs text-[var(--color-secondary)]">تلاوة كاملة للأذان</p>
            </button>

            <button
              onClick={() => updateSoundSettings({ type: 'notification' })}
              className={`
                p-4 rounded-md border-2 transition-all text-center
                ${settings.sound.type === 'notification'
                  ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/10'
                  : 'border-[var(--color-secondary)] hover:border-[var(--color-secondary)]'
                }
              `}
            >
              <div className="text-2xl mb-2">🔕</div>
              <p className="text-sm font-medium text-[var(--color-text)]">إشعار قصير</p>
              <p className="text-xs text-[var(--color-secondary)]">صوت تنبيه مختصر</p>
            </button>
          </div>
        </div>

        {/* Volume */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-[var(--color-text)]">مستوى الصوت</label>
            <span className="text-sm text-[var(--color-primary)] font-medium">
              {Math.round(settings.sound.volume * 100)}%
            </span>
          </div>
          <div className="flex items-center gap-3">
            <VolumeX className="w-4 h-4 text-[var(--color-secondary)]" />
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={settings.sound.volume}
              onChange={(e) => updateSoundSettings({ volume: parseFloat(e.target.value) })}
              className="flex-1 h-2 accent-[var(--color-primary)]"
            />
            <Volume2 className="w-4 h-4 text-[var(--color-primary)]" />
          </div>
        </div>
      </div>
    </div>
  );
}
