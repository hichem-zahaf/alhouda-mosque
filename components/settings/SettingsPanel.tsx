/**
 * Settings Panel Modal - Built with shadcn/ui components
 */

'use client';

import { MapPin, Palette, Castle, Volume2, Globe } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { LocationSettings } from './LocationSettings';
import { ThemeSettings } from './ThemeSettings';
import { PrayerSettings } from './PrayerSettings';
import { SoundSettings } from './SoundSettings';
import { APISettings } from './APISettings';

interface SettingsPanelProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
}

export function SettingsPanel({ isOpen, onClose }: SettingsPanelProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-hidden flex flex-col p-0 gap-0" dir="rtl">
        <DialogHeader className="px-8 py-2 border-b">
          <DialogTitle className="text-xl">الإعدادات</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="location" className="flex-1 overflow-hidden flex flex-col">
          <div className="border-b px-4">
            <TabsList className="w-full justify-start rounded-none h-auto p-0 bg-transparent border-b-0">
              <TabsTrigger value="location" className="flex-1 rounded-none border-b-2 data-[state=active]:border-emerald-500 py-4">
                <MapPin className="w-5 h-5 ml-2" />
                <span className="text-base">الموقع</span>
              </TabsTrigger>
              <TabsTrigger value="theme" className="flex-1 rounded-none border-b-2 data-[state=active]:border-emerald-500 py-4">
                <Palette className="w-5 h-5 ml-2" />
                <span className="text-base">المظهر</span>
              </TabsTrigger>
              <TabsTrigger value="prayer" className="flex-1 rounded-none border-b-2 data-[state=active]:border-emerald-500 py-4">
                <Castle className="w-5 h-5 ml-2" />
                <span className="text-base">الصلوات</span>
              </TabsTrigger>
              <TabsTrigger value="api" className="flex-1 rounded-none border-b-2 data-[state=active]:border-emerald-500 py-4">
                <Globe className="w-5 h-5 ml-2" />
                <span className="text-base">API</span>
              </TabsTrigger>
              <TabsTrigger value="sound" className="flex-1 rounded-none border-b-2 data-[state=active]:border-emerald-500 py-4">
                <Volume2 className="w-5 h-5 ml-2" />
                <span className="text-base">الصوت</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="flex-1 overflow-y-auto">
            <TabsContent value="location" className="m-0 p-8 focus-visible:outline-none">
              <LocationSettings />
            </TabsContent>
            <TabsContent value="theme" className="m-0 p-8 focus-visible:outline-none">
              <ThemeSettings />
            </TabsContent>
            <TabsContent value="prayer" className="m-0 p-8 focus-visible:outline-none">
              <PrayerSettings />
            </TabsContent>
            <TabsContent value="api" className="m-0 p-8 focus-visible:outline-none">
              <APISettings />
            </TabsContent>
            <TabsContent value="sound" className="m-0 p-8 focus-visible:outline-none">
              <SoundSettings />
            </TabsContent>
          </div>
        </Tabs>

        <div className="flex items-center justify-end gap-3 px-8 py-5 border-t bg-muted/30">
          <Button variant="outline" onClick={onClose} className="h-10 px-6">
            إغلاق
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
