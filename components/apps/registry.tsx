'use client';

import type { ComponentType } from 'react';
import { apps, type AppId } from '@/data/apps';

/**
 * Maps each AppId to the React component rendered inside its window.
 *
 * Phase 3 ships placeholders to prove the window manager; Phase 5 replaces
 * each entry with the real app implementation.
 */

function Placeholder({ id }: { id: AppId }) {
  const meta = apps[id];
  return (
    <div className="flex h-full flex-col items-center justify-center gap-2 p-8 text-center">
      <p className="text-lg font-semibold">{meta.name}</p>
      <p className="max-w-xs text-sm text-foreground/60">{meta.description}</p>
      <p className="mt-4 rounded-full bg-foreground/5 px-3 py-1 text-xs text-foreground/50">
        Coming in Phase 5
      </p>
    </div>
  );
}

export const appComponents: Record<AppId, ComponentType> = {
  about: () => <Placeholder id="about" />,
  terminal: () => <Placeholder id="terminal" />,
  projects: () => <Placeholder id="projects" />,
  resume: () => <Placeholder id="resume" />,
  blog: () => <Placeholder id="blog" />,
  contact: () => <Placeholder id="contact" />,
  photos: () => <Placeholder id="photos" />,
  settings: () => <Placeholder id="settings" />,
};
