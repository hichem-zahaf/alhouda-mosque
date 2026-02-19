/**
 * API Settings component - Built with shadcn/ui
 * All Aladhan API configuration options
 */

'use client';

import { useState } from 'react';
import { useSettingsStore } from '@/store';
import { usePrayerTimes } from '@/hooks/use-prayer-times';
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
import { Button } from '@/components/ui/button';
import { RefreshCw, Check, AlertCircle } from 'lucide-react';
import {
  Shafaq,
  MidnightMode,
  LatitudeAdjustmentMethod,
  CalendarMethod,
} from '@/lib/prayer-times/prayer-times.types';

// Calculation methods from Aladhan API
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
  { value: '21', label: 'Morocco', arabic: 'المغرب' },
  { value: '22', label: 'Comunidade Islamica de Lisboa', arabic: 'المجتمع الإسلامي لشبونة' },
  { value: '23', label: 'Ministry of Awqaf, Islamic Affairs and Holy Places, Jordan', arabic: 'وزارة الأوقاف والشؤون الإسلامية، الأردن' },
] as const;

// Common timezones
const COMMON_TIMEZONES = [
  'UTC',
  'Asia/Riyadh',
  'Asia/Dubai',
  'Asia/Kuwait',
  'Asia/Qatar',
  'Asia/Bahrain',
  'Asia/Muscat',
  'Asia/Amman',
  'Asia/Beirut',
  'Asia/Damascus',
  'Asia/Jerusalem',
  'Africa/Cairo',
  'Africa/Casablanca',
  'Europe/London',
  'Europe/Paris',
  'Europe/Istanbul',
  'Asia/Karachi',
  'Asia/Tehran',
  'Asia/Jakarta',
  'Asia/Kuala_Lumpur',
  'Asia/Singapore',
  'America/New_York',
  'America/Chicago',
  'America/Los_Angeles',
];

