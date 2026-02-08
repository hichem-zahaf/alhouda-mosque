/**
 * Main page - Mosque display system
 */

'use client';

import { useEffect, useState } from 'react';
import { Header } from '@/components/header/Header';
import { DefaultMode } from '@/components/display-modes/DefaultMode';
import { PrePrayerMode } from '@/components/display-modes/PrePrayerMode';
import { AdhanMode } from '@/components/display-modes/AdhanMode';
import { PostPrayerMode } from '@/components/display-modes/PostPrayerMode';
import { SettingsPanel } from '@/components/settings/SettingsPanel';
import { RTLWrapper } from '@/components/shared/RTLWrapper';
import { useDisplayMode } from '@/hooks/use-display-mode';
import { useAudioStore } from '@/store';

export default function HomePage() {
  const { currentMode } = useDisplayMode();
  const { setHasInteracted } = useAudioStore();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

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
    <RTLWrapper className="min-h-screen bg-dark-222 islamic-pattern">
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
