/**
 * Adhan Mode component - Shows current time and plays Adhan
 */

'use client';

import { useEffect, useState } from 'react';
import { usePrayerStore, useAudioStore } from '@/store';
import { useCurrentTime } from '@/hooks/use-current-time';
import { useDisplayMode } from '@/hooks/use-display-mode';
import { playAdhan, stopAudio } from '@/lib/audio/audio-player';
import { Volume2, VolumeX } from 'lucide-react';
import { isFriday } from '@/lib/utils/date-formatter';

interface AdhanModeProps {
  className?: string;
}

export function AdhanMode({ className = '' }: AdhanModeProps) {
  const { nextPrayer } = usePrayerStore();
  const { hasInteracted, setHasInteracted, autoPlayEnabled } = useAudioStore();
  const time = useCurrentTime();
  const [hasPlayedAdhan, setHasPlayedAdhan] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    // Play Adhan when mode starts (if user has interacted and autoplay is enabled)
    if (!hasPlayedAdhan && hasInteracted && autoPlayEnabled && !isMuted && nextPrayer) {
      playAdhan({
        volume: 0.8,
        loop: false,
        onEnd: () => {
          // Adhan finished
        },
      }).catch(console.error);
      setHasPlayedAdhan(true);
    }
  }, [hasPlayedAdhan, hasInteracted, autoPlayEnabled, isMuted, nextPrayer]);

  const toggleMute = () => {
    if (isMuted) {
      setIsMuted(false);
    } else {
      setIsMuted(true);
      stopAudio();
    }
  };

  if (!nextPrayer) {
    return null;
  }

  const prayerName = isFriday() && nextPrayer.name === 'Dhuhr' ? 'الجمعة' : nextPrayer.nameArabic;

  return (
    <div
      className={`
        flex flex-col items-center justify-center
        min-h-[70vh]
        relative
        ${className}
      `}
    >
      {/* Mute Toggle */}
      <button
        onClick={toggleMute}
        className="absolute top-4 left-4 p-4 rounded-full bg-primary/20 hover:bg-primary/30 transition-colors"
        aria-label={isMuted ? 'تشغيل الصوت' : 'كتم الصوت'}
      >
        {isMuted ? (
          <VolumeX className="w-8 h-8 text-primary" />
        ) : (
          <Volume2 className="w-8 h-8 text-primary" />
        )}
      </button>

      {/* Enable Audio Button (if not interacted) */}
      {!hasInteracted && (
        <button
          onClick={() => {
            setHasInteracted(true);
            if (!hasPlayedAdhan && autoPlayEnabled && !isMuted) {
              playAdhan({ volume: 0.8, loop: false }).catch(console.error);
              setHasPlayedAdhan(true);
            }
          }}
          className="mb-8 px-8 py-4 bg-primary text-dark-222 rounded-lg text-xl font-semibold hover:bg-primary/80 transition-colors"
        >
          تفعيل الصوت
        </button>
      )}

      <div className="text-center space-y-8">
        {/* Prayer Name */}
        <div className="py-6">
          <h2 className="text-6xl font-bold text-primary animate-pulse-glow">
            الأذان
          </h2>
          <p className="text-4xl text-light-f1 mt-4">
            {prayerName}
          </p>
        </div>

        {/* Current Time */}
        <div className="py-8">
          <div className="text-[10rem] font-bold text-light-f1 leading-none">
            {String(time.hours).padStart(2, '0')}:{String(time.minutes).padStart(2, '0')}
          </div>
        </div>

        {/* Adhan Text */}
        <div className="max-w-4xl mx-auto bg-primary/10 border-2 border-primary rounded-2xl p-8">
          <p className="text-3xl text-light-f1 leading-relaxed">
            اللَّهُ أَكْبَرُ، اللَّهُ أَكْبَرُ
            <br />
            أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا اللَّهُ
            <br />
            أَشْهَدُ أَنَّ مُحَمَّدًا رَسُولُ اللَّهِ
            <br />
            حَيَّ عَلَى الصَّلَاةِ
            <br />
            حَيَّ عَلَى الْفَلَاحِ
            <br />
            اللَّهُ أَكْبَرُ، اللَّهُ أَكْبَرُ
            <br />
            لَا إِلَهَ إِلَّا اللَّهُ
          </p>
        </div>
      </div>
    </div>
  );
}
