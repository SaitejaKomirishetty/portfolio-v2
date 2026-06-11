'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { CircleStop } from 'lucide-react';
import { apps, type AppId } from '@/data/apps';
import { useWindowStore } from '@/store/useWindowStore';
import { cn, clamp } from '@/lib/utils';

/* -------------------------------------------------------------------------- */
/*  Deterministic pseudo-metrics                                              */
/* -------------------------------------------------------------------------- */

/** Stable 32-bit string hash (FNV-1a flavored). */
function hashStr(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  // force unsigned
  return h >>> 0;
}

/** Base CPU% derived from a hash, in a believable range. */
function baseCpu(hash: number, heavy: boolean): number {
  const span = heavy ? 14 : 6.5;
  return ((hash % 1000) / 1000) * span + (heavy ? 1.2 : 0.2);
}

/** Base memory (MB) derived from a hash. */
function baseMem(hash: number, heavy: boolean): number {
  const span = heavy ? 1400 : 420;
  return Math.round(((hash >> 7) % 1000) / 1000 * span + (heavy ? 180 : 40));
}

/** Deterministic 4-5 digit PID from a hash. */
function pidFrom(hash: number): number {
  return (hash % 58000) + 380;
}

const TOTAL_MEMORY_MB = 16384; // 16 GB

/** Static "system" processes for flavor. None are quittable. */
const SYSTEM_PROCESSES: { key: string; name: string }[] = [
  { key: 'sys:kernel_task', name: 'kernel_task' },
  { key: 'sys:WindowServer', name: 'WindowServer' },
  { key: 'sys:Finder', name: 'Finder' },
  { key: 'sys:portfolioOS', name: 'portfolioOS' },
  { key: 'sys:Dock', name: 'Dock' },
];

interface ProcRow {
  /** Stable React key. */
  key: string;
  name: string;
  pid: number;
  /** AppId if this process is a quittable open window, else null. */
  appId: AppId | null;
  cpu: number;
  mem: number;
}

/* -------------------------------------------------------------------------- */
/*  Component                                                                 */
/* -------------------------------------------------------------------------- */

