'use client';

import {
  useCallback,
  useEffect,
  useRef,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { useWindowStore } from '@/store/useWindowStore';
import { apps, type AppId } from '@/data/apps';
import { TrafficLights } from './TrafficLights';
import { MENUBAR_HEIGHT, DOCK_RESERVED } from '@/lib/constants';
import { cn, clamp } from '@/lib/utils';

interface WindowProps {
  id: AppId;
  children: ReactNode;
}

type ResizeDir = 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw';

interface Gesture {
  type: 'drag' | ResizeDir;
  startX: number;
  startY: number;
  start: { x: number; y: number; width: number; height: number };
  controller: AbortController;
}

export function Window({ id, children }: WindowProps) {
  const meta = apps[id];
  const win = useWindowStore((s) => s.windows[id]);
  const focused = useWindowStore((s) => s.focused === id);
  const focus = useWindowStore((s) => s.focus);
  const close = useWindowStore((s) => s.close);
  const minimize = useWindowStore((s) => s.minimize);
  const toggleMaximize = useWindowStore((s) => s.toggleMaximize);
  const setBounds = useWindowStore((s) => s.setBounds);

  const reduceMotion = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  // Live drag/resize is tracked imperatively to avoid React re-render churn;
  // we read/commit bounds through the store.
  const gesture = useRef<Gesture | null>(null);

  // Move keyboard focus into the window when it opens (accessibility).
  useEffect(() => {
    rootRef.current?.focus({ preventScroll: true });
  }, []);

  // Trap Tab focus within the window so keyboard users stay scoped to it.
  const onTrapKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== 'Tab' || !rootRef.current) return;
    const focusable = rootRef.current.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), input, textarea, select, [tabindex]:not([tabindex="-1"])'
    );
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  const minW = meta.minSize?.width ?? 360;
  const minH = meta.minSize?.height ?? 240;

  const onPointerMove = useCallback(
    (e: PointerEvent) => {
      const g = gesture.current;
      if (!g) return;
      const dx = e.clientX - g.startX;
      const dy = e.clientY - g.startY;
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const maxY = vh - DOCK_RESERVED;

      if (g.type === 'drag') {
        const x = clamp(g.start.x + dx, 60 - g.start.width, vw - 60);
        const y = clamp(g.start.y + dy, MENUBAR_HEIGHT, maxY - 16);
        setBounds(id, { x, y });
        return;
      }

      // Resize — adjust the edges named in the direction.
      let { x, y, width, height } = g.start;
      const dir = g.type;
      if (dir.includes('e')) width = g.start.width + dx;
      if (dir.includes('s')) height = g.start.height + dy;
      if (dir.includes('w')) {
        width = g.start.width - dx;
        x = g.start.x + dx;
      }
      if (dir.includes('n')) {
        height = g.start.height - dy;
        y = g.start.y + dy;
      }

      // Enforce minimums while keeping the anchored edge fixed.
      if (width < minW) {
        if (dir.includes('w')) x = g.start.x + (g.start.width - minW);
        width = minW;
      }
      if (height < minH) {
        if (dir.includes('n')) y = g.start.y + (g.start.height - minH);
        height = minH;
      }
      y = Math.max(MENUBAR_HEIGHT, y);
      setBounds(id, { x, y, width, height });
    },
    [id, setBounds, minW, minH]
  );

  const endGesture = useCallback(() => {
    gesture.current?.controller.abort();
    gesture.current = null;
    document.body.style.userSelect = '';
  }, []);

  // Begin a drag or resize gesture; listeners auto-remove via AbortController.
  const startGesture = useCallback(
    (type: Gesture['type'], e: ReactPointerEvent) => {
      const current = useWindowStore.getState().windows[id];
      if (!current || current.maximized) return;
      focus(id);
      const controller = new AbortController();
      gesture.current = {
        type,
        startX: e.clientX,
        startY: e.clientY,
        start: { ...current.bounds },
        controller,
      };
      document.body.style.userSelect = 'none';
      window.addEventListener('pointermove', onPointerMove, {
        signal: controller.signal,
      });
      window.addEventListener('pointerup', endGesture, {
        signal: controller.signal,
      });
    },
    [id, focus, onPointerMove, endGesture]
  );

  useEffect(() => endGesture, [endGesture]);

  if (!win) return null;

  const { bounds, zIndex, minimized } = win;

  return (
    <motion.div
      ref={rootRef}
      role="dialog"
      aria-label={`${meta.name} window`}
      aria-modal={false}
      tabIndex={-1}
      onPointerDown={() => focus(id)}
      onKeyDown={onTrapKeyDown}
      initial={
        reduceMotion ? false : { scale: 0.92, opacity: 0, y: bounds.y + 12 }
      }
      animate={
        minimized
          ? {
              // Shrink + fade toward the bottom-center of the screen.
              scale: reduceMotion ? 1 : 0.08,
              opacity: 0,
              x:
                typeof window !== 'undefined'
                  ? (window.innerWidth - bounds.width) / 2
                  : bounds.x,
              y: typeof window !== 'undefined' ? window.innerHeight : 900,
            }
          : { scale: 1, opacity: 1, x: bounds.x, y: bounds.y }
      }
      exit={reduceMotion ? { opacity: 0 } : { scale: 0.92, opacity: 0 }}
      transition={
        reduceMotion
          ? { duration: 0 }
          : { type: 'spring', stiffness: 420, damping: 32, mass: 0.8 }
      }
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        width: bounds.width,
        height: bounds.height,
        zIndex,
        transformOrigin: 'bottom center',
        pointerEvents: minimized ? 'none' : 'auto',
      }}
      className={cn(
        'flex flex-col overflow-hidden rounded-xl border border-hairline',
        'bg-[var(--background)]',
        focused
          ? 'shadow-[0_22px_70px_-12px_rgba(0,0,0,0.55)]'
          : 'shadow-[0_12px_40px_-12px_rgba(0,0,0,0.4)]'
      )}
    >
      {/* Title bar */}
      <div
        onPointerDown={(e) => startGesture('drag', e)}
        onDoubleClick={() => toggleMaximize(id)}
        className={cn(
          'relative flex h-9 shrink-0 items-center gap-2 px-3 no-select',
          'vibrancy border-b border-hairline',
          win.maximized ? 'cursor-default' : 'cursor-grab active:cursor-grabbing'
        )}
      >
        <TrafficLights
          active={focused}
          onClose={() => close(id)}
          onMinimize={() => minimize(id)}
          onMaximize={() => toggleMaximize(id)}
        />
        <span
          className={cn(
            'pointer-events-none absolute left-1/2 -translate-x-1/2 text-[13px] font-medium',
            focused ? 'text-foreground/90' : 'text-foreground/45'
          )}
        >
          {meta.name}
        </span>
      </div>

      {/* Content */}
      <div className="macos-scroll relative flex-1 overflow-auto bg-[var(--background)]">
        {children}
      </div>

      {/* Resize handles (hidden while maximized) */}
      {!win.maximized && <ResizeHandles onStart={startGesture} />}
    </motion.div>
  );
}

