'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search } from 'lucide-react';
import { apps, allAppIds, type AppId } from '@/data/apps';
import { useUIStore } from '@/store/useUIStore';
import { useWindowStore } from '@/store/useWindowStore';
import { playSound } from '@/lib/sound';
import { AppIcon } from './AppIcon';
import { cn } from '@/lib/utils';

/**
 * macOS Launchpad — a full-screen, blurred-backdrop grid of every app with a
 * search field. Sits above windows + dock but below the menu bar, so the menu
 * bar stays usable. Click an app to launch it; Esc or a click on empty space
 * dismisses it.
 */
export function Launchpad() {
  const open = useUIStore((s) => s.launchpadOpen);
  const close = useUIStore((s) => s.closeLaunchpad);

  return (
    <AnimatePresence>{open && <LaunchpadPanel onClose={close} />}</AnimatePresence>
  );
}

function LaunchpadPanel({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState('');
  const openApp = useWindowStore((s) => s.open);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return allAppIds.filter(
      (id) =>
        !q ||
        apps[id].name.toLowerCase().includes(q) ||
        apps[id].description.toLowerCase().includes(q)
    );
  }, [query]);

  const launch = (id: AppId) => {
    playSound('open');
    openApp(id);
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
      onClick={onClose}
      className="absolute inset-0 z-[5500] flex flex-col items-center bg-black/45 px-6 pt-16 backdrop-blur-2xl"
      role="dialog"
      aria-label="Launchpad"
    >
      {/* Search */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="mb-12 flex w-72 items-center gap-2 rounded-lg bg-white/15 px-3 py-1.5 text-white ring-1 ring-white/20 backdrop-blur"
      >
        <Search className="h-4 w-4 opacity-70" />
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search"
          aria-label="Search apps"
          className="w-full bg-transparent text-sm outline-none placeholder:text-white/60"
        />
      </div>

      {/* Grid */}
      <motion.div
        initial={{ scale: 0.96, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 1.04, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
        onClick={(e) => e.stopPropagation()}
        className="grid w-full max-w-3xl grid-cols-4 gap-x-8 gap-y-9 sm:grid-cols-5 md:grid-cols-6"
      >
        {results.map((id, i) => (
          <motion.button
            key={id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: Math.min(i * 0.02, 0.2) }}
            onClick={() => launch(id)}
            className="group flex flex-col items-center gap-1.5 no-select"
          >
            <AppIcon
              id={id}
              className="h-16 w-16 transition-transform group-hover:scale-110 group-active:scale-95"
              glyphClassName="h-8 w-8"
            />
            <span className="max-w-[5.5rem] truncate text-xs font-medium text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.7)]">
              {apps[id].name}
            </span>
          </motion.button>
        ))}

        {results.length === 0 && (
          <p
            className={cn(
              'col-span-full mt-8 text-center text-sm text-white/70'
            )}
          >
            No apps matching “{query}”
          </p>
        )}
      </motion.div>
    </motion.div>
  );
}
