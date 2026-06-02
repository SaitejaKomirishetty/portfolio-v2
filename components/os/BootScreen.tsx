'use client';

import { useEffect } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { AppleLogo } from './icons/AppleLogo';

/** Apple-logo boot screen with a progress bar that fills, then completes. */
export function BootScreen({ onComplete }: { onComplete: () => void }) {
  const reduce = useReducedMotion();
  const duration = reduce ? 0.4 : 2.2;

  useEffect(() => {
    const t = setTimeout(onComplete, duration * 1000 + 200);
    return () => clearTimeout(t);
  }, [onComplete, duration]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[10000] flex flex-col items-center justify-center gap-10 bg-black"
    >
      <AppleLogo className="h-20 w-20 text-white" />
      <div className="h-1.5 w-48 overflow-hidden rounded-full bg-white/20">
        <motion.div
          className="h-full rounded-full bg-white"
          initial={{ width: '0%' }}
          animate={{ width: '100%' }}
          transition={{ duration, ease: 'easeInOut' }}
        />
      </div>
    </motion.div>
  );
}
