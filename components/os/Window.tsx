'use client';

import {
  useCallback,
  useEffect,
  useRef,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from 'react';
import {
  motion,
  animate,
  useMotionValue,
  useReducedMotion,
} from 'motion/react';
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
  const gesture = useRef<Gesture | null>(null);

  // Position + size live as motion values so drag/resize update the transform
  // directly (no React re-render, no spring) — the window tracks the cursor
  // 1:1. They are committed back to the store only when a gesture ends.
  const x = useMotionValue(win?.bounds.x ?? 0);
  const y = useMotionValue(win?.bounds.y ?? 0);
  const w = useMotionValue(win?.bounds.width ?? meta.defaultSize.width);
  const h = useMotionValue(win?.bounds.height ?? meta.defaultSize.height);

  const minW = meta.minSize?.width ?? 360;
  const minH = meta.minSize?.height ?? 240;

  // Move keyboard focus into the window when it opens (accessibility).
  useEffect(() => {
    rootRef.current?.focus({ preventScroll: true });
  }, []);

  const bx = win?.bounds.x;
  const by = win?.bounds.y;
  const bw = win?.bounds.width;
  const bh = win?.bounds.height;
  const minimized = win?.minimized ?? false;

  // Sync motion values to the store when geometry changes (maximize / restore
  // / minimize / open / drag-commit). During a drag the store isn't written
  // until release, so these deps don't change mid-drag and this never fights
  // the pointer.
  useEffect(() => {
    if (bx == null || by == null) return;
    const vw = typeof window !== 'undefined' ? window.innerWidth : 1440;
    const vh = typeof window !== 'undefined' ? window.innerHeight : 900;
    const transition = reduceMotion
      ? { duration: 0 }
      : { duration: 0.28, ease: 'easeOut' as const };

    const targetX = minimized ? (vw - (bw ?? 0)) / 2 : bx;
    const targetY = minimized ? vh : by;

    const controls = [
      animate(x, targetX, transition),
      animate(y, targetY, transition),
      animate(w, bw ?? 0, transition),
      animate(h, bh ?? 0, transition),
    ];
    return () => controls.forEach((c) => c.stop());
  }, [bx, by, bw, bh, minimized, reduceMotion, x, y, w, h]);

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
        x.set(clamp(g.start.x + dx, 60 - g.start.width, vw - 60));
        y.set(clamp(g.start.y + dy, MENUBAR_HEIGHT, maxY - 16));
        return;
      }

      // Resize — adjust the edges named in the direction.
      let nx = g.start.x;
      let ny = g.start.y;
      let nw = g.start.width;
      let nh = g.start.height;
      const dir = g.type;
      if (dir.includes('e')) nw = g.start.width + dx;
      if (dir.includes('s')) nh = g.start.height + dy;
      if (dir.includes('w')) {
        nw = g.start.width - dx;
        nx = g.start.x + dx;
      }
      if (dir.includes('n')) {
        nh = g.start.height - dy;
        ny = g.start.y + dy;
      }

      // Enforce minimums while keeping the anchored edge fixed.
      if (nw < minW) {
        if (dir.includes('w')) nx = g.start.x + (g.start.width - minW);
        nw = minW;
      }
      if (nh < minH) {
        if (dir.includes('n')) ny = g.start.y + (g.start.height - minH);
        nh = minH;
      }
      ny = Math.max(MENUBAR_HEIGHT, ny);

      x.set(nx);
      y.set(ny);
      w.set(nw);
      h.set(nh);
    },
    [x, y, w, h, minW, minH]
  );

  const endGesture = useCallback(() => {
    const g = gesture.current;
    gesture.current = null;
    document.body.style.userSelect = '';
    g?.controller.abort();
    // Commit the final geometry to the store in a single update.
    setBounds(id, {
      x: x.get(),
      y: y.get(),
      width: w.get(),
      height: h.get(),
    });
  }, [id, setBounds, x, y, w, h]);

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
        // Seed from the live motion values (current on-screen geometry).
        start: { x: x.get(), y: y.get(), width: w.get(), height: h.get() },
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
    [id, focus, onPointerMove, endGesture, x, y, w, h]
  );

  useEffect(() => endGesture, [endGesture]);

  if (!win) return null;

  const { zIndex } = win;

  return (
    <motion.div
      ref={rootRef}
      role="dialog"
      aria-label={`${meta.name} window`}
      aria-modal={false}
      tabIndex={-1}
      onPointerDown={() => focus(id)}
      onKeyDown={onTrapKeyDown}
      initial={reduceMotion ? false : { scale: 0.94, opacity: 0 }}
      animate={{
        // Position + size are motion values; only scale/opacity animate here.
        scale: minimized ? (reduceMotion ? 1 : 0.08) : 1,
        opacity: minimized ? 0 : 1,
      }}
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
        x,
        y,
        width: w,
        height: h,
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
