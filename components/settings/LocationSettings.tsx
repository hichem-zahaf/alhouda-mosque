/**
 * Location Settings component - Shadcn-style
 */

'use client';

import { useSettingsStore } from '@/store';

export function LocationSettings() {
  const { settings, updateLocationSettings } = useSettingsStore();

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-[var(--color-text)] mb-1">إعدادات الموقع</h3>
        <p className="text-sm text-[var(--color-secondary)]">قم بتحديد موقع المسجد لحساب أوقات الصلاة</p>
      </div>

      <div className="space-y-4">
        {/* City */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-[var(--color-text)]">المدينة</label>
          <input
            type="text"
            value={settings.location.city}
            onChange={(e) => updateLocationSettings({ city: e.target.value })}
            className="w-full px-3 py-2 bg-[var(--color-background)] border border-[var(--color-secondary)] rounded-md text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
            dir="rtl"
          />
        </div>

        {/* Country */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-[var(--color-text)]">الدولة</label>
          <input
            type="text"
            value={settings.location.country}
            onChange={(e) => updateLocationSettings({ country: e.target.value })}
            className="w-full px-3 py-2 bg-[var(--color-background)] border border-[var(--color-secondary)] rounded-md text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
            dir="rtl"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Latitude */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-[var(--color-text)]">خط العرض</label>
            <input
              type="number"
              step="0.0001"
              value={settings.location.coordinates.lat}
              onChange={(e) => updateLocationSettings({
                coordinates: { ...settings.location.coordinates, lat: parseFloat(e.target.value) }
              })}
              className="w-full px-3 py-2 bg-[var(--color-background)] border border-[var(--color-secondary)] rounded-md text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
            />
          </div>

          {/* Longitude */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-[var(--color-text)]">خط الطول</label>
            <input
              type="number"
              step="0.0001"
              value={settings.location.coordinates.lng}
              onChange={(e) => updateLocationSettings({
                coordinates: { ...settings.location.coordinates, lng: parseFloat(e.target.value) }
              })}
              className="w-full px-3 py-2 bg-[var(--color-background)] border border-[var(--color-secondary)] rounded-md text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="bg-[var(--color-secondary)]/10 border border-[var(--color-secondary)] rounded-md p-4">
        <p className="text-sm text-[var(--color-secondary)]">
          💡 يتم استخدام هذه الإحداثيات لحساب أوقات الصلاة بدقة
        </p>
      </div>
    </div>
  );
}
