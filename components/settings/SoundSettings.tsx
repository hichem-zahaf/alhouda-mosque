/**
 * Sound Settings component - Built with shadcn/ui
 */

'use client';

import { useState } from 'react';
import { Volume2, VolumeX, Play, StopCircle } from 'lucide-react';
import { useSettingsStore } from '@/store';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { getAudioPlayer, type SoundType } from '@/lib/audio/audio-player';

export function SoundSettings() {
  const { settings, updateSoundSettings } = useSettingsStore();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSound, setCurrentSound] = useState<SoundType | null>(null);

  const playTestSound = async (soundType: SoundType) => {
    try {
      setIsPlaying(true);
      setCurrentSound(soundType);

      const player = getAudioPlayer();
      await player.play(soundType, {
        volume: settings.sound.volume,
        loop: false,
        onEnd: () => {
          setIsPlaying(false);
          setCurrentSound(null);
        },
        onError: (error) => {
          console.error('Error playing sound:', error);
          setIsPlaying(false);
          setCurrentSound(null);
        },
      });
    } catch (error) {
      console.error('Error playing sound:', error);
      setIsPlaying(false);
      setCurrentSound(null);
    }
  };

  const stopSound = () => {
    const player = getAudioPlayer();
    player.stop();
    setIsPlaying(false);
    setCurrentSound(null);
  };

  return (
    <div className="space-y-8">
      <div className="pb-2">
        <h3 className="text-lg font-semibold mb-2">إعدادات الصوت</h3>
        <p className="text-sm text-muted-foreground">تخصيص أصوات الأذان والإشعارات</p>
      </div>

      <div className="space-y-6 py-4">
        {/* Sound Enabled */}
        <div className="flex items-center justify-between p-5 border rounded-lg">
          <div className="flex items-center gap-4">
            {settings.sound.enabled ? (
              <Volume2 className="w-6 h-6 text-primary" />
            ) : (
              <VolumeX className="w-6 h-6 text-muted-foreground" />
            )}
            <div>
              <p className="text-base font-medium">تفعيل الصوت</p>
              <p className="text-sm text-muted-foreground">تشغيل الأذان والإشعارات</p>
            </div>
          </div>
          <Switch
            checked={settings.sound.enabled}
            onCheckedChange={(checked) => updateSoundSettings({ enabled: checked })}
          />
        </div>

        {/* Sound Type */}
        <div className="space-y-3 py-4">
          <Label className="text-base">نوع الصوت</Label>
          <div className="grid grid-cols-2 gap-4 py-2">
            <div
              onClick={() => updateSoundSettings({ type: 'adhan' })}
              className={`
                p-5 rounded-lg border-2 transition-all text-center relative cursor-pointer
                ${settings.sound.type === 'adhan'
                  ? 'border-primary bg-primary/10'
                  : 'border-border hover:border-border'
                }
              `}
            >
              <p className="text-base font-medium">الأذان الكامل</p>
              <p className="text-sm text-muted-foreground">تلاوة كاملة للأذان</p>
              {settings.sound.type === 'adhan' && (
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (isPlaying && currentSound === 'adhan') {
                      stopSound();
                    } else {
                      playTestSound('adhan');
                    }
                  }}
                  variant="ghost"
                  size="sm"
                  className="mt-2 gap-1"
                  disabled={!settings.sound.enabled}
                >
                  {isPlaying && currentSound === 'adhan' ? (
                    <>
                      <StopCircle className="w-4 h-4" />
                      إيقاف
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4" />
                      اختبار
                    </>
                  )}
                </Button>
              )}
            </div>

            <div
              onClick={() => updateSoundSettings({ type: 'notification' })}
              className={`
                p-5 rounded-lg border-2 transition-all text-center relative cursor-pointer
                ${settings.sound.type === 'notification'
                  ? 'border-primary bg-primary/10'
                  : 'border-border hover:border-border'
                }
              `}
            >
              <p className="text-base font-medium">إشعار قصير</p>
              <p className="text-sm text-muted-foreground">صوت تنبيه مختصر</p>
              {settings.sound.type === 'notification' && (
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (isPlaying && currentSound === 'notification') {
                      stopSound();
                    } else {
                      playTestSound('notification');
                    }
                  }}
                  variant="ghost"
                  size="sm"
                  className="mt-2 gap-1"
                  disabled={!settings.sound.enabled}
                >
                  {isPlaying && currentSound === 'notification' ? (
                    <>
                      <StopCircle className="w-4 h-4" />
                      إيقاف
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4" />
                      اختبار
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Volume */}
        <div className="space-y-3 p-5 border rounded-lg">
          <div className="flex items-center justify-between">
            <Label htmlFor="volume" className="text-base">مستوى الصوت</Label>
            <span className="text-base text-primary font-semibold">
              {Math.round(settings.sound.volume * 100)}%
            </span>
          </div>
          <div className="flex items-center gap-4">
            <VolumeX className="w-5 h-5 text-muted-foreground" />
            <Slider
              id="volume"
              min={0}
              max={1}
              step={0.1}
              value={[settings.sound.volume]}
              onValueChange={([value]) => updateSoundSettings({ volume: value })}
              className="flex-1"
            />
            <Volume2 className="w-5 h-5 text-primary" />
          </div>
        </div>
      </div>
    </div>
  );
}
