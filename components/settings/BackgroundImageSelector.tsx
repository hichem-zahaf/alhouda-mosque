/**
 * Background Image Selector component - Built with shadcn/ui
 */

'use client';

import { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useSettingsStore } from '@/store';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

const BACKGROUND_IMAGES = [
  '/images/image1.jpg',
  '/images/image2.jpg',
  '/images/image3.jpg',
  '/images/image4.jpg',
  '/images/image5.jpg',
  '/images/image6.jpg',
  '/images/image7.jpg',
  '/images/image8.jpg',
  '/images/image9.jpg',
];

const ITEMS_PER_PAGE = 5;

export function BackgroundImageSelector() {
  const { settings, updateThemeSettings } = useSettingsStore();
  const [currentPage, setCurrentPage] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const totalPages = Math.ceil(BACKGROUND_IMAGES.length / ITEMS_PER_PAGE);
  const startIndex = currentPage * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentImages = BACKGROUND_IMAGES.slice(startIndex, endIndex);

  const handlePrevious = () => {
    setCurrentPage((prev) => (prev > 0 ? prev - 1 : totalPages - 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => (prev < totalPages - 1 ? prev + 1 : 0));
  };

  const selectImage = (imagePath: string | null) => {
    updateThemeSettings({
      backgroundImage: imagePath,
      backgroundImageEnabled: imagePath !== null,
    });
  };

  const isSelected = (imagePath: string) =>
    settings.theme.backgroundImage === imagePath;

  return (
    <div className="space-y-4">
      {/* Toggle */}
      <div className="flex items-center justify-between p-4 border rounded-lg">
        <div>
          <p className="text-base font-medium">صورة الخلفية</p>
          <p className="text-sm text-muted-foreground">استخدم صورة كخلفية للشاشة</p>
        </div>
        <button
          onClick={() => selectImage(settings.theme.backgroundImageEnabled ? null : settings.theme.backgroundImage || BACKGROUND_IMAGES[0])}
          className={`
            relative inline-flex h-6 w-11 items-center rounded-full
            transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
            ${settings.theme.backgroundImageEnabled ? 'bg-primary' : 'bg-muted'}
          `}
        >
          <span
            className={`
              inline-block h-4 w-4 transform rounded-full bg-white
              transition-transform ${settings.theme.backgroundImageEnabled ? 'translate-x-6' : 'translate-x-1'}
            `}
          />
        </button>
      </div>

      {/* Image Selector */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-base">اختر صورة الخلفية</Label>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {currentPage + 1} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="icon"
              onClick={handlePrevious}
              className="h-8 w-8"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleNext}
              className="h-8 w-8"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-5 gap-3">
          {/* Empty image card to remove background */}
          <button
            onClick={() => selectImage(null)}
            className={`
              relative aspect-video rounded-lg border-2 overflow-hidden
              transition-all hover:scale-105
              ${settings.theme.backgroundImage === null && settings.theme.backgroundImageEnabled
                ? 'border-primary ring-2 ring-primary/50'
                : 'border-border hover:border-muted-foreground'
              }
            `}
          >
            <div className="absolute inset-0 bg-muted flex items-center justify-center">
              <span className="text-muted-foreground text-2xl">×</span>
            </div>
            {settings.theme.backgroundImage === null && settings.theme.backgroundImageEnabled && (
              <div className="absolute inset-0 bg-primary/20" />
            )}
          </button>

          {/* Image cards */}
          {currentImages.map((imagePath, index) => (
            <button
              key={imagePath}
              onClick={() => selectImage(imagePath)}
              className={`
                relative aspect-video rounded-lg border-2 overflow-hidden
                transition-all hover:scale-105
                ${isSelected(imagePath)
                  ? 'border-primary ring-2 ring-primary/50'
                  : 'border-border hover:border-muted-foreground'
                }
              `}
            >
              <img
                src={imagePath}
                alt={`صورة الخلفية ${startIndex + index + 1}`}
                className="w-full h-full object-cover"
              />
              {isSelected(imagePath) && (
                <div className="absolute inset-0 bg-primary/20" />
              )}
              <div
                className={`
                  absolute top-1 right-1 w-3 h-3 rounded-full border-2
                  ${isSelected(imagePath)
                    ? 'bg-primary border-primary'
                    : 'bg-muted/50 border-muted-foreground'
                  }
                `}
              />
            </button>
          ))}
        </div>

        {/* Page indicators */}
        <div className="flex justify-center gap-1 mt-2">
          {Array.from({ length: totalPages }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPage(index)}
              className={`
                h-1.5 rounded-full transition-all
                ${currentPage === index ? 'w-6 bg-primary' : 'w-1.5 bg-muted'}
              `}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
