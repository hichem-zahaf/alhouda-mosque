/**
 * Location Settings component - Built with shadcn/ui
 */

'use client';

import { useSettingsStore } from '@/store';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

export function LocationSettings() {
  const { settings, updateLocationSettings } = useSettingsStore();

  return (
    <div className="space-y-8 ">
      <div className="pb-2">
        <h3 className="text-lg font-semibold mb-2">إعدادات الموقع</h3>
        <p className="text-sm text-muted-foreground">قم بتحديد موقع المسجد لحساب أوقات الصلاة</p>
      </div>

      <div className="space-y-6 py-4">
        {/* City */}
        <div className="space-y-3">
          <Label htmlFor="city" className="dir-rtl text-base">المدينة</Label>
          <Input
            id="city"
            type="text"
            value={settings.location.city}
            onChange={(e) => updateLocationSettings({ city: e.target.value })}
            dir="rtl"
            className="h-11"
          />
        </div>

        {/* Country */}
        <div className="space-y-3">
          <Label htmlFor="country" className="dir-rtl text-base">الدولة</Label>
          <Input
            id="country"
            type="text"
            value={settings.location.country}
            onChange={(e) => updateLocationSettings({ country: e.target.value })}
            dir="rtl"
            className="h-11"
          />
        </div>

        <div className="grid grid-cols-2 gap-6">
          {/* Latitude */}
          <div className="space-y-3">
            <Label htmlFor="latitude" className="text-base">خط العرض</Label>
            <Input
              id="latitude"
              type="number"
              step="0.0001"
              value={settings.location.coordinates.lat}
              onChange={(e) => updateLocationSettings({
                coordinates: { ...settings.location.coordinates, lat: parseFloat(e.target.value) }
              })}
              className="h-11"
            />
          </div>

          {/* Longitude */}
          <div className="space-y-3">
            <Label htmlFor="longitude" className="text-base">خط الطول</Label>
            <Input
              id="longitude"
              type="number"
              step="0.0001"
              value={settings.location.coordinates.lng}
              onChange={(e) => updateLocationSettings({
                coordinates: { ...settings.location.coordinates, lng: parseFloat(e.target.value) }
              })}
              className="h-11"
            />
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="bg-muted/50 border rounded-lg p-5">
        <p className="text-sm text-muted-foreground leading-relaxed">
          💡 يتم استخدام هذه الإحداثيات لحساب أوقات الصلاة بدقة
        </p>
      </div>
    </div>
  );
}
