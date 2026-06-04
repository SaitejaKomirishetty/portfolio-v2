'use client';

import { AnimatePresence } from 'motion/react';
import { useWindowStore, type WindowState } from '@/store/useWindowStore';
import { appComponents } from '@/components/apps/registry';
import { Window } from './Window';

/**
 * Renders every open window. Windows are rendered in a STABLE order (their open
 * order via `openSeq`), never reordered on focus — focus only changes each
 * window's `zIndex`, which alone drives visual stacking + hit-testing. Keeping
 * the DOM order fixed means React never moves the keyed window subtrees, so each
 * window's scroll position (a plain DOM property) is preserved across focus
 * changes. AnimatePresence handles open/close spring transitions.
 */
export function WindowManager() {
  const windows = useWindowStore((s) => s.windows);

  const ordered = (Object.values(windows).filter(Boolean) as WindowState[]).sort(
    (a, b) => a.openSeq - b.openSeq
  );

  return (
    <AnimatePresence>
      {ordered.map((win) => {
        const AppComponent = appComponents[win.id];
        return (
          <Window key={win.id} id={win.id}>
            <AppComponent />
          </Window>
        );
      })}
    </AnimatePresence>
  );
}
