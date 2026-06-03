'use client';

import { useEffect } from 'react';
import { useWindowStore } from '@/store/useWindowStore';
import { useUIStore } from '@/store/useUIStore';

/**
 * Global keyboard shortcuts:
 *   ⌘/Ctrl + Space → toggle Spotlight
 *   ⌘/Ctrl + W     → close focused window
 *   ⌘/Ctrl + M     → minimize focused window
 * Renders nothing; just registers listeners.
 */
export function KeyboardShortcuts() {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const mod = e.metaKey || e.ctrlKey;
      if (!mod) return;

      const { focused, close, minimize } = useWindowStore.getState();

      if (e.code === 'Space') {
        e.preventDefault();
        useUIStore.getState().toggleSpotlight();
      } else if (e.key.toLowerCase() === 'w' && focused) {
        e.preventDefault();
        close(focused);
      } else if (e.key.toLowerCase() === 'm' && focused) {
        e.preventDefault();
        minimize(focused);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return null;
}
