/**
 * Theme Settings component - Shadcn-style
 */

'use client';

import { useSettingsStore } from '@/store';
import { useThemeStore, themes } from '@/store/use-theme-store';

export function ThemeSettings() {
  const { settings, updateMosqueSettings } = useSettingsStore();
  const { currentTheme, setTheme, currentThemeIndex } = useThemeStore();

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-[var(--color-text)] mb-1">إعدادات المظهر</h3>
        <p className="text-sm text-[var(--color-secondary)]">تخصيص مظهر وتصميم الشاشة</p>
      </div>

      <div className="space-y-4">
        {/* Mosque Name */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-[var(--color-text)]">اسم المسجد</label>
          <input
            type="text"
            value={settings.mosque.name}
            onChange={(e) => updateMosqueSettings({ name: e.target.value })}
            className="w-full px-3 py-2 bg-[var(--color-background)] border border-[var(--color-secondary)] rounded-md text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
            dir="rtl"
          />
        </div>

        {/* Theme Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-[var(--color-text)]">اختيار الثيم</label>
          <div className="grid grid-cols-3 gap-2">
            {themes.map((theme, index) => (
              <button
                key={theme.id}
                onClick={() => setTheme(index)}
                className={`
                  p-3 rounded-md border-2 transition-all text-center
                  ${currentThemeIndex === index
                    ? 'border-[var(--color-primary)] ring-2 ring-[var(--color-primary)]/20'
                    : 'border-[var(--color-secondary)] hover:border-[var(--color-secondary)]'
                  }
                `}
                style={{
                  backgroundColor: theme.colors.background,
                  color: theme.colors.text,
                }}
              >
                <div className="text-sm font-medium">{theme.name}</div>
                <div className="text-xs opacity-70">{theme.type === 'dark' ? 'داكن' : 'فاتح'}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Current Theme Info */}
        <div className="p-4 border border-[var(--color-secondary)] rounded-md">
          <p className="text-sm font-medium text-[var(--color-text)] mb-2">الثيم الحالي: {currentTheme.name}</p>
          <div className="grid grid-cols-5 gap-2">
            <div className="text-center">
              <div className="text-xs text-[var(--color-secondary)] mb-1">الخلفية</div>
              <div
                className="w-full h-6 rounded border border-[var(--color-secondary)]"
                style={{ backgroundColor: currentTheme.colors.background }}
              />
            </div>
            <div className="text-center">
              <div className="text-xs text-[var(--color-secondary)] mb-1">النص</div>
              <div
                className="w-full h-6 rounded border border-[var(--color-secondary)]"
                style={{ backgroundColor: currentTheme.colors.text }}
              />
            </div>
            <div className="text-center">
              <div className="text-xs text-[var(--color-secondary)] mb-1">الأساسي</div>
              <div
                className="w-full h-6 rounded border border-[var(--color-secondary)]"
                style={{ backgroundColor: currentTheme.colors.primary }}
              />
            </div>
            <div className="text-center">
              <div className="text-xs text-[var(--color-secondary)] mb-1">الثانوي</div>
              <div
                className="w-full h-6 rounded border border-[var(--color-secondary)]"
                style={{ backgroundColor: currentTheme.colors.secondary }}
              />
            </div>
            <div className="text-center">
              <div className="text-xs text-[var(--color-secondary)] mb-1">المميز</div>
              <div
                className="w-full h-6 rounded border border-[var(--color-secondary)]"
                style={{ backgroundColor: currentTheme.colors.accent }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
