'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

export interface MenuItem {
  label?: string;
  onSelect?: () => void;
  disabled?: boolean;
  /** Render a separator instead of an item. */
  separator?: boolean;
  /** Right-aligned shortcut hint, e.g. "⌘W". */
  shortcut?: string;
}

/**
 * A menu-bar dropdown: a trigger (text or node) that opens a vibrancy panel
 * of items. Closes on outside click or Escape.
 */
export function MenuDropdown({
  trigger,
  items,
  triggerClassName,
  align = 'left',
  ariaLabel,
}: {
  trigger: ReactNode;
  items: MenuItem[];
  triggerClassName?: string;
  align?: 'left' | 'right';
  /** Accessible name for the trigger button (needed for icon-only triggers). */
  ariaLabel?: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-label={ariaLabel}
        onClick={() => setOpen((o) => !o)}
        className={cn(
          'flex items-center rounded px-2 py-0.5 text-[13px] transition-colors',
          open ? 'bg-white/20' : 'hover:bg-white/10',
          triggerClassName
        )}
      >
        {trigger}
      </button>

      {open && (
        <div
          role="menu"
          className={cn(
            'vibrancy absolute top-[calc(100%+4px)] z-50 min-w-52 rounded-lg border border-hairline p-1 shadow-2xl',
            align === 'right' ? 'right-0' : 'left-0'
          )}
        >
          {items.map((item, i) =>
            item.separator ? (
              <div key={i} className="my-1 h-px bg-foreground/10" />
            ) : (
              <button
                key={i}
                role="menuitem"
                disabled={item.disabled}
                onClick={() => {
                  item.onSelect?.();
                  setOpen(false);
                }}
                className={cn(
                  'flex w-full items-center justify-between gap-6 rounded-md px-3 py-1 text-left text-[13px]',
                  item.disabled
                    ? 'cursor-default text-foreground/30'
                    : 'hover:bg-[var(--color-accent)] hover:text-white'
                )}
              >
                <span>{item.label}</span>
                {item.shortcut && (
                  <span className="text-xs opacity-60">{item.shortcut}</span>
                )}
              </button>
            )
          )}
        </div>
      )}
    </div>
  );
}
