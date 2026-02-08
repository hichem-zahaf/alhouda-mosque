/**
 * Audio player utility for playing Adhan and notification sounds
 */

import { SoundType } from '@/store/use-audio-store';

export interface AudioPlayerConfig {
  volume: number;
  loop: boolean;
  onEnd?: () => void;
  onError?: (error: Error) => void;
}

class AudioPlayer {
  private audio: HTMLAudioElement | null = null;
  private currentSound: SoundType | null = null;
  private volume: number = 0.8;
  private isPlaying: boolean = false;

  /**
   * Initialize audio player
   */
  private initAudio(src: string): void {
    if (this.audio) {
      this.cleanup();
    }

    this.audio = new Audio(src);
    this.audio.volume = this.volume;
  }

  /**
   * Play a sound
   */
  async play(
    soundType: SoundType,
    config: AudioPlayerConfig = { volume: 0.8, loop: false }
  ): Promise<void> {
    try {
      // Stop any currently playing audio
      if (this.isPlaying && this.audio) {
        this.stop();
      }

      // Get audio file path based on sound type
      const src = this.getAudioPath(soundType);
      this.initAudio(src);

      if (!this.audio) {
        throw new Error('Failed to initialize audio player');
      }

      // Configure audio
      this.volume = config.volume;
      this.audio.volume = config.volume;
      this.audio.loop = config.loop;

      // Set up event listeners
      this.audio.onended = () => {
        this.isPlaying = false;
        this.currentSound = null;
        config.onEnd?.();
      };

      this.audio.onerror = (e) => {
        this.isPlaying = false;
        this.currentSound = null;
        const error = new Error('Audio playback failed');
        config.onError?.(error);
      };

      // Play the audio
      await this.audio.play();
      this.isPlaying = true;
      this.currentSound = soundType;
    } catch (error) {
      this.isPlaying = false;
      this.currentSound = null;
      throw error instanceof Error ? error : new Error('Audio playback failed');
    }
  }

  /**
   * Stop currently playing audio
   */
  stop(): void {
    if (this.audio && this.isPlaying) {
      this.audio.pause();
      this.audio.currentTime = 0;
      this.isPlaying = false;
      this.currentSound = null;
    }
  }

  /**
   * Pause currently playing audio
   */
  pause(): void {
    if (this.audio && this.isPlaying) {
      this.audio.pause();
      this.isPlaying = false;
    }
  }

  /**
   * Resume paused audio
   */
  async resume(): Promise<void> {
    if (this.audio && !this.isPlaying) {
      await this.audio.play();
      this.isPlaying = true;
    }
  }

  /**
   * Set volume
   */
  setVolume(volume: number): void {
    this.volume = Math.max(0, Math.min(1, volume));
    if (this.audio) {
      this.audio.volume = this.volume;
    }
  }

  /**
   * Get current volume
   */
  getVolume(): number {
    return this.volume;
  }

  /**
   * Check if audio is currently playing
   */
  getIsPlaying(): boolean {
    return this.isPlaying;
  }

  /**
   * Get the currently playing sound type
   */
  getCurrentSound(): SoundType | null {
    return this.currentSound;
  }

  /**
   * Get audio file path for sound type
   */
  private getAudioPath(soundType: SoundType): string {
    const paths: Record<SoundType, string> = {
      adhan: '/audio/adhan.mp3',
      notification: '/audio/notification.mp3',
      iqama: '/audio/iqama.mp3',
    };

    return paths[soundType] || paths.notification;
  }

  /**
   * Clean up resources
   */
  cleanup(): void {
    if (this.audio) {
      this.audio.pause();
      this.audio.onended = null;
      this.audio.onerror = null;
      this.audio = null;
    }
    this.isPlaying = false;
    this.currentSound = null;
  }

  /**
   * Check if browser supports audio autoplay
   */
  static canAutoplay(): boolean {
    try {
      const audio = new Audio();
      return !!audio.canPlayType('audio/mpeg');
    } catch {
      return false;
    }
  }

  /**
   * Test audio playback (used to enable autoplay)
   */
  static async testAutoplay(): Promise<boolean> {
    try {
      const audio = new Audio('/audio/silence.mp3');
      await audio.play();
      audio.pause();
      return true;
    } catch {
      return false;
    }
  }
}

// Singleton instance
let playerInstance: AudioPlayer | null = null;

export function getAudioPlayer(): AudioPlayer {
  if (!playerInstance) {
    playerInstance = new AudioPlayer();
  }
  return playerInstance;
}

/**
 * Play Adhan sound
 */
export async function playAdhan(config?: AudioPlayerConfig): Promise<void> {
  const player = getAudioPlayer();
  await player.play('adhan', config);
}

/**
 * Play notification sound
 */
export async function playNotification(config?: AudioPlayerConfig): Promise<void> {
  const player = getAudioPlayer();
  await player.play('notification', config);
}

/**
 * Stop all audio
 */
export function stopAudio(): void {
  const player = getAudioPlayer();
  player.stop();
}

/**
 * Check if audio is playing
 */
export function isAudioPlaying(): boolean {
  const player = getAudioPlayer();
  return player.getIsPlaying();
}

/**
 * Get audio path for a sound type
 */
export function getAudioPath(soundType: SoundType): string {
  const paths: Record<SoundType, string> = {
    adhan: '/audio/adhan.mp3',
    notification: '/audio/notification.mp3',
    iqama: '/audio/iqama.mp3',
  };

  return paths[soundType] || paths.notification;
}
