'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useUIStore } from '@/store/useUIStore';
import { useWindowStore } from '@/store/useWindowStore';
import { useTheme } from 'next-themes';

/** Right-click desktop context menu. */
export function ContextMenu() {
  const menu = useUIStore((s) => s.contextMenu);
  const closeMenu = useUIStore((s) => s.closeContextMenu);
  const open = useWindowStore((s) => s.open);
  const { resolvedTheme, setTheme } = useTheme();

  useEffect(() => {
    if (!menu) return;
    const onDown = () => closeMenu();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && closeMenu();
    window.addEventListener('pointerdown', onDown);
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('keydown', onKey);
    };
  }, [menu, closeMenu]);

  const items = [
    { label: 'Change Wallpaper…', onSelect: () => open('settings') },
    {
      label: `Switch to ${resolvedTheme === 'dark' ? 'Light' : 'Dark'} Mode`,
      onSelect: () => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark'),
    },
    { label: 'Open Terminal', onSelect: () => open('terminal') },
    { label: 'System Settings…', onSelect: () => open('settings') },
  ];

  return (
    <AnimatePresence>
      {menu && (
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.1 }}
          style={{ left: menu.x, top: menu.y }}
          // Stop the global pointerdown handler from closing before click fires.
          onPointerDown={(e) => e.stopPropagation()}
          className="vibrancy fixed z-[7000] min-w-52 rounded-lg border border-hairline p-1 shadow-2xl no-select"
        >
          {items.map((item) => (
            <button
              key={item.label}
              onClick={() => {
                item.onSelect();
                closeMenu();
              }}
              className="flex w-full rounded-md px-3 py-1 text-left text-[13px] hover:bg-[var(--color-accent)] hover:text-white"
            >
              {item.label}
            </button>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
