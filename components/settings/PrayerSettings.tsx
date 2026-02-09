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

// All Aladhan calculation methods
const CALCULATION_METHODS = [
  { value: '0', label: 'Jafari / Shia Ithna-Ashari', arabic: 'جعفري / الشيعة الاثنا عشرية' },
  { value: '1', label: 'University of Islamic Sciences, Karachi', arabic: 'جامعة العلوم الإسلامية، كراتشي' },
  { value: '2', label: 'Islamic Society of North America (ISNA)', arabic: 'الجمعية الإسلامية لأمريكا الشمالية' },
  { value: '3', label: 'Muslim World League (MWL)', arabic: 'الرابطة الإسلامية العالمية' },
  { value: '4', label: 'Umm Al-Qura University, Makkah', arabic: 'جامعة أم القرى، مكة المكرمة' },
  { value: '5', label: 'Egyptian General Authority of Survey', arabic: 'الهيئة المصرية العامة للمساحة' },
  { value: '7', label: 'Institute of Geophysics, University of Tehran', arabic: 'معهد الجيوفيزياء، جامعة طهران' },
  { value: '8', label: 'Gulf Region', arabic: 'منطقة الخليج' },
  { value: '9', label: 'Kuwait', arabic: 'الكويت' },
  { value: '10', label: 'Qatar', arabic: 'قطر' },
  { value: '11', label: 'Majlis Ugama Islam Singapura, Singapore', arabic: 'مجلس الشؤون الإسلامية، سنغافورة' },
  { value: '12', label: 'Union Organization islamic de France', arabic: 'المنظمة الإسلامية في فرنسا' },
  { value: '13', label: 'Diyanet İşleri Başkanlığı, Turkey', arabic: 'رئاسة الشؤون الدينية، تركيا' },
  { value: '14', label: 'Spiritual Administration of Muslims of Russia', arabic: 'الإدارة الروحية لمسلمي روسيا' },
  { value: '15', label: 'Moonsighting Committee Worldwide', arabic: 'لجنة رؤية الهلال العالمية' },
  { value: '16', label: 'Dubai (experimental)', arabic: 'دبي (تجريبي)' },
  { value: '17', label: 'Jabatan Kemajuan Islam Malaysia (JAKIM)', arabic: 'إدارة التطوير الإسلامي الماليزي' },
  { value: '18', label: 'Tunisia', arabic: 'تونس' },
  { value: '19', label: 'Algeria', arabic: 'الجزائر' },
  { value: '20', label: 'KEMENAG - Indonesia', arabic: 'وزارة الشؤون الدينية، إندونيسيا' },
] as const;

export function PrayerSettings() {
  const { settings, updatePrayerSettings } = useSettingsStore();

  return (
    <div className="space-y-8">
      <div className="pb-2">
        <h3 className="text-lg font-semibold mb-2">إعدادات الصلوات</h3>
        <p className="text-sm text-muted-foreground">تخصيص حساب أوقات الصلاة والإقامة</p>
      </div>

      <div className="space-y-6 py-4">
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
            <SelectContent className="max-h-80 overflow-y-auto">
              {CALCULATION_METHODS.map((method) => (
                <SelectItem key={method.value} value={method.value}>
                  {method.arabic}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Iqama Adjustments */}
        <div className="space-y-4 py-4">
          <Label className="text-base">مدة الإقامة (بالدقائق بعد الأذان)</Label>
          <div className="grid grid-cols-5 gap-4 py-4">
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
        <div className="flex items-center justify-between p-5 border rounded-lg py-4">
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
