'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { projects } from '@/data/projects';

/**
 * Simple Photos gallery. Uses project screenshots as sample images.
 * TODO: swap in personal photos by adding files to /public/photos and
 * editing this list.
 */
const gallery = projects
  .filter((p) => p.image)
  .map((p) => ({ src: p.image as string, caption: p.title }));

export function Photos() {
  const [active, setActive] = useState<number | null>(null);
  const [broken, setBroken] = useState<Set<number>>(new Set());

  const markBroken = (i: number) =>
    setBroken((s) => new Set(s).add(i));

  return (
    <div className="macos-scroll h-full overflow-auto p-4">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {gallery.map((photo, i) =>
          broken.has(i) ? null : (
            <button
              key={i}
              onClick={() => setActive(i)}
              className="aspect-square overflow-hidden rounded-lg bg-zinc-800"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photo.src}
                alt={photo.caption}
                loading="lazy"
                onError={() => markBroken(i)}
                className="h-full w-full object-cover transition-transform hover:scale-105"
              />
            </button>
          )
        )}
      </div>

      <AnimatePresence>
        {active !== null && gallery[active] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActive(null)}
            className="absolute inset-0 z-20 flex items-center justify-center bg-black/80 p-6"
          >
            <button
              className="absolute right-3 top-3 rounded-full bg-white/10 p-2 text-white"
              onClick={() => setActive(null)}
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={gallery[active].src}
              alt={gallery[active].caption}
              className="max-h-full max-w-full rounded-lg object-contain"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
