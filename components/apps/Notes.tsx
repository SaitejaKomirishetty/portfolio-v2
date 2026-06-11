'use client';

import { useEffect, useMemo, useRef } from 'react';
import { Plus, Trash2, NotebookPen } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { cn } from '@/lib/utils';
import { useNotesStore, type Note } from '@/store/useNotesStore';

/** Human-friendly relative time, falling back to a short date. */
function relativeTime(ts: number): string {
  const now = Date.now();
  const diff = now - ts;
  if (diff < 0) return 'just now';

  const minute = 60_000;
  const hour = 60 * minute;
  const day = 24 * hour;

  if (diff < minute) return 'just now';
  if (diff < hour) return `${Math.floor(diff / minute)}m ago`;
  if (diff < day) return `${Math.floor(diff / hour)}h ago`;

  const date = new Date(ts);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const sameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  if (sameDay(date, yesterday)) return 'Yesterday';

  const sameYear = date.getFullYear() === today.getFullYear();
  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    ...(sameYear ? {} : { year: 'numeric' }),
  });
}

/** Derive a display title from the title field or the first non-empty body line. */
function displayTitle(note: Note): string {
  const t = note.title.trim();
  if (t) return t;
  const firstLine = note.body.split('\n').find((l) => l.trim().length > 0);
  return firstLine?.trim() || 'New Note';
}

/** One-line snippet from the body (excluding whatever became the title). */
function snippet(note: Note): string {
  const lines = note.body.split('\n').map((l) => l.trim());
  // If there's no explicit title, the first body line is the title — skip it.
  const startIdx = note.title.trim() ? 0 : lines.findIndex((l) => l.length > 0) + 1;
  const rest = lines.slice(Math.max(startIdx, 0)).find((l) => l.length > 0);
  return rest || 'No additional text';
}

export function Notes() {
  const notes = useNotesStore((s) => s.notes);
  const selectedId = useNotesStore((s) => s.selectedId);
  const addNote = useNotesStore((s) => s.addNote);
  const updateNote = useNotesStore((s) => s.updateNote);
  const deleteNote = useNotesStore((s) => s.deleteNote);
  const selectNote = useNotesStore((s) => s.selectNote);

  const sorted = useMemo(
    () => [...notes].sort((a, b) => b.updatedAt - a.updatedAt),
    [notes]
  );

  const selected = useMemo(
    () => notes.find((n) => n.id === selectedId) ?? null,
    [notes, selectedId]
  );

  const titleRef = useRef<HTMLInputElement>(null);

  // Focus the title field when a brand-new (empty) note becomes selected.
  const prevSelected = useRef<string | null>(null);
  useEffect(() => {
    if (
      selected &&
      selected.id !== prevSelected.current &&
      !selected.title &&
      !selected.body
    ) {
      titleRef.current?.focus();
    }
    prevSelected.current = selected?.id ?? null;
  }, [selected]);

  const handleNew = () => {
    addNote();
    // Focus happens via the effect once the new (empty) note is selected.
  };

  return (
    <div className="flex h-full bg-[var(--background)] text-foreground">
      {/* Sidebar */}
      <aside className="vibrancy flex w-56 flex-col border-r border-hairline">
        <div className="flex items-center justify-between px-3 py-2.5">
          <span className="text-sm font-semibold text-foreground/60">Notes</span>
          <button
            type="button"
            onClick={handleNew}
            aria-label="New note"
            className="flex h-7 w-7 items-center justify-center rounded-md text-foreground/70 hover:bg-foreground/10 hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-accent)]"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>

        <ul className="macos-scroll flex-1 overflow-auto px-2 pb-2">
          <AnimatePresence initial={false}>
            {sorted.map((note) => {
              const active = note.id === selectedId;
              return (
                <motion.li
                  key={note.id}
                  layout
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.18 }}
                >
                  <button
                    type="button"
                    onClick={() => selectNote(note.id)}
                    aria-current={active}
                    className={cn(
                      'mb-1 w-full rounded-lg px-3 py-2 text-left transition-colors',
                      active
                        ? 'bg-foreground/10'
                        : 'hover:bg-foreground/5'
                    )}
                  >
                    <div className="truncate text-sm font-semibold">
                      {displayTitle(note)}
                    </div>
                    <div className="mt-0.5 flex items-center gap-2 text-xs">
                      <span className="text-foreground/50">
                        {relativeTime(note.updatedAt)}
                      </span>
                      <span className="truncate text-foreground/40">
                        {snippet(note)}
                      </span>
                    </div>
                  </button>
                </motion.li>
              );
            })}
          </AnimatePresence>

          {sorted.length === 0 && (
            <li className="px-3 py-6 text-center text-xs text-foreground/40">
              No notes yet
            </li>
          )}
        </ul>
      </aside>

      {/* Editor */}
      <section className="flex min-w-0 flex-1 flex-col">
        {selected ? (
          <>
            <div className="flex items-center justify-between border-b border-hairline px-4 py-1.5">
              <span className="text-xs text-foreground/40">
                {relativeTime(selected.updatedAt)}
              </span>
              <button
                type="button"
                onClick={() => deleteNote(selected.id)}
                aria-label="Delete note"
                className="flex h-7 w-7 items-center justify-center rounded-md text-foreground/60 hover:bg-foreground/10 hover:text-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-accent)]"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>

            <div className="macos-scroll flex flex-1 flex-col overflow-auto px-5 py-4">
              <input
                ref={titleRef}
                value={selected.title}
                onChange={(e) =>
                  updateNote(selected.id, { title: e.target.value })
                }
                placeholder="Title"
                aria-label="Note title"
                className="w-full bg-transparent text-xl font-bold text-foreground outline-none placeholder:text-foreground/30"
              />
              <textarea
                value={selected.body}
                onChange={(e) =>
                  updateNote(selected.id, { body: e.target.value })
                }
                placeholder="Start writing…"
                aria-label="Note body"
                className="macos-scroll mt-3 w-full flex-1 resize-none bg-transparent text-sm leading-relaxed text-foreground/90 outline-none placeholder:text-foreground/30"
              />
            </div>
          </>
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-3 text-foreground/40">
            <NotebookPen className="h-10 w-10" strokeWidth={1.4} />
            <p className="text-sm">No note selected</p>
            <button
              type="button"
              onClick={handleNew}
              className="rounded-full bg-[var(--color-accent)] px-4 py-1.5 text-sm font-medium text-white hover:bg-[var(--color-accent-hover)]"
            >
              Create a note
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
