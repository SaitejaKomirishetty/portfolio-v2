'use client';

import { create } from 'zustand';
import { apps, type AppId } from '@/data/apps';

export interface WindowBounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface WindowState {
  id: AppId;
  bounds: WindowBounds;
  /** Saved bounds to restore to after un-maximizing. */
  restoreBounds: WindowBounds | null;
  zIndex: number;
  minimized: boolean;
  maximized: boolean;
  /** Monotonic open order, used for cascade offsets. */
  openSeq: number;
}

interface WindowStore {
  windows: Partial<Record<AppId, WindowState>>;
  /** Stacking order, lowest → highest. Last entry is focused. */
  order: AppId[];
  focused: AppId | null;
  topZ: number;
  openSeq: number;

  open: (id: AppId) => void;
  close: (id: AppId) => void;
  closeAll: () => void;
  focus: (id: AppId) => void;
  minimize: (id: AppId) => void;
  /** Restore from minimized (and focus). */
  unminimize: (id: AppId) => void;
  toggleMinimize: (id: AppId) => void;
  toggleMaximize: (id: AppId) => void;
  setBounds: (id: AppId, bounds: Partial<WindowBounds>) => void;
  /** Open if closed, focus if open, restore if minimized — dock click behavior. */
  toggleOpen: (id: AppId) => void;
}

const MENUBAR_HEIGHT = 28;
const CASCADE_STEP = 28;

/** Compute a sensible, viewport-aware default position for a new window. */
function defaultBounds(id: AppId, seq: number): WindowBounds {
  const meta = apps[id];
  const vw = typeof window !== 'undefined' ? window.innerWidth : 1440;
  const vh = typeof window !== 'undefined' ? window.innerHeight : 900;

  const width = Math.min(meta.defaultSize.width, vw - 48);
  const height = Math.min(meta.defaultSize.height, vh - MENUBAR_HEIGHT - 120);

  // Center, then cascade subsequent windows down-right.
  const offset = (seq % 6) * CASCADE_STEP;
  const x = Math.max(24, (vw - width) / 2 + offset - 60);
  const y = Math.max(MENUBAR_HEIGHT + 16, (vh - height) / 3 + offset);

  return { x, y, width, height };
}

export const useWindowStore = create<WindowStore>((set, get) => ({
  windows: {},
  order: [],
  focused: null,
  topZ: 10,
  openSeq: 0,

  open: (id) => {
    const state = get();
    const existing = state.windows[id];
    const nextZ = state.topZ + 1;

    if (existing) {
      // Already open → just focus + un-minimize.
      set({
        windows: {
          ...state.windows,
          [id]: { ...existing, minimized: false, zIndex: nextZ },
        },
        order: [...state.order.filter((w) => w !== id), id],
        focused: id,
        topZ: nextZ,
      });
      return;
    }

    const seq = state.openSeq + 1;
    const win: WindowState = {
      id,
      bounds: defaultBounds(id, seq),
      restoreBounds: null,
      zIndex: nextZ,
      minimized: false,
      maximized: false,
      openSeq: seq,
    };

    set({
      windows: { ...state.windows, [id]: win },
      order: [...state.order, id],
      focused: id,
      topZ: nextZ,
      openSeq: seq,
    });
  },

  close: (id) => {
    const state = get();
    const windows = { ...state.windows };
    delete windows[id];
    const order = state.order.filter((w) => w !== id);
    set({
      windows,
      order,
      focused: order.length ? order[order.length - 1] : null,
    });
  },

  closeAll: () => set({ windows: {}, order: [], focused: null }),

  focus: (id) => {
    const state = get();
    const win = state.windows[id];
    if (!win) return;
    if (state.focused === id && !win.minimized) return;
    const nextZ = state.topZ + 1;
    set({
      windows: {
        ...state.windows,
        [id]: { ...win, zIndex: nextZ, minimized: false },
      },
      order: [...state.order.filter((w) => w !== id), id],
      focused: id,
      topZ: nextZ,
    });
  },

  minimize: (id) => {
    const state = get();
    const win = state.windows[id];
    if (!win) return;
    const order = state.order.filter((w) => w !== id);
    set({
      windows: { ...state.windows, [id]: { ...win, minimized: true } },
      // Focus moves to the next window underneath.
      focused: order.length ? order[order.length - 1] : null,
    });
  },

  unminimize: (id) => get().focus(id),

  toggleMinimize: (id) => {
    const win = get().windows[id];
    if (!win) return;
    if (win.minimized) get().focus(id);
    else get().minimize(id);
  },

  toggleMaximize: (id) => {
    const state = get();
    const win = state.windows[id];
    if (!win) return;

    if (win.maximized) {
      set({
        windows: {
          ...state.windows,
          [id]: {
            ...win,
            maximized: false,
            bounds: win.restoreBounds ?? win.bounds,
            restoreBounds: null,
          },
        },
      });
      return;
    }

    const vw = typeof window !== 'undefined' ? window.innerWidth : 1440;
    const vh = typeof window !== 'undefined' ? window.innerHeight : 900;
    set({
      windows: {
        ...state.windows,
        [id]: {
          ...win,
          maximized: true,
          restoreBounds: win.bounds,
          bounds: {
            x: 8,
            y: MENUBAR_HEIGHT + 6,
            width: vw - 16,
            height: vh - MENUBAR_HEIGHT - 6 - 96,
          },
        },
      },
    });
    get().focus(id);
  },

  setBounds: (id, partial) => {
    const state = get();
    const win = state.windows[id];
    if (!win) return;
    set({
      windows: {
        ...state.windows,
        [id]: { ...win, bounds: { ...win.bounds, ...partial } },
      },
    });
  },

  toggleOpen: (id) => {
    const state = get();
    const win = state.windows[id];
    if (!win) {
      get().open(id);
    } else if (win.minimized) {
      get().focus(id);
    } else if (state.focused === id) {
      get().minimize(id);
    } else {
      get().focus(id);
    }
  },
}));
