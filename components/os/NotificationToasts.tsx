'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, X } from 'lucide-react';
import { useUIStore } from '@/store/useUIStore';
import { useWindowStore } from '@/store/useWindowStore';
import { AppIcon } from './AppIcon';

/** How long a notification shows as a floating banner before retreating to the center. */
const TOAST_MS = 5500;

/**
 * Transient notification banners in the top-right. Newest notifications appear
 * as banners for a few seconds, then live on only in Notification Center.
 * Suppressed while Focus (Do Not Disturb) is on.
 */
export function NotificationToasts() {
  const notifications = useUIStore((s) => s.notifications);
  const dnd = useUIStore((s) => s.dnd);
  const dismiss = useUIStore((s) => s.dismissNotification);
  const openApp = useWindowStore((s) => s.open);

  const [now, setNow] = useState(() => Date.now());

  // Tick while any notification could still be within its banner window.
  useEffect(() => {
    const hasFresh = notifications.some((n) => Date.now() - n.createdAt < TOAST_MS);
    if (!hasFresh) return;
    const t = setInterval(() => setNow(Date.now()), 500);
    return () => clearInterval(t);
  }, [notifications]);

  if (dnd) return null;

  const fresh = notifications.filter((n) => now - n.createdAt < TOAST_MS);

  return (
    <div className="pointer-events-none fixed right-2 top-9 z-[6200] flex w-80 flex-col gap-2">
      <AnimatePresence initial={false}>
        {fresh.map((n) => (
          <motion.div
            key={n.id}
            layout
            initial={{ opacity: 0, x: 40, scale: 0.96 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 60, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 420, damping: 34 }}
            onClick={() => {
              if (n.appId) openApp(n.appId);
              dismiss(n.id);
            }}
            className="vibrancy-strong group pointer-events-auto relative flex cursor-default gap-2.5 rounded-2xl border border-hairline p-3 shadow-2xl"
          >
            {n.appId ? (
              <AppIcon
                id={n.appId}
                className="h-9 w-9 shrink-0"
                glyphClassName="h-[18px] w-[18px]"
              />
            ) : (
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[22%] bg-gradient-to-br from-zinc-500 to-zinc-700 text-white">
                <Bell className="h-[18px] w-[18px]" />
              </span>
            )}
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold leading-tight">{n.title}</p>
              {n.body && (
                <p className="mt-0.5 text-xs text-foreground/65">{n.body}</p>
              )}
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                dismiss(n.id);
              }}
              aria-label="Dismiss notification"
              className="absolute right-1.5 top-1.5 rounded-full p-1 text-foreground/40 opacity-0 transition-opacity hover:bg-foreground/10 group-hover:opacity-100"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