export function APISettings() {
  const { settings, updatePrayerSettings } = useSettingsStore();
  const { refetchPrayerTimes, isLoading, error } = usePrayerTimes();
  const [refetchStatus, setRefetchStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleRefetch = async () => {
    setRefetchStatus('idle');
    await refetchPrayerTimes();
    setRefetchStatus('success');
    setTimeout(() => setRefetchStatus('idle'), 3000);
  };

  // Parse tune string into array for editing (with fallback for old settings)
  const tuneValues = (settings.prayer.tune || '0,0,0,0,0,0,0,0,0').split(',').map(v => parseInt(v) || 0);
  const tuneLabels = ['الإمساك', 'الفجر', 'الشروق', 'الظهر', 'العصر', 'المغرب', 'الغروب', 'العشاء', 'منتصف الليل'];

  const updateTuneValue = (index: number, value: number) => {
    const newTune = [...tuneValues];
    newTune[index] = value;
    updatePrayerSettings({ tune: newTune.join(',') });
  };

  return (
    <div className="space-y-8">
      <div className="pb-2">
        <h3 className="text-lg font-semibold mb-2">إعدادات API</h3>
        <p className="text-sm text-muted-foreground">تخصيص متقدمة لحساب أوقات الصلاة من Aladhan API</p>
      </div>

      <div className="space-y-8 py-6">
        {/* Calculation Method */}
        <div className="space-y-3 pt-4">
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
          <p className="text-xs text-muted-foreground">
            طريقة الحساب تحدد الزوايا المستخدمة لحساب وقتي الفجر والعشاء
          </p>
        </div>

        {/* School Method */}
        <div className="space-y-3 pt-6">
          <Label htmlFor="school-method" className="text-base">المذهب الفقهي (للعصر)</Label>
          <Select
            value={(settings.prayer.school ?? 0).toString()}
            onValueChange={(value) => updatePrayerSettings({ school: parseInt(value) })}
          >
            <SelectTrigger id="school-method" className="h-11">
              <SelectValue placeholder="اختر المذهب" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">الشافعي (العصر عندما يكون ظل الشيء مثله)</SelectItem>
              <SelectItem value="1">الحنفي (العصر عندما يكون ظل الشيء مثليه)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Shafaq (for Moonsighting Committee) */}
        <div className="space-y-3 pt-6">
          <Label htmlFor="shafaq" className="text-base">الشفق (لطريقة لجنة رؤية الهلال)</Label>
          <Select
            value={settings.prayer.shafaq ?? Shafaq.General}
            onValueChange={(value: Shafaq) => updatePrayerSettings({ shafaq: value })}
          >
            <SelectTrigger id="shafaq" className="h-11">
              <SelectValue placeholder="اختر الشفق" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={Shafaq.General}>عام (General)</SelectItem>
              <SelectItem value={Shafaq.Ahmer}>أحمر (Ahmer)</SelectItem>
              <SelectItem value={Shafaq.Abyad}>أبيض (Abyad)</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            يستخدم فقط مع طريقة لجنة رؤية الهلال العالمية (15)
          </p>
        </div>

        {/* Midnight Mode */}
        <div className="space-y-3 pt-6">
          <Label htmlFor="midnight-mode" className="text-base">وقت منتصف الليل</Label>
          <Select
            value={(settings.prayer.midnightMode ?? MidnightMode.Standard).toString()}
            onValueChange={(value) => updatePrayerSettings({ midnightMode: parseInt(value) as MidnightMode })}
          >
            <SelectTrigger id="midnight-mode" className="h-11">
              <SelectValue placeholder="اختر طريقة حساب منتصف الليل" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">قياسي (من الغروب إلى الفجر)</SelectItem>
              <SelectItem value="1">جعفري (من الغروب إلى الفجر)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Latitude Adjustment Method */}
        <div className="space-y-3 pt-6">
          <Label htmlFor="latitude-adjustment" className="text-base">تعديل خطوط العرض العالية</Label>
          <Select
            value={(settings.prayer.latitudeAdjustmentMethod ?? LatitudeAdjustmentMethod.AngleBased).toString()}
            onValueChange={(value) => updatePrayerSettings({ latitudeAdjustmentMethod: parseInt(value) as LatitudeAdjustmentMethod })}
          >
            <SelectTrigger id="latitude-adjustment" className="h-11">
              <SelectValue placeholder="اختر طريقة التعديل" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">منتصف الليل (Middle of the Night)</SelectItem>
              <SelectItem value="2">سبع الليل (One Seventh)</SelectItem>
              <SelectItem value="3">حسب الزاوية (Angle Based)</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            يستخدم للمناطق ذات خطوط العرض العالية مثل المملكة المتحدة والسويد
          </p>
        </div>

        {/* Calendar Method */}
        <div className="space-y-3 pt-6">
          <Label htmlFor="calendar-method" className="text-base">طريقة التقويم الهجري</Label>
          <Select
            value={settings.prayer.calendarMethod ?? CalendarMethod.HJCoSA}
            onValueChange={(value: CalendarMethod) => updatePrayerSettings({ calendarMethod: value })}
          >
            <SelectTrigger id="calendar-method" className="h-11">
              <SelectValue placeholder="اختر طريقة التقويم" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={CalendarMethod.HJCoSA}>المجلس القضائي السعودي (HJCoSA)</SelectItem>
              <SelectItem value={CalendarMethod.UAQ}>أم القرى (UAQ)</SelectItem>
              <SelectItem value={CalendarMethod.DIYANET}>ديانت التركي (DIYANET)</SelectItem>
              <SelectItem value={CalendarMethod.MATHEMATICAL}>رياضي (MATHEMATICAL)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Calendar Adjustment (only for MATHEMATICAL method) */}
        {(settings.prayer.calendarMethod === CalendarMethod.MATHEMATICAL) && (
          <div className="space-y-3 pt-6 p-5 border rounded-lg bg-muted/30">
            <Label htmlFor="calendar-adjustment" className="text-base">تعديل التاريخ الهجري</Label>
            <div className="flex items-center gap-4">
              <Input
                id="calendar-adjustment"
                type="number"
                min="-2"
                max="2"
                value={settings.prayer.calendarAdjustment ?? 0}
                onChange={(e) => updatePrayerSettings({ calendarAdjustment: parseInt(e.target.value) || 0 })}
                className="w-32 h-11 text-center"
              />
              <span className="text-sm text-muted-foreground">
                أيام (+2 إلى -2)
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              يستخدم لضبط التاريخ الهجري يدويًا عند استخدام الطريقة الرياضية
            </p>
          </div>
        )}

        {/* Timezone */}
        <div className="space-y-3 pt-6">
          <Label htmlFor="timezone" className="text-base">المنطقة الزمنية</Label>
          <Select
            value={settings.prayer.timezone || 'UTC'}
            onValueChange={(value) => updatePrayerSettings({ timezone: value })}
          >
            <SelectTrigger id="timezone" className="h-11">
              <SelectValue placeholder="اختر المنطقة الزمنية" />
            </SelectTrigger>
            <SelectContent className="max-h-80 overflow-y-auto">
              {COMMON_TIMEZONES.map((tz) => (
                <SelectItem key={tz} value={tz}>{tz}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            اتركه فارغًا ليتم حسابه تلقائيًا حسب الإحداثيات
          </p>
        </div>

        {/* ISO 8601 Format */}
        <div className="flex items-center justify-between p-5 border rounded-lg py-4 mt-6">
          <div>
            <p className="text-base font-medium">تنسيق ISO 8601</p>
            <p className="text-sm text-muted-foreground">عرض الأوقات بتنسيق ISO 8601 الكامل</p>
          </div>
          <Switch
            checked={settings.prayer.iso8601 ?? false}
            onCheckedChange={(checked) => updatePrayerSettings({ iso8601: checked })}
          />
        </div>

        {/* Tune Offsets */}
        <div className="space-y-4 p-5 border rounded-lg mt-6">
          <Label className="text-base">تعديل الأوقات (بالدقائق)</Label>
          <p className="text-xs text-muted-foreground mb-4">
            إزاحة كل وقت صلاة بعدد الدقائق (يمكن استخدام قيم سالبة)
          </p>
          <div className="grid grid-cols-3 md:grid-cols-5 gap-4 py-2">
            {tuneValues.map((value, index) => (
              <div key={index} className="space-y-2">
                <Label className="text-xs text-muted-foreground text-center">{tuneLabels[index]}</Label>
                <Input
                  type="number"
                  value={value}
                  onChange={(e) => updateTuneValue(index, parseInt(e.target.value) || 0)}
                  className="text-center h-11"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Iqama Adjustments */}
        <div className="space-y-4 p-5 border rounded-lg mt-6">
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
                  max="120"
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

        {/* Refetch Button */}
        <div className="pt-8 border-t mt-8">
          <div className="flex items-center gap-4">
            <Button
              onClick={handleRefetch}
              disabled={isLoading || settings.prayer.useManualTimes}
              className="h-12 px-6 gap-2"
              variant={refetchStatus === 'success' ? 'default' : 'destructive'}
            >
              {refetchStatus === 'success' ? (
                <Check className="w-5 h-5" />
              ) : (
                <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
              )}
              {isLoading ? 'جاري التحديث...' : 
               refetchStatus === 'success' ? 'تم التحديث' : 
               settings.prayer.useManualTimes ? 'الأوقات اليدوية مفعلة' : 'إعادة جلب الأوقات'}
            </Button>
            
            {refetchStatus === 'success' && (
              <span className="text-sm text-green-600 flex items-center gap-1">
                <Check className="w-4 h-4" />
                تم جلب أوقات الصلاة بنجاح
              </span>
            )}
            
            {error && (
              <span className="text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {error}
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            سيقوم هذا الزر بحذف البيانات المخزنة مؤقتًا وجلب أوقات الصلاة الجديدة من API باستخدام الإعدادات الحالية
          </p>
        </div>
      </div>
    </div>
  );
}
