/**
 * Prayer Settings component - Built with shadcn/ui
 */

'use client';

import { useSettingsStore } from '@/store';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

export function PrayerSettings() {
  const { settings, updatePrayerSettings } = useSettingsStore();

  return (
    <div className="space-y-8">
      <div className="pb-2">
        <h3 className="text-lg font-semibold mb-2">إعدادات الصلوات</h3>
        <p className="text-sm text-muted-foreground">تخصيص حساب أوقات الصلاة والإقامة</p>
      </div>

      <div className="space-y-6">
        {/* Calculation Method */}
        <div className="space-y-3">
          <Label htmlFor="calculation-method" className="text-base">طريقة الحساب</Label>
          <Select
            value={settings.prayer.calculationMethod.toString()}
            onValueChange={(value) => updatePrayerSettings({ calculationMethod: parseInt(value) })}
          >
            <SelectTrigger id="calculation-method" className="h-11">
              <SelectValue placeholder="اختر طريقة الحساب" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">الرابطة الإسلامية العالمية (MWL)</SelectItem>
              <SelectItem value="2">الجمعية الإسلامية لأمريكا الشمالية (ISNA)</SelectItem>
              <SelectItem value="3">الهيئة المصرية العامة للمساحة</SelectItem>
              <SelectItem value="4">جامعة أم القرى (مكة المكرمة)</SelectItem>
              <SelectItem value="5">جامعة علوم إسلامية (كراتشي)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Iqama Adjustments */}
        <div className="space-y-4">
          <Label className="text-base">مدة الإقامة (بالدقائق بعد الأذان)</Label>
          <div className="grid grid-cols-5 gap-4">
            {Object.entries(settings.prayer.iqamaAdjustments).map(([prayer, minutes]) => (
              <div key={prayer} className="space-y-2">
                <Label className="text-xs text-muted-foreground text-center">
                  {prayer === 'Fajr' ? 'الفجر' :
                   prayer === 'Dhuhr' ? 'الظهر' :
                   prayer === 'Asr' ? 'العصر' :
                   prayer === 'Maghrib' ? 'المغرب' :
                   prayer === 'Isha' ? 'العشاء' : prayer}
                </Label>
                <Input
                  type="number"
                  min="0"
                  max="60"
                  value={minutes}
                  onChange={(e) => updatePrayerSettings({
                    iqamaAdjustments: {
                      ...settings.prayer.iqamaAdjustments,
                      [prayer]: parseInt(e.target.value)
                    }
                  })}
                  className="text-center h-11"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Manual Times Toggle */}
        <div className="flex items-center justify-between p-5 border rounded-lg">
          <div>
            <p className="text-base font-medium">استخدام أوقات يدوية</p>
            <p className="text-sm text-muted-foreground">تعطيل الحساب التلقائي واستخدام أوقات محددة</p>
          </div>
          <Switch
            checked={settings.prayer.useManualTimes}
            onCheckedChange={(checked) => updatePrayerSettings({ useManualTimes: checked })}
          />
        </div>
      </div>
    </div>
  );
}