export function ActivityMonitor() {
  const windows = useWindowStore((s) => s.windows);
  const close = useWindowStore((s) => s.close);

  // A monotonically increasing "tick" drives the live jitter without
  // recomputing the deterministic base values.
  const [tick, setTick] = useState(0);
  const [cpuHistory, setCpuHistory] = useState<number[]>(() =>
    Array.from({ length: 40 }, () => 0)
  );
  const [selectedKey, setSelectedKey] = useState<string | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setTick((t) => t + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // The set of currently open window ids (subscribed → re-renders on open/close).
  const openIds = useMemo(
    () => (Object.keys(windows) as AppId[]).filter((id) => windows[id]),
    [windows]
  );

  // Build the process list. Base values are deterministic; a small live jitter
  // is layered on each tick so the numbers feel alive but never wildly jump.
  const processes = useMemo<ProcRow[]>(() => {
    const jitter = (seed: number, amp: number) => {
      // Smooth-ish per-tick wobble; deterministic given seed + tick.
      const phase = (seed % 360) * (Math.PI / 180);
      return (Math.sin(tick * 0.9 + phase) + Math.sin(tick * 0.37 + phase * 1.7)) * amp;
    };

    const appRows: ProcRow[] = openIds.map((id) => {
      const h = hashStr(id);
      const cpu = clamp(baseCpu(h, true) + jitter(h, 1.6), 0, 100);
      const mem = Math.max(20, baseMem(h, true) + Math.round(jitter(h >> 3, 24)));
      return {
        key: `app:${id}`,
        name: apps[id].name,
        pid: pidFrom(h),
        appId: id,
        cpu,
        mem,
      };
    });

    const systemRows: ProcRow[] = SYSTEM_PROCESSES.map((p) => {
      const h = hashStr(p.key);
      // kernel_task & WindowServer feel a touch heavier.
      const heavy = p.name === 'kernel_task' || p.name === 'WindowServer';
      const cpu = clamp(baseCpu(h, heavy) + jitter(h, heavy ? 1.1 : 0.5), 0, 100);
      const mem = Math.max(20, baseMem(h, heavy) + Math.round(jitter(h >> 3, 14)));
      return {
        key: p.key,
        name: p.name,
        pid: pidFrom(h),
        appId: null,
        cpu,
        mem,
      };
    });

    return [...appRows, ...systemRows].sort((a, b) => b.cpu - a.cpu);
  }, [openIds, tick]);

  // Total CPU = clamped sum of per-process CPU.
  const totalCpu = clamp(
    processes.reduce((sum, p) => sum + p.cpu, 0),
    0,
    100
  );
  const usedMem = processes.reduce((sum, p) => sum + p.mem, 0);
  const memPct = clamp((usedMem / TOTAL_MEMORY_MB) * 100, 0, 100);

  // Push the latest total CPU onto the rolling history (keyed off tick so it
  // updates in lock-step with the jitter).
  const lastTick = useRef(-1);
  useEffect(() => {
    if (lastTick.current === tick) return;
    lastTick.current = tick;
    setCpuHistory((prev) => {
      const next = [...prev.slice(1), totalCpu];
      return next;
    });
    // totalCpu intentionally read fresh each tick; depend only on tick.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tick]);

  // Selection is derived: a process that closes simply stops matching, so the
  // quit button disables itself and no row highlights — no reset effect needed.
  const selected = processes.find((p) => p.key === selectedKey) ?? null;
  const canQuit = !!selected?.appId;

  const handleQuit = () => {
    if (selected?.appId) {
      close(selected.appId);
      setSelectedKey(null);
    }
  };

  return (
    <div className="flex h-full flex-col bg-[var(--background)] text-foreground no-select">
      {/* Toolbar */}
      <div className="flex items-center gap-3 border-b border-hairline px-4 py-2.5">
        <button
          onClick={handleQuit}
          disabled={!canQuit}
          aria-label="Quit selected process"
          className={cn(
            'flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-medium transition-colors',
            canQuit
              ? 'border-red-500/40 text-red-500 hover:bg-red-500/10'
              : 'border-hairline text-foreground/30'
          )}
        >
          <CircleStop className="h-3.5 w-3.5" />
          Quit Process
        </button>
        <div className="ml-auto text-xs text-foreground/50 tabular-nums">
          {processes.length} processes
        </div>
      </div>

      {/* Dashboard */}
      <div className="grid grid-cols-[180px_1fr] gap-4 border-b border-hairline px-4 py-4">
        {/* CPU big number + history graph */}
        <div className="rounded-xl border border-hairline bg-foreground/[0.03] p-3">
          <div className="text-[11px] font-semibold uppercase tracking-wide text-foreground/40">
            CPU Load
          </div>
          <div className="mt-1 font-mono text-3xl font-semibold tabular-nums">
            {totalCpu.toFixed(1)}
            <span className="ml-0.5 text-base text-foreground/40">%</span>
          </div>
          <div className="mt-1 text-[11px] text-foreground/40">
            {processes.length} threads active
          </div>
        </div>

        <div className="rounded-xl border border-hairline bg-foreground/[0.03] p-3">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wide text-foreground/40">
              CPU History
            </span>
            <span className="font-mono text-[11px] text-foreground/40 tabular-nums">
              60s
            </span>
          </div>
          <Sparkline data={cpuHistory} />

          {/* Memory bar */}
          <div className="mt-3">
            <div className="mb-1 flex items-center justify-between text-[11px]">
              <span className="font-semibold uppercase tracking-wide text-foreground/40">
                Memory
              </span>
              <span className="font-mono text-foreground/60 tabular-nums">
                {(usedMem / 1024).toFixed(2)} GB / {(TOTAL_MEMORY_MB / 1024).toFixed(0)} GB
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-foreground/10">
              <div
                className="h-full rounded-full bg-[var(--color-accent)] transition-[width] duration-700 ease-out"
                style={{ width: `${memPct}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Process table */}
      <div className="flex min-h-0 flex-1 flex-col">
        {/* Column header */}
        <div className="grid grid-cols-[1fr_72px_72px_88px] items-center gap-2 border-b border-hairline px-4 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-foreground/40">
          <span>Process</span>
          <span className="text-right">PID</span>
          <span className="text-right">CPU %</span>
          <span className="text-right">Memory</span>
        </div>

        <div className="macos-scroll min-h-0 flex-1 overflow-auto">
          {processes.map((p) => {
            const isSelected = p.key === selectedKey;
            return (
              <button
                key={p.key}
                onClick={() => setSelectedKey(p.key)}
                aria-pressed={isSelected}
                className={cn(
                  'grid w-full grid-cols-[1fr_72px_72px_88px] items-center gap-2 border-b border-hairline px-4 py-1.5 text-left text-[13px] transition-colors',
                  isSelected
                    ? 'bg-[var(--color-accent)] text-white'
                    : 'hover:bg-foreground/5'
                )}
              >
                <span className="flex items-center gap-2 truncate">
                  <span
                    className={cn(
                      'h-1.5 w-1.5 shrink-0 rounded-full',
                      p.appId
                        ? isSelected
                          ? 'bg-white'
                          : 'bg-[var(--color-traffic-green)]'
                        : isSelected
                          ? 'bg-white/60'
                          : 'bg-foreground/30'
                    )}
                  />
                  <span className="truncate">{p.name}</span>
                  {!p.appId && (
                    <span
                      className={cn(
                        'shrink-0 rounded px-1 text-[9px] font-medium uppercase tracking-wide',
                        isSelected ? 'bg-white/20 text-white/90' : 'bg-foreground/10 text-foreground/40'
                      )}
                    >
                      system
                    </span>
                  )}
                </span>
                <span className="text-right font-mono tabular-nums opacity-90">
                  {p.pid}
                </span>
                <span className="text-right font-mono tabular-nums">
                  {p.cpu.toFixed(1)}
                </span>
                <span className="text-right font-mono tabular-nums">
                  {p.mem} MB
                </span>
              </button>
            );
          })}

          {processes.length === 0 && (
            <div className="px-4 py-10 text-center text-sm text-foreground/40">
              No running processes.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Sparkline                                                                 */
/* -------------------------------------------------------------------------- */

function Sparkline({ data }: { data: number[] }) {
  const W = 100;
  const H = 36;
  const n = data.length;

  const points = useMemo(() => {
    if (n === 0) return '';
    return data
      .map((v, i) => {
        const x = n === 1 ? W : (i / (n - 1)) * W;
        const y = H - (clamp(v, 0, 100) / 100) * H;
        return `${x.toFixed(2)},${y.toFixed(2)}`;
      })
      .join(' ');
  }, [data, n]);

  const areaPoints = points ? `0,${H} ${points} ${W},${H}` : '';

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="none"
      className="h-9 w-full"
      role="img"
      aria-label="CPU usage over the last 60 seconds"
    >
      <defs>
        <linearGradient id="am-cpu-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0.32" />
          <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0" />
        </linearGradient>
      </defs>
      {areaPoints && <polygon points={areaPoints} fill="url(#am-cpu-fill)" />}
      {points && (
        <polyline
          points={points}
          fill="none"
          stroke="var(--color-accent)"
          strokeWidth={1.5}
          strokeLinejoin="round"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
      )}
    </svg>
  );
}
