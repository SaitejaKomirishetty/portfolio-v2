'use client';

import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, X } from 'lucide-react';
import { useUIStore } from '@/store/useUIStore';
import { AppIcon } from './AppIcon';
import { relativeTime } from '@/lib/datetime';

const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

/** macOS Notification Center — the panel that drops down from the menu-bar clock. */
export function NotificationCenter() {
  const open = useUIStore((s) => s.notificationCenterOpen);
  const close = useUIStore((s) => s.closeNotificationCenter);

  return (
    <AnimatePresence>
      {open && <NotificationPanel onClose={close} />}
    </AnimatePresence>
  );
}

function NotificationPanel({ onClose }: { onClose: () => void }) {
  const panelRef = useRef<HTMLDivElement>(null);
  const notifications = useUIStore((s) => s.notifications);
  const dismiss = useUIStore((s) => s.dismissNotification);
  const clearAll = useUIStore((s) => s.clearNotifications);

  useEffect(() => {
    const onDown = (e: PointerEvent) => {
      const t = e.target as HTMLElement;
      if (panelRef.current?.contains(t)) return;
      if (t.closest('[data-nc-trigger]')) return;
      onClose();
    };
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('pointerdown', onDown);
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  // Mini calendar for the current month.
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = [
    ...Array.from({ length: firstWeekday }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <motion.div
      ref={panelRef}
      initial={{ opacity: 0, scale: 0.96, y: -8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96, y: -8 }}
      transition={{ type: 'spring', stiffness: 460, damping: 32 }}
      style={{ transformOrigin: 'top right' }}
      className="vibrancy-strong fixed right-2 top-[34px] z-[6500] flex max-h-[80vh] w-80 flex-col overflow-hidden rounded-2xl border border-hairline shadow-2xl"
      role="dialog"
      aria-label="Notification Center"
    >
      <div className="macos-scroll flex-1 overflow-auto p-3">
        {/* Date + mini calendar widget */}
        <div className="mb-3 rounded-2xl bg-foreground/[0.06] p-3">
          <p className="text-xs font-medium text-[var(--color-accent)]">
            {today.toLocaleDateString(undefined, { weekday: 'long' })}
          </p>
          <p className="mb-2 text-2xl font-bold leading-tight">
            {today.getDate()}
          </p>
          <div className="grid grid-cols-7 gap-y-1 text-center text-[10px]">
            {WEEKDAYS.map((d, i) => (
              <span key={i} className="font-medium text-foreground/40">
                {d}
              </span>
            ))}
            {cells.map((d, i) => (
              <span
                key={i}
                className={
                  d === today.getDate()
                    ? 'mx-auto flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 font-semibold text-white'
                    : 'text-foreground/70'
                }
              >
                {d ?? ''}
              </span>
            ))}
          </div>
        </div>

        {/* Notifications */}
        <div className="mb-1 flex items-center justify-between px-1">
          <h2 className="text-sm font-semibold">Notifications</h2>
          {notifications.length > 0 && (
            <button
              onClick={clearAll}
              className="text-xs text-[var(--color-accent)] hover:underline"
            >
              Clear All
            </button>
          )}
        </div>

        {notifications.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-10 text-center text-foreground/40">
            <Bell className="h-7 w-7" />
            <p className="text-sm">No Notifications</p>
          </div>
        ) : (
          <ul className="space-y-2">
            <AnimatePresence initial={false}>
              {notifications.map((n) => (
                <motion.li
                  key={n.id}
                  layout
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 30 }}
                  className="group relative flex gap-2.5 rounded-2xl bg-foreground/[0.06] p-3"
                >
                  {n.appId ? (
                    <AppIcon
                      id={n.appId}
                      className="h-8 w-8 shrink-0"
                      glyphClassName="h-4 w-4"
                    />
                  ) : (
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[22%] bg-gradient-to-br from-zinc-500 to-zinc-700 text-white">
                      <Bell className="h-4 w-4" />
                    </span>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold leading-tight">
                      {n.title}
                    </p>
                    {n.body && (
                      <p className="mt-0.5 text-xs text-foreground/60">
                        {n.body}
                      </p>
                    )}
                    <p className="mt-1 text-[10px] text-foreground/40">
                      {relativeTime(n.createdAt)}
                    </p>
                  </div>
                  <button
                    onClick={() => dismiss(n.id)}
                    aria-label="Dismiss notification"
                    className="absolute right-1.5 top-1.5 rounded-full p-1 text-foreground/40 opacity-0 transition-opacity hover:bg-foreground/10 group-hover:opacity-100"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        )}
      </div>
    </motion.div>
  );
}
