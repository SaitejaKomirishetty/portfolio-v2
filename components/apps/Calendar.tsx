'use client';

import { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { experience } from '@/data/experience';
import { cn } from '@/lib/utils';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;
const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
] as const;
const MONTH_ABBR = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
] as const;

interface DayCell {
  year: number;
  month: number; // 0-indexed
  day: number;
  inMonth: boolean;
}

/** A single day in a cell, keyed by year-month-day for comparisons. */
function dayKey(year: number, month: number, day: number) {
  return `${year}-${month}-${day}`;
}

/** Parse experience start strings (e.g. "Jan 2025") into year-month markers. */
function buildExperienceMarkers(): Map<
  string,
  { year: number; month: number; labels: string[] }
> {
  const map = new Map<
    string,
    { year: number; month: number; labels: string[] }
  >();
  for (const job of experience) {
    const parts = job.start.trim().split(/\s+/);
    if (parts.length < 2) continue;
    const month = MONTH_ABBR.findIndex(
      (m) => m.toLowerCase() === parts[0].slice(0, 3).toLowerCase()
    );
    const year = Number.parseInt(parts[1], 10);
    if (month < 0 || Number.isNaN(year)) continue;
    const key = `${year}-${month}`;
    const label = `${job.role} · ${job.company}`;
    const existing = map.get(key);
    if (existing) existing.labels.push(label);
    else map.set(key, { year, month, labels: [label] });
  }
  return map;
}

/** Build a 6x7 grid of day cells for the given month, Sunday-first. */
function buildMonthGrid(year: number, month: number): DayCell[] {
  const firstWeekday = new Date(year, month, 1).getDay(); // 0 = Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: DayCell[] = [];

  // Leading days from the previous month.
  if (firstWeekday > 0) {
    const prevMonth = month === 0 ? 11 : month - 1;
    const prevYear = month === 0 ? year - 1 : year;
    const daysInPrev = new Date(year, month, 0).getDate();
    for (let i = firstWeekday - 1; i >= 0; i--) {
      cells.push({
        year: prevYear,
        month: prevMonth,
        day: daysInPrev - i,
        inMonth: false,
      });
    }
  }

  // Current month days.
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ year, month, day: d, inMonth: true });
  }

  // Trailing days from the next month to fill 6 rows (42 cells).
  const nextMonth = month === 11 ? 0 : month + 1;
  const nextYear = month === 11 ? year + 1 : year;
  let trailingDay = 1;
  while (cells.length < 42) {
    cells.push({
      year: nextYear,
      month: nextMonth,
      day: trailingDay++,
      inMonth: false,
    });
  }

  return cells;
}

