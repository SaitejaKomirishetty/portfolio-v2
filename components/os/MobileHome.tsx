'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { allAppIds, apps, type AppId } from '@/data/apps';
import { appComponents } from '@/components/apps/registry';
import { AppIcon } from './AppIcon';
import { useClock } from '@/hooks/useClock';
import { wallpapers, defaultWallpaperId } from '@/data/wallpapers';
import { useSystemStore } from '@/store/useSystemStore';

/**
 * iOS-style springboard for touch / small screens: a grid of app icons that
 * open full-screen sheets. No window dragging on touch.
 */
export function MobileHome() {
  const [active, setActive] = useState<AppId | null>(null);
  const { time, date } = useClock();
  const wallpaperId = useSystemStore((s) => s.wallpaperId);
  const wallpaper =
    wallpapers.find((w) => w.id === wallpaperId) ??
    wallpapers.find((w) => w.id === defaultWallpaperId)!;

  const ActiveApp = active ? appComponents[active] : null;

  return (
    <div
      className="relative h-dvh w-screen overflow-hidden"
      style={{ background: wallpaper.css }}
    >
      {/* Status bar + clock */}
      <div className="flex items-center justify-between px-5 pt-3 text-sm font-medium text-white no-select">
        <span>{time}</span>
        <span className="opacity-80">{date}</span>
      </div>

      <div className="mt-10 flex flex-col items-center">
        <span className="text-6xl font-thin text-white drop-shadow">
          {time}
        </span>
        <span className="mt-1 text-white/80">{date}</span>
      </div>

      {/* App grid */}
      <div className="mt-12 grid grid-cols-4 gap-x-4 gap-y-6 px-6">
        {allAppIds.map((id) => (
          <button
            key={id}
            onClick={() => setActive(id)}
            className="flex flex-col items-center gap-1.5"
          >
            <AppIcon id={id} className="h-14 w-14" glyphClassName="h-7 w-7" />
            <span className="text-[11px] font-medium text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.7)]">
              {apps[id].name}
            </span>
          </button>
        ))}
      </div>

      <Link
        href="/blog"
        className="absolute inset-x-0 bottom-6 mx-auto w-fit rounded-full bg-white/20 px-5 py-2 text-sm font-medium text-white backdrop-blur"
      >
        Read the Blog →
      </Link>

      {/* Full-screen app sheet */}
      <AnimatePresence>
        {active && ActiveApp && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 34 }}
            className="absolute inset-0 z-50 flex flex-col bg-[var(--background)]"
          >
            <div className="flex items-center gap-2 border-b border-hairline px-3 py-2">
              <button
                onClick={() => setActive(null)}
                className="flex items-center gap-1 rounded-md px-2 py-1 text-sm text-[var(--color-accent)]"
              >
                <ChevronLeft className="h-5 w-5" /> Home
              </button>
              <span className="font-medium">{apps[active].name}</span>
            </div>
            <div className="macos-scroll flex-1 overflow-auto">
              <ActiveApp />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
