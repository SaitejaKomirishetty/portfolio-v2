'use client';

import { create } from 'zustand';
import type { AppId } from '@/data/apps';

interface ContextMenuState {
  x: number;
  y: number;
}

export interface AppNotification {
  id: string;
  /** App the notification is attributed to (drives the icon). */
  appId?: AppId;
  title: string;
  body?: string;
  createdAt: number;
}

interface UIStore {
  spotlightOpen: boolean;
  aboutOpen: boolean;
  launchpadOpen: boolean;
  controlCenterOpen: boolean;
  notificationCenterOpen: boolean;
  contextMenu: ContextMenuState | null;

  /** Control Center radios (session-only — not persisted). */
  wifi: boolean;
  bluetooth: boolean;
  dnd: boolean;

  notifications: AppNotification[];

  openSpotlight: () => void;
  closeSpotlight: () => void;
  toggleSpotlight: () => void;
  openAbout: () => void;
  closeAbout: () => void;
  openLaunchpad: () => void;
  closeLaunchpad: () => void;
  toggleLaunchpad: () => void;
  toggleControlCenter: () => void;
  closeControlCenter: () => void;
  toggleNotificationCenter: () => void;
  closeNotificationCenter: () => void;
  /** Close every transient top-layer panel (used on Escape / focus changes). */
  closeAllPanels: () => void;
  openContextMenu: (pos: ContextMenuState) => void;
  closeContextMenu: () => void;

  toggleWifi: () => void;
  toggleBluetooth: () => void;
  toggleDnd: () => void;

  pushNotification: (n: Omit<AppNotification, 'id' | 'createdAt'>) => string;
  dismissNotification: (id: string) => void;
  clearNotifications: () => void;
}

let notifSeq = 0;
function nextNotificationId() {
  notifSeq += 1;
  return `n${Date.now().toString(36)}-${notifSeq}`;
}

export const useUIStore = create<UIStore>((set) => ({
  spotlightOpen: false,
  aboutOpen: false,
  launchpadOpen: false,
  controlCenterOpen: false,
  notificationCenterOpen: false,
  contextMenu: null,

  wifi: true,
  bluetooth: true,
  dnd: false,

  notifications: [],

  openSpotlight: () => set({ spotlightOpen: true, launchpadOpen: false }),
  closeSpotlight: () => set({ spotlightOpen: false }),
  toggleSpotlight: () => set((s) => ({ spotlightOpen: !s.spotlightOpen })),
  openAbout: () => set({ aboutOpen: true }),
  closeAbout: () => set({ aboutOpen: false }),

  openLaunchpad: () =>
    set({
      launchpadOpen: true,
      spotlightOpen: false,
      controlCenterOpen: false,
      notificationCenterOpen: false,
    }),
  closeLaunchpad: () => set({ launchpadOpen: false }),
  toggleLaunchpad: () => set((s) => ({ launchpadOpen: !s.launchpadOpen })),

  toggleControlCenter: () =>
    set((s) => ({
      controlCenterOpen: !s.controlCenterOpen,
      notificationCenterOpen: false,
    })),
  closeControlCenter: () => set({ controlCenterOpen: false }),

  toggleNotificationCenter: () =>
    set((s) => ({
      notificationCenterOpen: !s.notificationCenterOpen,
      controlCenterOpen: false,
    })),
  closeNotificationCenter: () => set({ notificationCenterOpen: false }),

  closeAllPanels: () =>
    set({
      controlCenterOpen: false,
      notificationCenterOpen: false,
      contextMenu: null,
    }),

  openContextMenu: (pos) => set({ contextMenu: pos }),
  closeContextMenu: () => set({ contextMenu: null }),

  toggleWifi: () => set((s) => ({ wifi: !s.wifi })),
  toggleBluetooth: () => set((s) => ({ bluetooth: !s.bluetooth })),
  toggleDnd: () => set((s) => ({ dnd: !s.dnd })),

  pushNotification: (n) => {
    const id = nextNotificationId();
    set((s) => ({
      notifications: [
        { ...n, id, createdAt: Date.now() },
        ...s.notifications,
      ].slice(0, 50),
    }));
    return id;
  },
  dismissNotification: (id) =>
    set((s) => ({
      notifications: s.notifications.filter((x) => x.id !== id),
    })),
  clearNotifications: () => set({ notifications: [] }),
}));
