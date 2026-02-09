/**
 * Theme Settings component - Built with shadcn/ui
 */

'use client';

import { useSettingsStore } from '@/store';
import { useThemeStore, themes } from '@/store/use-theme-store';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

export function ThemeSettings() {
  const { settings, updateMosqueSettings } = useSettingsStore();
  const { currentTheme, setTheme, currentThemeIndex } = useThemeStore();

  return (
    <div className="space-y-8">
      <div className="pb-2">
        <h3 className="text-lg font-semibold mb-2">إعدادات المظهر</h3>
        <p className="text-sm text-muted-foreground">تخصيص مظهر وتصميم الشاشة</p>
      </div>

      <div className="space-y-6 py-4">
        {/* Mosque Name */}
        <div className="space-y-3">
          <Label htmlFor="mosque-name" className="dir-rtl text-base">اسم المسجد</Label>
          <Input
            id="mosque-name"
            type="text"
            value={settings.mosque.name}
            onChange={(e) => updateMosqueSettings({ name: e.target.value })}
            dir="rtl"
            className="h-11"
          />
        </div>

        {/* Theme Selection */}
        <div className="space-y-3 py-4">
          <Label className="text-base">اختيار الثيم</Label>
          <div className="grid grid-cols-3 gap-3">
            {themes.map((theme, index) => (
              <button
                key={theme.id}
                onClick={() => setTheme(index)}
                className={`
                  p-4 rounded-lg border-2 transition-all text-center
                  ${currentThemeIndex === index
                    ? 'border-primary ring-2 ring-primary/20'
                    : 'border-border hover:border-border'
                  }
                `}
                style={{
                  backgroundColor: theme.colors.background,
                  color: theme.colors.text,
                }}
              >
                <div className="text-base font-medium">{theme.name}</div>
                <div className="text-sm opacity-70 mt-1">{theme.type === 'dark' ? 'داكن' : 'فاتح'}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Current Theme Info */}
        <div className="p-5 border rounded-lg py-4">
          <p className="text-base font-medium mb-3 py-4">الثيم الحالي: {currentTheme.name}</p>
          <div className="grid grid-cols-5 gap-3">
            <div className="text-center">
              <div className="text-xs text-muted-foreground mb-2">الخلفية</div>
              <div
                className="w-full h-8 rounded border"
                style={{ backgroundColor: currentTheme.colors.background }}
              />
            </div>
            <div className="text-center">
              <div className="text-xs text-muted-foreground mb-2">النص</div>
              <div
                className="w-full h-8 rounded border"
                style={{ backgroundColor: currentTheme.colors.text }}
              />
            </div>
            <div className="text-center">
              <div className="text-xs text-muted-foreground mb-2">الأساسي</div>
              <div
                className="w-full h-8 rounded border"
                style={{ backgroundColor: currentTheme.colors.primary }}
              />
            </div>
            <div className="text-center">
              <div className="text-xs text-muted-foreground mb-2">الثانوي</div>
              <div
                className="w-full h-8 rounded border"
                style={{ backgroundColor: currentTheme.colors.secondary }}
              />
            </div>
            <div className="text-center">
              <div className="text-xs text-muted-foreground mb-2">المميز</div>
              <div
                className="w-full h-8 rounded border"
                style={{ backgroundColor: currentTheme.colors.accent }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
