/**
 * Theme Settings component
 */

'use client';

import { useSettingsStore } from '@/store';

export function ThemeSettings() {
  const { settings, updateThemeSettings, updateMosqueSettings } = useSettingsStore();

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-primary mb-6">إعدادات المظهر</h3>

      {/* Mosque Name */}
      <div>
        <label className="block text-lg font-medium text-accent-d4 mb-2">
          اسم المسجد
        </label>
        <input
          type="text"
          value={settings.mosque.name}
          onChange={(e) => updateMosqueSettings({ name: e.target.value })}
          className="w-full px-4 py-3 bg-dark-222 border-2 border-primary/30 rounded-lg text-light-f1 focus:border-primary focus:outline-none"
          dir="rtl"
        />
      </div>

      {/* Colors */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Object.entries(settings.theme.colors).map(([key, value]) => (
          <div key={key}>
            <label className="block text-lg font-medium text-accent-d4 mb-2 capitalize">
              {key === 'primary' ? 'اللون الأساسي' :
               key === 'dark' ? 'الخلفية الداكنة' :
               key === 'light' ? 'الخلفية الفاتحة' :
               'اللون الثانوي'}
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={value}
                onChange={(e) => updateThemeSettings({
                  colors: { ...settings.theme.colors, [key]: e.target.value }
                })}
                className="w-12 h-12 rounded cursor-pointer border-2 border-primary/30"
              />
              <input
                type="text"
                value={value}
                onChange={(e) => updateThemeSettings({
                  colors: { ...settings.theme.colors, [key]: e.target.value }
                })}
                className="flex-1 px-3 py-2 bg-dark-222 border-2 border-primary/30 rounded-lg text-light-f1 focus:border-primary focus:outline-none"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Font */}
      <div>
        <label className="block text-lg font-medium text-accent-d4 mb-2">
          الخط
        </label>
        <select
          value={settings.theme.font}
          onChange={(e) => updateThemeSettings({ font: e.target.value })}
          className="w-full px-4 py-3 bg-dark-222 border-2 border-primary/30 rounded-lg text-light-f1 focus:border-primary focus:outline-none"
        >
          <option value="Cairo">Cairo</option>
          <option value="Tajawal">Tajawal</option>
          <option value="Almarai">Almarai</option>
          <option value="Amiri">Amiri</option>
        </select>
      </div>
    </div>
  );
}
