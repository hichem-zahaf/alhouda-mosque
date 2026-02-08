/**
 * Sound Settings component
 */

'use client';

import { Volume2, VolumeX, Bell } from 'lucide-react';
import { useSettingsStore } from '@/store';

export function SoundSettings() {
  const { settings, updateSoundSettings } = useSettingsStore();

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-primary mb-6">إعدادات الصوت</h3>

      {/* Sound Enabled */}
      <div className="flex items-center justify-between bg-primary/10 border-2 border-primary/30 rounded-lg p-4">
        <div className="flex items-center gap-3">
          {settings.sound.enabled ? (
            <Volume2 className="w-6 h-6 text-primary" />
          ) : (
            <VolumeX className="w-6 h-6 text-accent-d4" />
          )}
          <div>
            <p className="text-lg font-semibold text-light-f1">تفعيل الصوت</p>
            <p className="text-sm text-accent-d4">تشغيل الأذان والإشعارات</p>
          </div>
        </div>
        <button
          onClick={() => updateSoundSettings({ enabled: !settings.sound.enabled })}
          className={`
            px-6 py-3 rounded-lg font-semibold transition-colors
            ${settings.sound.enabled
              ? 'bg-primary text-dark-222'
              : 'bg-dark-222 text-accent-d4 border-2 border-primary/30'
            }
          `}
        >
          {settings.sound.enabled ? 'مفعّل' : 'معطّل'}
        </button>
      </div>

      {/* Sound Type */}
      <div>
        <label className="block text-lg font-medium text-accent-d4 mb-4">
          نوع الصوت
        </label>
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => updateSoundSettings({ type: 'adhan' })}
            className={`
              p-6 rounded-xl border-2 transition-all
              ${settings.sound.type === 'adhan'
                ? 'border-primary bg-primary/20'
                : 'border-primary/30 bg-dark-222 hover:border-primary/50'
              }
            `}
          >
            <div className="text-center">
              <Bell className="w-8 h-8 mx-auto mb-2 text-primary" />
              <p className="text-lg font-semibold text-light-f1">الأذان الكامل</p>
              <p className="text-sm text-accent-d4 mt-1">تلاوة كاملة للأذان</p>
            </div>
          </button>

          <button
            onClick={() => updateSoundSettings({ type: 'notification' })}
            className={`
              p-6 rounded-xl border-2 transition-all
              ${settings.sound.type === 'notification'
                ? 'border-primary bg-primary/20'
                : 'border-primary/30 bg-dark-222 hover:border-primary/50'
              }
            `}
          >
            <div className="text-center">
              <Volume2 className="w-8 h-8 mx-auto mb-2 text-primary" />
              <p className="text-lg font-semibold text-light-f1">إشعار قصير</p>
              <p className="text-sm text-accent-d4 mt-1">صوت تنبيه مختصر</p>
            </div>
          </button>
        </div>
      </div>

      {/* Volume */}
      <div>
        <label className="block text-lg font-medium text-accent-d4 mb-2">
          مستوى الصوت
        </label>
        <div className="flex items-center gap-4">
          <VolumeX className="w-5 h-5 text-accent-d4" />
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={settings.sound.volume}
            onChange={(e) => updateSoundSettings({ volume: parseFloat(e.target.value) })}
            className="flex-1 h-2 bg-dark-222 rounded-lg appearance-none cursor-pointer accent-primary"
          />
          <Volume2 className="w-5 h-5 text-primary" />
          <span className="text-lg font-semibold text-primary min-w-[3rem] text-center">
            {Math.round(settings.sound.volume * 100)}%
          </span>
        </div>
      </div>
    </div>
  );
}
