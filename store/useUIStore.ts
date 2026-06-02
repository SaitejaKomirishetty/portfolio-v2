'use client';

import { create } from 'zustand';

interface ContextMenuState {
  x: number;
  y: number;
}

interface UIStore {
  spotlightOpen: boolean;
  aboutOpen: boolean;
  contextMenu: ContextMenuState | null;

  openSpotlight: () => void;
  closeSpotlight: () => void;
  toggleSpotlight: () => void;
  openAbout: () => void;
  closeAbout: () => void;
  openContextMenu: (pos: ContextMenuState) => void;
  closeContextMenu: () => void;
}

export const useUIStore = create<UIStore>((set) => ({
  spotlightOpen: false,
  aboutOpen: false,
  contextMenu: null,

  openSpotlight: () => set({ spotlightOpen: true }),
  closeSpotlight: () => set({ spotlightOpen: false }),
  toggleSpotlight: () => set((s) => ({ spotlightOpen: !s.spotlightOpen })),
  openAbout: () => set({ aboutOpen: true }),
  closeAbout: () => set({ aboutOpen: false }),
  openContextMenu: (pos) => set({ contextMenu: pos }),
  closeContextMenu: () => set({ contextMenu: null }),
}));
