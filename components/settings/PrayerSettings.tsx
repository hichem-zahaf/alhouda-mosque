/**
 * Prayer Settings component
 */

'use client';

import { useSettingsStore } from '@/store';

export function PrayerSettings() {
  const { settings, updatePrayerSettings } = useSettingsStore();

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-primary mb-6">إعدادات الصلوات</h3>

      {/* Calculation Method */}
      <div>
        <label className="block text-lg font-medium text-accent-d4 mb-2">
          طريقة الحساب
        </label>
        <select
          value={settings.prayer.calculationMethod}
          onChange={(e) => updatePrayerSettings({ calculationMethod: parseInt(e.target.value) })}
          className="w-full px-4 py-3 bg-dark-222 border-2 border-primary/30 rounded-lg text-light-f1 focus:border-primary focus:outline-none"
        >
          <option value="1">الرابطة الإسلامية العالمية (MWL)</option>
          <option value="2">الجمعية الإسلامية لأمريكا الشمالية (ISNA)</option>
          <option value="3">الهيئة المصرية العامة للمساحة</option>
          <option value="4">جامعة أم القرى (مكة المكرمة)</option>
          <option value="5">جامعة علوم إسلامية (كراتشي)</option>
        </select>
      </div>

      {/* Iqama Adjustments */}
      <div>
        <label className="block text-lg font-medium text-accent-d4 mb-4">
          مدة الإقامة (بالدقائق بعد الأذان)
        </label>
        <div className="grid grid-cols-5 gap-4">
          {Object.entries(settings.prayer.iqamaAdjustments).map(([prayer, minutes]) => (
            <div key={prayer}>
              <label className="block text-sm font-medium text-accent-d4 mb-2 text-center">
                {prayer === 'Fajr' ? 'الفجر' :
                 prayer === 'Dhuhr' ? 'الظهر' :
                 prayer === 'Asr' ? 'العصر' :
                 prayer === 'Maghrib' ? 'المغرب' :
                 prayer === 'Isha' ? 'العشاء' : prayer}
              </label>
              <input
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
                className="w-full px-3 py-2 bg-dark-222 border-2 border-primary/30 rounded-lg text-light-f1 text-center focus:border-primary focus:outline-none"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Manual Times Toggle */}
      <div className="flex items-center justify-between bg-primary/10 border-2 border-primary/30 rounded-lg p-4">
        <div>
          <p className="text-lg font-semibold text-light-f1">استخدام أوقات يدوية</p>
          <p className="text-sm text-accent-d4">تعطيل الحساب التلقائي واستخدام أوقات محددة</p>
        </div>
        <button
          onClick={() => updatePrayerSettings({ useManualTimes: !settings.prayer.useManualTimes })}
          className={`
            px-6 py-3 rounded-lg font-semibold transition-colors
            ${settings.prayer.useManualTimes
              ? 'bg-primary text-dark-222'
              : 'bg-dark-222 text-accent-d4 border-2 border-primary/30'
            }
          `}
        >
          {settings.prayer.useManualTimes ? 'مفعّل' : 'معطّل'}
        </button>
      </div>
    </div>
  );
}
