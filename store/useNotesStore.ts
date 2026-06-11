'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface Note {
  id: string;
  title: string;
  body: string;
  updatedAt: number;
}

interface NotesStore {
  notes: Note[];
  selectedId: string | null;

  /** Create a blank note, select it, and return its id. */
  addNote: () => string;
  updateNote: (id: string, patch: { title?: string; body?: string }) => void;
  deleteNote: (id: string) => void;
  selectNote: (id: string | null) => void;
}

/** Stable, monotonically-distinct id generator (client-only clock). */
function makeId(): string {
  return `note-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

// Seed notes — anchored to fixed timestamps so order is stable on first run.
const SEED_BASE = 1_749_600_000_000; // a fixed point in time (June 2025-ish)

const seedNotes: Note[] = [
  {
    id: 'seed-welcome',
    title: 'Welcome to Notes',
    body:
      "This is a tiny Apple-Notes clone living inside the portfolio desktop.\n\n" +
      'Everything you type saves automatically and persists locally — close the ' +
      'window, refresh the page, it will all still be here.\n\n' +
      'Hit the + button to start a fresh note.',
    updatedAt: SEED_BASE + 2000,
  },
  {
    id: 'seed-todo',
    title: 'Things to build',
    body:
      '- A weather widget\n' +
      '- A little music player\n' +
      '- Drag-and-drop desktop icons\n' +
      '- Mission Control overview\n\n' +
      'Cross them off as you go.',
    updatedAt: SEED_BASE + 1000,
  },
  {
    id: 'seed-shortcuts',
    title: 'Keyboard shortcuts',
    body:
      'Cmd+Space — Spotlight\n' +
      'Cmd+W — Close window\n' +
      'Cmd+, — Settings\n\n' +
      'More coming soon.',
    updatedAt: SEED_BASE,
  },
];

export const useNotesStore = create<NotesStore>()(
  persist(
    (set, get) => ({
      notes: seedNotes,
      selectedId: seedNotes[0]?.id ?? null,

      addNote: () => {
        const id = makeId();
        const note: Note = { id, title: '', body: '', updatedAt: Date.now() };
        set((s) => ({ notes: [note, ...s.notes], selectedId: id }));
        return id;
      },

      updateNote: (id, patch) =>
        set((s) => ({
          notes: s.notes.map((n) =>
            n.id === id ? { ...n, ...patch, updatedAt: Date.now() } : n
          ),
        })),

      deleteNote: (id) => {
        const { notes, selectedId } = get();
        const remaining = notes.filter((n) => n.id !== id);
        // After deletion, select the most-recently-updated remaining note.
        const next =
          selectedId === id
            ? [...remaining].sort((a, b) => b.updatedAt - a.updatedAt)[0]?.id ?? null
            : selectedId;
        set({ notes: remaining, selectedId: next });
      },

      selectNote: (id) => set({ selectedId: id }),
    }),
    {
      name: 'portfolio-notes',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
