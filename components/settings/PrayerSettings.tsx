/**
 * Prayer Settings component - Shadcn-style
 */

'use client';

import { useSettingsStore } from '@/store';

export function PrayerSettings() {
  const { settings, updatePrayerSettings } = useSettingsStore();

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-[var(--color-text)] mb-1">إعدادات الصلوات</h3>
        <p className="text-sm text-[var(--color-secondary)]">تخصيص حساب أوقات الصلاة والإقامة</p>
      </div>

      <div className="space-y-4">
        {/* Calculation Method */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-[var(--color-text)]">طريقة الحساب</label>
          <select
            value={settings.prayer.calculationMethod}
            onChange={(e) => updatePrayerSettings({ calculationMethod: parseInt(e.target.value) })}
            className="w-full px-3 py-2 bg-[var(--color-background)] border border-[var(--color-secondary)] rounded-md text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
          >
            <option value="1">الرابطة الإسلامية العالمية (MWL)</option>
            <option value="2">الجمعية الإسلامية لأمريكا الشمالية (ISNA)</option>
            <option value="3">الهيئة المصرية العامة للمساحة</option>
            <option value="4">جامعة أم القرى (مكة المكرمة)</option>
            <option value="5">جامعة علوم إسلامية (كراتشي)</option>
          </select>
        </div>

        {/* Iqama Adjustments */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-[var(--color-text)]">مدة الإقامة (بالدقائق بعد الأذان)</label>
          <div className="grid grid-cols-5 gap-3">
            {Object.entries(settings.prayer.iqamaAdjustments).map(([prayer, minutes]) => (
              <div key={prayer} className="space-y-1">
                <label className="text-xs text-[var(--color-secondary)] text-center">
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
                  className="w-full px-2 py-1 bg-[var(--color-background)] border border-[var(--color-secondary)] rounded text-[var(--color-text)] text-center focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Manual Times Toggle */}
        <div className="flex items-center justify-between p-4 border border-[var(--color-secondary)] rounded-md">
          <div>
            <p className="text-sm font-medium text-[var(--color-text)]">استخدام أوقات يدوية</p>
            <p className="text-xs text-[var(--color-secondary)]">تعطيل الحساب التلقائي واستخدام أوقات محددة</p>
          </div>
          <button
            onClick={() => updatePrayerSettings({ useManualTimes: !settings.prayer.useManualTimes })}
            className={`
              px-4 py-2 rounded-md text-sm font-medium transition-colors
              ${settings.prayer.useManualTimes
                ? 'bg-[var(--color-primary)] text-[var(--color-background)]'
                : 'bg-[var(--color-secondary)]/20 text-[var(--color-text)] hover:bg-[var(--color-secondary)]/30'
              }
            `}
          >
            {settings.prayer.useManualTimes ? 'مفعّل' : 'معطّل'}
          </button>
        </div>
      </div>
    </div>
  );
}
