'use client';

import { X, Minus, Maximize2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TrafficLightsProps {
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  /** Whether the parent window is focused (controls glyph visibility on hover). */
  active: boolean;
}

/**
 * macOS traffic-light window controls. Glyphs appear on hover of the group.
 */
export function TrafficLights({
  onClose,
  onMinimize,
  onMaximize,
  active,
}: TrafficLightsProps) {
  return (
    <div className="group/lights flex items-center gap-2 no-select">
      <Light
        color="bg-[var(--color-traffic-red)]"
        label="Close window"
        active={active}
        onClick={onClose}
      >
        <X className="h-2 w-2 text-black/60" strokeWidth={3} />
      </Light>
      <Light
        color="bg-[var(--color-traffic-yellow)]"
        label="Minimize window"
        active={active}
        onClick={onMinimize}
      >
        <Minus className="h-2 w-2 text-black/60" strokeWidth={3} />
      </Light>
      <Light
        color="bg-[var(--color-traffic-green)]"
        label="Maximize window"
        active={active}
        onClick={onMaximize}
      >
        <Maximize2 className="h-[7px] w-[7px] text-black/60" strokeWidth={3} />
      </Light>
    </div>
  );
}

function Light({
  color,
  label,
  active,
  onClick,
  children,
}: {
  color: string;
  label: string;
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      // Don't start a window drag when clicking a control.
      onPointerDown={(e) => e.stopPropagation()}
      className={cn(
        'flex h-3 w-3 items-center justify-center rounded-full transition-colors',
        active ? color : 'bg-zinc-400/60 dark:bg-zinc-600',
        'focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:outline-none'
      )}
    >
      <span className="opacity-0 transition-opacity group-hover/lights:opacity-100">
        {children}
      </span>
    </button>
  );
}
