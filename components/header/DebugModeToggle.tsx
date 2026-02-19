/**
 * Debug mode toggle button
 */

'use client';

import { Bug } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { useDebugMode } from '@/hooks/use-debug-mode';
import type { DisplayMode } from '@/store/use-display-store';

const MODES: Array<{ mode: DisplayMode; label: string; labelAr: string }> = [
  { mode: 'default', label: 'Default', labelAr: 'الوضع العادي' },
  { mode: 'pre-prayer', label: 'Pre-Prayer', labelAr: 'قبل الصلاة' },
  { mode: 'adhan', label: 'Adhan', labelAr: 'الأذان' },
  { mode: 'post-prayer', label: 'Post-Prayer', labelAr: 'بعد الصلاة' },
];

const PRAYERS: Array<{ name: string; label: string; labelAr: string }> = [
  { name: 'Fajr', label: 'Fajr', labelAr: 'الفجر' },
  { name: 'Dhuhr', label: 'Dhuhr', labelAr: 'الظهر' },
  { name: 'Asr', label: 'Asr', labelAr: 'العصر' },
  { name: 'Maghrib', label: 'Maghrib', labelAr: 'المغرب' },
  { name: 'Isha', label: 'Isha', labelAr: 'العشاء' },
];

export function DebugModeToggle() {
  const { setDisplayMode } = useDebugMode();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="w-10 h-10 border-primary/30 hover:bg-primary/10"
          dir="ltr"
        >
          <Bug className="w-5 h-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-4" align="end" dir="rtl">
        <div className="space-y-4">
          <div className="border-b pb-2">
            <h4 className="font-semibold text-sm">Debug Mode</h4>
            <p className="text-xs text-muted-foreground">تغيير وضع العرض يدويًا</p>
          </div>

          {/* Mode Selection */}
          <div className="space-y-2">
            <label className="text-xs font-medium">الوضع</label>
            <div className="grid grid-cols-2 gap-2">
              {MODES.map(({ mode, label, labelAr }) => (
                <Button
                  key={mode}
                  variant="outline"
                  size="sm"
                  className="h-auto py-2 px-2 flex flex-col items-center gap-1"
                  onClick={() => setDisplayMode(mode)}
                >
                  <span className="text-xs font-medium">{labelAr}</span>
                  <span className="text-[10px] text-muted-foreground">{label}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Prayer Selection */}
          <div className="space-y-2">
            <label className="text-xs font-medium">الصلاة</label>
            <div className="grid grid-cols-5 gap-1">
              {PRAYERS.map(({ name, label, labelAr }) => (
                <Button
                  key={name}
                  variant="outline"
                  size="sm"
                  className="h-8 px-1 flex flex-col items-center"
                  onClick={() => {
                    // Set mode with selected prayer
                    const currentMode = localStorage.getItem('mosque-display-storage');
                    if (currentMode) {
                      try {
                        const parsed = JSON.parse(currentMode);
                        setDisplayMode(parsed.currentMode || 'default', name);
                      } catch {
                        setDisplayMode('default', name);
                      }
                    }
                  }}
                >
                  <span className="text-[10px]">{labelAr}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Info */}
          <div className="text-[10px] text-muted-foreground border-t pt-2">
            <p>Click mode buttons to manually switch display modes for testing</p>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
