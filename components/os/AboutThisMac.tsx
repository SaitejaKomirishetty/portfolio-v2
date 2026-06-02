'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { Avatar } from './Avatar';
import { useUIStore } from '@/store/useUIStore';
import { profile } from '@/data/profile';

const SPECS: { label: string; value: string }[] = [
  { label: 'Framework', value: 'Next.js 16 · React 19' },
  { label: 'Language', value: 'TypeScript (strict)' },
  { label: 'Styling', value: 'Tailwind CSS v4' },
  { label: 'Motion', value: 'Framer Motion' },
  { label: 'State', value: 'Zustand' },
];

/** A fun "About This Mac"-style modal describing the portfolio itself. */
export function AboutThisMac() {
  const open = useUIStore((s) => s.aboutOpen);
  const close = useUIStore((s) => s.closeAbout);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, close]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={close}
          className="fixed inset-0 z-[8000] flex items-center justify-center bg-black/40 p-4"
        >
          <motion.div
            initial={{ scale: 0.94, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.94, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
            className="vibrancy relative w-full max-w-sm rounded-2xl border border-hairline p-8 text-center shadow-2xl"
          >
            <button
              type="button"
              aria-label="Close"
              onClick={close}
              className="absolute right-3 top-3 rounded-full p-1 text-foreground/50 hover:bg-foreground/10"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex flex-col items-center gap-3">
              <Avatar size={88} />
              <div>
                <h2 className="text-lg font-semibold">{profile.name}</h2>
                <p className="text-sm text-foreground/60">{profile.role}</p>
              </div>
            </div>

            <p className="mt-4 text-sm text-foreground/70">
              This portfolio is a love letter to macOS, rebuilt as an
              interactive desktop on the web.
            </p>

            <dl className="mt-5 space-y-1.5 text-left text-[13px]">
              {SPECS.map((s) => (
                <div
                  key={s.label}
                  className="flex justify-between border-b border-hairline pb-1.5"
                >
                  <dt className="text-foreground/50">{s.label}</dt>
                  <dd className="font-medium">{s.value}</dd>
                </div>
              ))}
            </dl>

            <a
              href={profile.socials.github}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-block rounded-full bg-[var(--color-accent)] px-4 py-1.5 text-sm font-medium text-white hover:bg-[var(--color-accent-hover)]"
            >
              View source on GitHub
            </a>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