export function Calendar() {
  // Fresh date at mount — client only, so the browser clock is fine.
  const today = useMemo(() => new Date(), []);
  const todayKey = dayKey(today.getFullYear(), today.getMonth(), today.getDate());

  const [view, setView] = useState<{ year: number; month: number }>({
    year: today.getFullYear(),
    month: today.getMonth(),
  });
  // Direction drives the slide animation: 1 = forward, -1 = back.
  const [direction, setDirection] = useState(0);
  const [selected, setSelected] = useState<string | null>(todayKey);

  const markers = useMemo(() => buildExperienceMarkers(), []);
  const cells = useMemo(
    () => buildMonthGrid(view.year, view.month),
    [view.year, view.month]
  );

  const goToMonth = (delta: number) => {
    setDirection(delta);
    setView((prev) => {
      const total = prev.month + delta;
      const year = prev.year + Math.floor(total / 12);
      const month = ((total % 12) + 12) % 12;
      return { year, month };
    });
  };

  const goToToday = () => {
    const targetIsBefore =
      view.year < today.getFullYear() ||
      (view.year === today.getFullYear() && view.month < today.getMonth());
    setDirection(targetIsBefore ? 1 : -1);
    setView({ year: today.getFullYear(), month: today.getMonth() });
    setSelected(todayKey);
  };

  const selectedCell = useMemo(() => {
    if (!selected) return null;
    return cells.find(
      (c) => dayKey(c.year, c.month, c.day) === selected
    );
  }, [cells, selected]);

  const selectedMarker = selectedCell
    ? markers.get(`${selectedCell.year}-${selectedCell.month}`)
    : undefined;

  return (
    <div className="flex h-full flex-col bg-[var(--background)] text-foreground">
      {/* Header */}
      <header className="flex items-center justify-between gap-4 border-b border-hairline px-5 py-3">
        <h1 className="text-2xl font-bold tracking-tight">
          {MONTH_NAMES[view.month]}{' '}
          <span className="text-foreground/40 font-semibold">{view.year}</span>
        </h1>
        <div className="flex items-center gap-1">
          <button
            onClick={goToToday}
            className="rounded-lg border border-hairline px-3 py-1 text-[13px] font-medium transition-colors hover:bg-foreground/5"
          >
            Today
          </button>
          <div className="ml-1 flex items-center">
            <button
              onClick={() => goToMonth(-1)}
              aria-label="Previous month"
              className="rounded-lg p-1.5 text-foreground/70 transition-colors hover:bg-foreground/10 hover:text-foreground"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => goToMonth(1)}
              aria-label="Next month"
              className="rounded-lg p-1.5 text-foreground/70 transition-colors hover:bg-foreground/10 hover:text-foreground"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Weekday header row */}
      <div className="grid grid-cols-7 border-b border-hairline px-1 pb-1 pt-1.5">
        {WEEKDAYS.map((wd) => (
          <div
            key={wd}
            className="text-center text-[11px] font-semibold uppercase tracking-wide text-foreground/40"
          >
            {wd}
          </div>
        ))}
      </div>

      {/* Month grid */}
      <div className="relative flex-1 overflow-hidden">
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
            key={`${view.year}-${view.month}`}
            custom={direction}
            initial={{ opacity: 0, x: direction === 0 ? 0 : direction * 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -24 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="grid h-full grid-cols-7 grid-rows-6"
          >
            {cells.map((cell) => {
              const key = dayKey(cell.year, cell.month, cell.day);
              const isToday = key === todayKey;
              const isSelected = key === selected;
              const hasMarker = markers.has(`${cell.year}-${cell.month}`);
              const isFirstOfMonth = cell.day === 1;

              return (
                <button
                  key={key}
                  onClick={() => setSelected(key)}
                  aria-label={`${MONTH_NAMES[cell.month]} ${cell.day}, ${cell.year}`}
                  aria-pressed={isSelected}
                  className={cn(
                    'group relative flex flex-col items-center border-b border-r border-hairline px-1 pt-1.5 text-left outline-none transition-colors',
                    'focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--color-accent)]',
                    isSelected ? 'bg-[var(--color-accent)]/10' : 'hover:bg-foreground/5'
                  )}
                >
                  <span
                    className={cn(
                      'flex h-7 w-7 items-center justify-center rounded-full text-[13px] tabular-nums transition-colors',
                      isToday && 'bg-rose-500 font-semibold text-white',
                      !isToday && cell.inMonth && 'font-medium text-foreground',
                      !isToday && !cell.inMonth && 'text-foreground/30'
                    )}
                  >
                    {isFirstOfMonth && !cell.inMonth ? (
                      <span className="text-[11px] font-semibold">
                        {MONTH_ABBR[cell.month]} {cell.day}
                      </span>
                    ) : (
                      cell.day
                    )}
                  </span>
                  {hasMarker && (
                    <span
                      aria-hidden
                      className={cn(
                        'mt-0.5 h-1.5 w-1.5 rounded-full',
                        cell.inMonth
                          ? 'bg-[var(--color-accent)]'
                          : 'bg-[var(--color-accent)]/40'
                      )}
                    />
                  )}
                </button>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Selected-day strip */}
      <footer className="flex min-h-[44px] items-center gap-3 border-t border-hairline px-5 py-2">
        {selectedCell ? (
          <>
            <div className="flex flex-col leading-tight">
              <span className="text-[11px] uppercase tracking-wide text-foreground/40">
                {WEEKDAYS[new Date(selectedCell.year, selectedCell.month, selectedCell.day).getDay()]}
              </span>
              <span className="text-sm font-semibold">
                {MONTH_NAMES[selectedCell.month]} {selectedCell.day},{' '}
                {selectedCell.year}
              </span>
            </div>
            <div className="ml-auto flex flex-col items-end gap-0.5 text-right">
              {selectedMarker ? (
                selectedMarker.labels.map((label) => (
                  <span
                    key={label}
                    className="flex items-center gap-1.5 text-xs text-foreground/70"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]" />
                    Started: {label}
                  </span>
                ))
              ) : (
                <span className="text-xs text-foreground/40">No events</span>
              )}
            </div>
          </>
        ) : (
          <span className="text-xs text-foreground/40">Select a day</span>
        )}
      </footer>
    </div>
  );
}
