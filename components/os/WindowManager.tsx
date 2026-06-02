'use client';

import { AnimatePresence } from 'motion/react';
import { useWindowStore } from '@/store/useWindowStore';
import { appComponents } from '@/components/apps/registry';
import { Window } from './Window';

/**
 * Renders every open window. Stacking is driven by each window's zIndex in
 * the store; AnimatePresence handles open/close spring transitions.
 */
export function WindowManager() {
  const order = useWindowStore((s) => s.order);

  return (
    <AnimatePresence>
      {order.map((id) => {
        const AppComponent = appComponents[id];
        return (
          <Window key={id} id={id}>
            <AppComponent />
          </Window>
        );
      })}
    </AnimatePresence>
  );
}
