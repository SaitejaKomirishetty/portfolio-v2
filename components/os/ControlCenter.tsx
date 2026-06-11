'use client';

import {
  useCallback,
  useEffect,
  useRef,
  type PointerEvent as ReactPointerEvent,
} from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useTheme } from 'next-themes';
import {
  Wifi,
  Bluetooth,
  Moon,
  Sun,
  Volume2,
  VolumeX,
  Sunrise,
  Plane,
} from 'lucide-react';
import { useUIStore } from '@/store/useUIStore';
import { useSystemStore, MIN_BRIGHTNESS } from '@/store/useSystemStore';
import { useMounted } from '@/hooks/useMounted';
import { cn, clamp } from '@/lib/utils';

/** macOS Control Center — a top-right dropdown of quick system toggles. */
export function ControlCenter() {
  const open = useUIStore((s) => s.controlCenterOpen);
  const close = useUIStore((s) => s.closeControlCenter);

  return (
    <AnimatePresence>
      {open && <ControlCenterPanel onClose={close} />}
    </AnimatePresence>
  );
}

function ControlCenterPanel({ onClose }: { onClose: () => void }) {
  const panelRef = useRef<HTMLDivElement>(null);
  const mounted = useMounted();
  const { resolvedTheme, setTheme } = useTheme();

  const wifi = useUIStore((s) => s.wifi);
  const bluetooth = useUIStore((s) => s.bluetooth);
  const dnd = useUIStore((s) => s.dnd);
  const toggleWifi = useUIStore((s) => s.toggleWifi);
  const toggleBluetooth = useUIStore((s) => s.toggleBluetooth);
  const toggleDnd = useUIStore((s) => s.toggleDnd);

  const soundEnabled = useSystemStore((s) => s.soundEnabled);
  const toggleSound = useSystemStore((s) => s.toggleSound);
  const brightness = useSystemStore((s) => s.brightness);
  const setBrightness = useSystemStore((s) => s.setBrightness);

  const isDark = mounted && resolvedTheme === 'dark';

  // Dismiss on outside-click (but not when clicking the menu-bar trigger, which
  // owns the toggle) and on Escape.
  useEffect(() => {
    const onDown = (e: PointerEvent) => {
      const t = e.target as HTMLElement;
      if (panelRef.current?.contains(t)) return;
      if (t.closest('[data-cc-trigger]')) return;
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

  return (
    <motion.div
      ref={panelRef}
      initial={{ opacity: 0, scale: 0.96, y: -8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96, y: -8 }}
      transition={{ type: 'spring', stiffness: 460, damping: 32 }}
      style={{ transformOrigin: 'top right' }}
      className="vibrancy-strong fixed right-2 top-[34px] z-[6500] w-80 rounded-2xl border border-hairline p-3 shadow-2xl"
      role="dialog"
      aria-label="Control Center"
    >
      {/* Connectivity */}
      <div className="mb-2 rounded-2xl bg-foreground/[0.06] p-3">
        <div className="space-y-2.5">
          <Radio
            on={wifi}
            onClick={toggleWifi}
            icon={<Wifi className="h-4 w-4" />}
            title="Wi-Fi"
            subtitle={wifi ? 'portfolioOS' : 'Off'}
          />
          <Radio
            on={bluetooth}
            onClick={toggleBluetooth}
            icon={<Bluetooth className="h-4 w-4" />}
            title="Bluetooth"
            subtitle={bluetooth ? 'On' : 'Off'}
          />
          <Radio
            on={dnd}
            onClick={toggleDnd}
            icon={<Plane className="h-4 w-4" />}
            title="Airplane Mode"
            subtitle={dnd ? 'On' : 'Off'}
          />
        </div>
      </div>

      {/* Focus + Dark mode tiles */}
      <div className="mb-2 grid grid-cols-2 gap-2">
        <Tile
          on={dnd}
          onClick={toggleDnd}
          icon={<Moon className="h-4 w-4" />}
          label="Focus"
          sub={dnd ? 'On' : 'Off'}
        />
        <Tile
          on={isDark}
          onClick={() => setTheme(isDark ? 'light' : 'dark')}
          icon={isDark ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          label={isDark ? 'Dark' : 'Light'}
          sub="Appearance"
        />
      </div>

      {/* Display brightness */}
      <div className="mb-2 rounded-2xl bg-foreground/[0.06] p-3">
        <p className="mb-2 text-xs font-medium text-foreground/60">Display</p>
        <Slider
          value={(brightness - MIN_BRIGHTNESS) / (1 - MIN_BRIGHTNESS)}
          onChange={(f) => setBrightness(MIN_BRIGHTNESS + f * (1 - MIN_BRIGHTNESS))}
          icon={<Sunrise className="h-4 w-4" />}
          ariaLabel="Display brightness"
        />
      </div>

      {/* Sound */}
      <div className="rounded-2xl bg-foreground/[0.06] p-3">
        <Radio
          on={soundEnabled}
          onClick={toggleSound}
          icon={
            soundEnabled ? (
              <Volume2 className="h-4 w-4" />
            ) : (
              <VolumeX className="h-4 w-4" />
            )
          }
          title="Sound Effects"
          subtitle={soundEnabled ? 'On' : 'Off'}
        />
      </div>
    </motion.div>
  );
}

/** A connectivity row that lights up its icon chip when on. */
function Radio({
  on,
  onClick,
  icon,
  title,
  subtitle,
}: {
  on: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <button
      onClick={onClick}
      role="switch"
      aria-checked={on}
      aria-label={title}
      className="flex w-full items-center gap-3 text-left"
    >
      <span
        className={cn(
          'flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors',
          on
            ? 'bg-[var(--color-accent)] text-white'
            : 'bg-foreground/15 text-foreground/70'
        )}
      >
        {icon}
      </span>
      <span className="min-w-0">
        <span className="block text-sm font-medium leading-tight">{title}</span>
        <span className="block truncate text-xs text-foreground/50">
          {subtitle}
        </span>
      </span>
    </button>
  );
}

/** A square toggle tile (Focus, Appearance). */
function Tile({
  on,
  onClick,
  icon,
  label,
  sub,
}: {
  on: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  sub: string;
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={on}
      className="flex flex-col gap-2 rounded-2xl bg-foreground/[0.06] p-3 text-left transition-colors hover:bg-foreground/[0.1]"
    >
      <span
        className={cn(
          'flex h-7 w-7 items-center justify-center rounded-full transition-colors',
          on
            ? 'bg-[var(--color-accent)] text-white'
            : 'bg-foreground/15 text-foreground/70'
        )}
      >
        {icon}
      </span>
      <span className="leading-tight">
        <span className="block text-sm font-medium">{label}</span>
        <span className="block text-[11px] text-foreground/50">{sub}</span>
      </span>
    </button>
  );
}

/** A macOS-style draggable slider; value is a 0..1 fraction. */
function Slider({
  value,
  onChange,
  icon,
  ariaLabel,
}: {
  value: number;
  onChange: (fraction: number) => void;
  icon: React.ReactNode;
  ariaLabel: string;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const fromPointer = useCallback(
    (clientX: number) => {
      const rect = trackRef.current?.getBoundingClientRect();
      if (!rect) return;
      onChange(clamp((clientX - rect.left) / rect.width, 0, 1));
    },
    [onChange]
  );

  const onPointerDown = (e: ReactPointerEvent) => {
    dragging.current = true;
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    fromPointer(e.clientX);
  };
  const onPointerMove = (e: ReactPointerEvent) => {
    if (dragging.current) fromPointer(e.clientX);
  };
  const onPointerUp = () => {
    dragging.current = false;
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
      e.preventDefault();
      onChange(clamp(value + 0.05, 0, 1));
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
      e.preventDefault();
      onChange(clamp(value - 0.05, 0, 1));
    }
  };

  const pct = `${Math.round(value * 100)}%`;

  return (
    <div
      ref={trackRef}
      role="slider"
      tabIndex={0}
      aria-label={ariaLabel}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(value * 100)}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onKeyDown={onKeyDown}
      className="relative h-7 w-full cursor-pointer touch-none overflow-hidden rounded-full bg-foreground/15 no-select"
    >
      <div
        className="absolute inset-y-0 left-0 bg-white/90"
        style={{ width: pct }}
      />
      <span className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 text-foreground/70 mix-blend-difference">
        {icon}
      </span>
    </div>
  );
}
