'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { Search, CornerDownLeft } from 'lucide-react';
import { useUIStore } from '@/store/useUIStore';
import { useWindowStore } from '@/store/useWindowStore';
import { usePosts } from '@/hooks/usePosts';
import { apps, allAppIds, type AppId } from '@/data/apps';
import { AppIcon } from './AppIcon';
import { cn } from '@/lib/utils';

type Result =
  | { kind: 'app'; id: AppId; title: string; subtitle: string }
  | { kind: 'post'; slug: string; title: string; subtitle: string };

/** Spotlight search overlay — launch apps and find blog posts. */
export function Spotlight() {
  const open = useUIStore((s) => s.spotlightOpen);
  const close = useUIStore((s) => s.closeSpotlight);

  return (
    <AnimatePresence>
      {open && <SpotlightPanel key="spotlight" onClose={close} />}
    </AnimatePresence>
  );
}

function SpotlightPanel({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(0);
  const router = useRouter();
  const openApp = useWindowStore((s) => s.open);
  const { posts } = usePosts();

  const results = useMemo<Result[]>(() => {
    const q = query.trim().toLowerCase();
    const appResults: Result[] = allAppIds
      .map((id) => apps[id])
      .filter(
        (a) =>
          !q ||
          a.name.toLowerCase().includes(q) ||
          a.description.toLowerCase().includes(q)
      )
      .map((a) => ({
        kind: 'app',
        id: a.id,
        title: a.name,
        subtitle: a.description,
      }));

    const postResults: Result[] = posts
      .filter(
        (p) =>
          q &&
          (p.title.toLowerCase().includes(q) ||
            p.tags.some((t) => t.toLowerCase().includes(q)) ||
            p.description.toLowerCase().includes(q))
      )
      .map((p) => ({
        kind: 'post',
        slug: p.slug,
        title: p.title,
        subtitle: `Blog · ${p.readingTime}`,
      }));

    return [...appResults, ...postResults];
  }, [query, posts]);

  const activate = (r: Result | undefined) => {
    if (!r) return;
    onClose();
    if (r.kind === 'app') openApp(r.id);
    else router.push(`/blog/${r.slug}`);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
    else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelected((s) => Math.min(results.length - 1, s + 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelected((s) => Math.max(0, s - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      activate(results[selected]);
    }
  };

  const clampedSelected = Math.min(selected, Math.max(0, results.length - 1));

  // Keep the highlighted result scrolled into view during arrow navigation.
  const listRef = useRef<HTMLUListElement>(null);
  useEffect(() => {
    const item = listRef.current?.children[clampedSelected] as
      | HTMLElement
      | undefined;
    item?.scrollIntoView({ block: 'nearest' });
  }, [clampedSelected]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-[8500] flex items-center justify-center px-4"
    >
      <motion.div
        initial={{ scale: 0.96, y: -8, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.96, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 460, damping: 32 }}
        onClick={(e) => e.stopPropagation()}
        className="vibrancy w-full max-w-lg overflow-hidden rounded-2xl border border-hairline shadow-2xl"
      >
        <div className="flex items-center gap-3 border-b border-hairline px-4">
          <Search className="h-5 w-5 text-foreground/40" />
          <input
            autoFocus
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelected(0);
            }}
            onKeyDown={onKeyDown}
            placeholder="Spotlight Search"
            aria-label="Spotlight Search"
            className="flex-1 bg-transparent py-3.5 text-lg outline-none placeholder:text-foreground/40"
          />
        </div>

        {results.length > 0 && (
          <ul ref={listRef} className="macos-scroll max-h-80 overflow-auto p-2">
            {results.map((r, i) => {
              const isSel = i === clampedSelected;
              return (
                <li key={r.kind === 'app' ? r.id : r.slug}>
                  <button
                    onMouseEnter={() => setSelected(i)}
                    onClick={() => activate(r)}
                    className={cn(
                      'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left',
                      isSel ? 'bg-[var(--color-accent)] text-white' : ''
                    )}
                  >
                    {r.kind === 'app' ? (
                      <AppIcon
                        id={r.id}
                        className="h-8 w-8"
                        glyphClassName="h-4 w-4"
                      />
                    ) : (
                      <span className="flex h-8 w-8 items-center justify-center rounded-[22%] bg-gradient-to-br from-yellow-300 to-amber-500 text-white">
                        ✎
                      </span>
                    )}
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium">
                        {r.title}
                      </span>
                      <span
                        className={cn(
                          'block truncate text-xs',
                          isSel ? 'text-white/80' : 'text-foreground/50'
                        )}
                      >
                        {r.subtitle}
                      </span>
                    </span>
                    {isSel && <CornerDownLeft className="h-4 w-4 opacity-70" />}
                  </button>
                </li>
              );
            })}
          </ul>
        )}

        {query && results.length === 0 && (
          <p className="p-6 text-center text-sm text-foreground/50">
            No results for “{query}”
          </p>
        )}
      </motion.div>
    </motion.div>
  );
}
