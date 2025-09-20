'use client';

import { useEffect, useRef } from 'react';

interface AudioFeedbackProps {
  enabled?: boolean;
}

export default function AudioFeedback({ enabled = true }: AudioFeedbackProps) {
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return;

    // Initialize Web Audio API
    try {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch (error) {
      console.log('Web Audio API not supported');
    }

    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [enabled]);

  const playTone = (frequency: number, duration: number, volume: number = 0.1) => {
    const audioContext = audioContextRef.current;
    if (!audioContext || !enabled) return;

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(volume, audioContext.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration);
  };

  // Expose sound functions globally for use by other components
  useEffect(() => {
    if (!enabled) return;

    const soundEffects = {
      keystroke: () => playTone(800 + Math.random() * 200, 0.1, 0.05),
      focus: () => playTone(440, 0.2, 0.08),
      success: () => {
        playTone(523, 0.15, 0.06);
        setTimeout(() => playTone(659, 0.15, 0.06), 100);
        setTimeout(() => playTone(784, 0.2, 0.08), 200);
      },
      error: () => {
        playTone(220, 0.3, 0.08);
        setTimeout(() => playTone(196, 0.3, 0.08), 150);
      },
      magic: () => {
        const frequencies = [523, 659, 784, 1047];
        frequencies.forEach((freq, index) => {
          setTimeout(() => playTone(freq, 0.3, 0.04), index * 100);
        });
      },
      whoosh: () => {
        for (let i = 0; i < 20; i++) {
          setTimeout(() => {
            playTone(200 + i * 50, 0.05, 0.02);
          }, i * 10);
        }
      }
    };

    // Make sound effects available globally
    (window as any).magicalSounds = soundEffects;

    return () => {
      delete (window as any).magicalSounds;
    };
  }, [enabled]);

  return null; // This component doesn't render anything
}

// Utility function to safely play sounds
export const playMagicalSound = (soundName: string) => {
  if (typeof window !== 'undefined' && (window as any).magicalSounds) {
    try {
      (window as any).magicalSounds[soundName]?.();
    } catch (error) {
      // Silently fail if audio context is not available
    }
  }
};