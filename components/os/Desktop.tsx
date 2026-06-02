'use client';

import { useEffect } from 'react';
import { useWindowStore } from '@/store/useWindowStore';
import { dockApps, apps } from '@/data/apps';
import { wallpapers, defaultWallpaperId } from '@/data/wallpapers';
import { WindowManager } from './WindowManager';

/**
 * The macOS desktop surface. Phase 3 version: wallpaper + a temporary launcher
 * bar to prove the window manager. Phase 4 replaces the launcher with the real
 * menu bar, dock, desktop icons, and boot/login flow.
 */
export function Desktop() {
  const open = useWindowStore((s) => s.open);
  const wallpaper =
    wallpapers.find((w) => w.id === defaultWallpaperId) ?? wallpapers[0];

  // Prove the window manager by auto-opening the About window once.
  useEffect(() => {
    open('about');
  }, [open]);

  return (
    <div
      className="relative h-dvh w-screen overflow-hidden"
      style={{ background: wallpaper.css }}
    >
      {/* TEMP (Phase 3) launcher — replaced by the real dock in Phase 4. */}
      <div className="absolute left-1/2 top-3 z-[9999] flex -translate-x-1/2 gap-2 rounded-2xl bg-black/30 px-3 py-2 backdrop-blur-md">
        {dockApps.map((id) => (
          <button
            key={id}
            onClick={() => open(id)}
            className="rounded-lg bg-white/15 px-3 py-1 text-xs font-medium text-white hover:bg-white/25"
          >
            {apps[id].name}
          </button>
        ))}
      </div>

      <WindowManager />
    </div>
  );
}
