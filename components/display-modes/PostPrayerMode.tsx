/**
 * Post-Prayer Mode component - Shows post-prayer quotes and dhikr
 */

'use client';

import { QuoteDisplay } from '@/components/center-display/QuoteDisplay';
import { usePrayerStore } from '@/store';
import { isFriday } from '@/lib/utils/date-formatter';

interface PostPrayerModeProps {
  className?: string;
}

export function PostPrayerMode({ className = '' }: PostPrayerModeProps) {
  const { currentPrayer } = usePrayerStore();

  const getPrayerName = () => {
    if (!currentPrayer) return '';

    if (currentPrayer.name === 'Dhuhr' && isFriday()) {
      return 'الجمعة';
    }

    return currentPrayer.nameArabic;
  };

  const postPrayerDhikr = [
    'أَسْتَغْفِرُ اللَّهَ',
    'اللَّهُمَّ أَنْتَ السَّلَامُ وَمِنْكَ السَّلَامُ',
    'لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ',
    'سُبْحَانَ اللَّهِ',
    'الْحَمْدُ لِلَّهِ',
    'اللَّهُ أَكْبَرُ',
  ];

  return (
    <div
      className={`
        flex flex-col items-center justify-center
        min-h-[70vh]
        space-y-12
        ${className}
      `}
    >
      {/* Prayer Completed Message */}
      <div className="text-center">
        <h2 className="text-5xl font-bold text-primary mb-4">
          صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ
        </h2>
        <p className="text-3xl text-accent-d4">
          تمت صلاة {getPrayerName()}
        </p>
      </div>

      {/* Post-Prayer Quote */}
      <div className="w-full max-w-4xl">
        <QuoteDisplay category="post-prayer" />
      </div>

      {/* Dhikr Suggestions */}
      <div className="w-full max-w-4xl bg-primary/10 border-2 border-primary rounded-2xl p-8">
        <h3 className="text-2xl font-semibold text-primary mb-6 text-center">
          الأذكار بعد الصلاة
        </h3>
        <div className="grid grid-cols-2 gap-4">
          {postPrayerDhikr.map((dhikr, index) => (
            <div
              key={index}
              className="text-center p-4 bg-dark-222/60 rounded-lg hover:bg-primary/20 transition-colors cursor-pointer"
            >
              <p className="text-xl text-light-f1">{dhikr}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