function ResizeHandles({
  onStart,
}: {
  onStart: (dir: ResizeDir, e: ReactPointerEvent) => void;
}) {
  const edge = 'absolute z-10';
  const handle = (dir: ResizeDir) => (e: ReactPointerEvent) => {
    e.stopPropagation();
    onStart(dir, e);
  };
  return (
    <>
      <div
        className={cn(edge, 'inset-x-2 top-0 h-1 cursor-ns-resize')}
        onPointerDown={handle('n')}
      />
      <div
        className={cn(edge, 'inset-x-2 bottom-0 h-1 cursor-ns-resize')}
        onPointerDown={handle('s')}
      />
      <div
        className={cn(edge, 'inset-y-2 left-0 w-1 cursor-ew-resize')}
        onPointerDown={handle('w')}
      />
      <div
        className={cn(edge, 'inset-y-2 right-0 w-1 cursor-ew-resize')}
        onPointerDown={handle('e')}
      />
      <div
        className={cn(edge, 'left-0 top-0 h-3 w-3 cursor-nwse-resize')}
        onPointerDown={handle('nw')}
      />
      <div
        className={cn(edge, 'right-0 top-0 h-3 w-3 cursor-nesw-resize')}
        onPointerDown={handle('ne')}
      />
      <div
        className={cn(edge, 'bottom-0 left-0 h-3 w-3 cursor-nesw-resize')}
        onPointerDown={handle('sw')}
      />
      <div
        className={cn(edge, 'bottom-0 right-0 h-3 w-3 cursor-nwse-resize')}
        onPointerDown={handle('se')}
      />
    </>
  );
}
