/**
 * Location Settings component
 */

'use client';

import { useSettingsStore } from '@/store';

export function LocationSettings() {
  const { settings, updateLocationSettings } = useSettingsStore();

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-primary mb-6">إعدادات الموقع</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* City */}
        <div>
          <label className="block text-lg font-medium text-accent-d4 mb-2">
            المدينة
          </label>
          <input
            type="text"
            value={settings.location.city}
            onChange={(e) => updateLocationSettings({ city: e.target.value })}
            className="w-full px-4 py-3 bg-dark-222 border-2 border-primary/30 rounded-lg text-light-f1 focus:border-primary focus:outline-none"
            dir="rtl"
          />
        </div>

        {/* Country */}
        <div>
          <label className="block text-lg font-medium text-accent-d4 mb-2">
            الدولة
          </label>
          <input
            type="text"
            value={settings.location.country}
            onChange={(e) => updateLocationSettings({ country: e.target.value })}
            className="w-full px-4 py-3 bg-dark-222 border-2 border-primary/30 rounded-lg text-light-f1 focus:border-primary focus:outline-none"
            dir="rtl"
          />
        </div>

        {/* Latitude */}
        <div>
          <label className="block text-lg font-medium text-accent-d4 mb-2">
            خط العرض
          </label>
          <input
            type="number"
            step="0.0001"
            value={settings.location.coordinates.lat}
            onChange={(e) => updateLocationSettings({
              coordinates: { ...settings.location.coordinates, lat: parseFloat(e.target.value) }
            })}
            className="w-full px-4 py-3 bg-dark-222 border-2 border-primary/30 rounded-lg text-light-f1 focus:border-primary focus:outline-none"
          />
        </div>

        {/* Longitude */}
        <div>
          <label className="block text-lg font-medium text-accent-d4 mb-2">
            خط الطول
          </label>
          <input
            type="number"
            step="0.0001"
            value={settings.location.coordinates.lng}
            onChange={(e) => updateLocationSettings({
              coordinates: { ...settings.location.coordinates, lng: parseFloat(e.target.value) }
            })}
            className="w-full px-4 py-3 bg-dark-222 border-2 border-primary/30 rounded-lg text-light-f1 focus:border-primary focus:outline-none"
          />
        </div>
      </div>

      {/* Info */}
      <div className="bg-primary/10 border-2 border-primary/30 rounded-lg p-4 mt-6">
        <p className="text-accent-d4">
          💡 يتم استخدام هذه الإحداثيات لحساب أوقات الصلاة بدقة
        </p>
      </div>
    </div>
  );
}
