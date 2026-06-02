'use client';

import { useEffect } from 'react';
import { motion } from 'motion/react';
import { ChevronRight } from 'lucide-react';
import { Avatar } from './Avatar';
import { useClock } from '@/hooks/useClock';
import { profile } from '@/data/profile';

/** Login screen: avatar + name; click the button or press Enter to log in. */
export function LoginScreen({
  wallpaperCss,
  onLogin,
}: {
  wallpaperCss: string;
  onLogin: () => void;
}) {
  const { time, date } = useClock();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') onLogin();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onLogin]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9000] flex flex-col items-center justify-center"
      style={{ background: wallpaperCss }}
    >
      <div className="absolute inset-0 bg-black/30 backdrop-blur-xl" />

      <div className="absolute top-20 flex flex-col items-center text-white no-select">
        <span className="text-7xl font-thin tabular-nums drop-shadow-lg">
          {time}
        </span>
        <span className="mt-1 text-lg font-medium opacity-90">{date}</span>
      </div>

      <motion.div
        initial={{ y: 12, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="relative flex flex-col items-center gap-4 text-white"
      >
        <Avatar size={104} />
        <span className="text-xl font-semibold drop-shadow">
          {profile.name}
        </span>
        <button
          type="button"
          onClick={onLogin}
          autoFocus
          className="group flex items-center gap-2 rounded-full bg-white/20 px-5 py-2 text-sm font-medium backdrop-blur transition-colors hover:bg-white/30 focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
        >
          Click to log in
          <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </button>
        <span className="text-xs opacity-70">or press Enter</span>
      </motion.div>
    </motion.div>
  );
}
