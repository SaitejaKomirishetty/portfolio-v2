'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { defaultWallpaperId } from '@/data/wallpapers';

export type BootPhase = 'boot' | 'login' | 'desktop';

interface SystemStore {
  wallpaperId: string;
  soundEnabled: boolean;
  /** Whether the user has completed the boot/login flow at least once. */
  hasBooted: boolean;

  setWallpaper: (id: string) => void;
  setSound: (on: boolean) => void;
  toggleSound: () => void;
  markBooted: () => void;
  /** Reset desktop: clears the booted flag so the boot screen replays. */
  reset: () => void;
}

export const useSystemStore = create<SystemStore>()(
  persist(
    (set) => ({
      wallpaperId: defaultWallpaperId,
      soundEnabled: false,
      hasBooted: false,

      setWallpaper: (id) => set({ wallpaperId: id }),
      setSound: (on) => set({ soundEnabled: on }),
      toggleSound: () => set((s) => ({ soundEnabled: !s.soundEnabled })),
      markBooted: () => set({ hasBooted: true }),
      reset: () => set({ hasBooted: false, wallpaperId: defaultWallpaperId }),
    }),
    {
      name: 'macos-portfolio-system',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
