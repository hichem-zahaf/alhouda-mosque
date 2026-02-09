/**
 * Main page - Mosque display system
 */

'use client';

import { useEffect, useState, useCallback } from 'react';
import { Header } from '@/components/header/Header';
import { DefaultMode } from '@/components/display-modes/DefaultMode';
import { PrePrayerMode } from '@/components/display-modes/PrePrayerMode';
import { AdhanMode } from '@/components/display-modes/AdhanMode';
import { PostPrayerMode } from '@/components/display-modes/PostPrayerMode';
import { SettingsPanel } from '@/components/settings/SettingsPanel';
import { RTLWrapper } from '@/components/shared/RTLWrapper';
import { useDisplayMode } from '@/hooks/use-display-mode';
import { useAudioStore, useThemeStore } from '@/store';
import { useApplyTheme } from '@/store/use-theme-store';

export default function HomePage() {
  const { currentMode } = useDisplayMode();
  const { setHasInteracted } = useAudioStore();
  const { nextTheme } = useThemeStore();
  const { applyTheme } = useApplyTheme();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [lastClick, setLastClick] = useState(0);

  // Apply theme on mount and when theme changes
  useEffect(() => {
    applyTheme();
  }, [applyTheme]);

  // Track user interaction for audio autoplay
  useEffect(() => {
    const handleInteraction = () => {
      setHasInteracted(true);
    };

    window.addEventListener('click', handleInteraction);
    window.addEventListener('keydown', handleInteraction);
    window.addEventListener('touchstart', handleInteraction);

    return () => {
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('keydown', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
    };
  }, [setHasInteracted]);

  // Handle screen click for theme switching
  const handleScreenClick = useCallback((e: React.MouseEvent) => {
    const now = Date.now();
    const timeSinceLastClick = now - lastClick;

    // Double click detection (within 300ms)
    if (timeSinceLastClick < 300) {
      // Check if clicking on a button, input, or interactive element
      const target = e.target as HTMLElement;
      const isInteractive =
        target.tagName === 'BUTTON' ||
        target.tagName === 'INPUT' ||
        target.tagName === 'SELECT' ||
        target.tagName === 'TEXTAREA' ||
        target.closest('button') ||
        target.closest('input') ||
        target.closest('select') ||
        target.closest('a');

      if (!isInteractive) {
        nextTheme();
        e.preventDefault();
      }
    }

    setLastClick(now);
  }, [lastClick, nextTheme]);

  const renderDisplayMode = () => {
    switch (currentMode) {
      case 'pre-prayer':
        return <PrePrayerMode />;
      case 'adhan':
        return <AdhanMode />;
      case 'post-prayer':
        return <PostPrayerMode />;
      default:
        return <DefaultMode />;
    }
  };

  return (
    <RTLWrapper className="min-h-screen islamic-pattern no-padding" onClick={handleScreenClick}>
      <div className="flex flex-col min-h-screen">
        <Header onSettingsToggle={() => setIsSettingsOpen(true)} />
        <main className="flex-1 p-6">
          {renderDisplayMode()}
        </main>
      </div>
      <SettingsPanel
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </RTLWrapper>
  );
}
