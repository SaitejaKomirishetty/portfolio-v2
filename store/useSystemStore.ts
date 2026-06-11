'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { defaultWallpaperId } from '@/data/wallpapers';

export type BootPhase = 'boot' | 'login' | 'desktop';

/** Lowest the Control Center brightness slider can dim the screen to. */
export const MIN_BRIGHTNESS = 0.35;

interface SystemStore {
  wallpaperId: string;
  soundEnabled: boolean;
  /** Display brightness 0..1 — drives a dimming overlay (Control Center). */
  brightness: number;
  /** Whether the user has completed the boot/login flow at least once. */
  hasBooted: boolean;

  setWallpaper: (id: string) => void;
  setSound: (on: boolean) => void;
  toggleSound: () => void;
  setBrightness: (value: number) => void;
  markBooted: () => void;
  /** Reset desktop: clears the booted flag so the boot screen replays. */
  reset: () => void;
}

export const useSystemStore = create<SystemStore>()(
  persist(
    (set) => ({
      wallpaperId: defaultWallpaperId,
      soundEnabled: false,
      brightness: 1,
      hasBooted: false,

      setWallpaper: (id) => set({ wallpaperId: id }),
      setSound: (on) => set({ soundEnabled: on }),
      toggleSound: () => set((s) => ({ soundEnabled: !s.soundEnabled })),
      setBrightness: (value) =>
        set({ brightness: Math.min(1, Math.max(MIN_BRIGHTNESS, value)) }),
      markBooted: () => set({ hasBooted: true }),
      reset: () =>
        set({
          hasBooted: false,
          wallpaperId: defaultWallpaperId,
          brightness: 1,
        }),
    }),
    {
      name: 'macos-portfolio-system',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
