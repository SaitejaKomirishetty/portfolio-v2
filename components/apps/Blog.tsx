'use client';

import { useState } from 'react';
import { Clock, ArrowUpRight, NotebookPen } from 'lucide-react';
import { usePosts } from '@/hooks/usePosts';
import { cn } from '@/lib/utils';

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/** Notes-style Blog app: list of posts + a preview pane linking to /blog. */
export function Blog() {
  const { posts, loading } = usePosts();
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  // Derive the shown post: explicit selection, else the newest post.
  const active = posts.find((p) => p.slug === activeSlug) ?? posts[0] ?? null;

  return (
    <div className="flex h-full">
      {/* List */}
      <aside className="macos-scroll w-56 shrink-0 overflow-auto border-r border-hairline">
        <div className="flex items-center gap-2 border-b border-hairline px-3 py-2 text-sm font-semibold">
          <NotebookPen className="h-4 w-4" /> Blog
        </div>
        {loading && (
          <p className="p-4 text-sm text-foreground/50">Loading posts…</p>
        )}
        {posts.map((p) => (
          <button
            key={p.slug}
            onClick={() => setActiveSlug(p.slug)}
            className={cn(
              'block w-full border-b border-hairline px-3 py-2.5 text-left',
              active?.slug === p.slug
                ? 'bg-[var(--color-accent)]/15'
                : 'hover:bg-foreground/5'
            )}
          >
            <p className="line-clamp-1 text-sm font-medium">{p.title}</p>
            <p className="mt-0.5 text-xs text-foreground/50">
              {formatDate(p.date)} · {p.readingTime}
            </p>
          </button>
        ))}
      </aside>

      {/* Preview */}
      <div className="macos-scroll flex-1 overflow-auto p-6">
        {active ? (
          <article>
            <div className="flex flex-wrap gap-1.5">
              {active.tags.map((t) => (
                <span
                  key={t}
                  className="rounded-full bg-foreground/10 px-2 py-0.5 text-[11px]"
                >
                  #{t}
                </span>
              ))}
            </div>
            <h1 className="mt-3 text-2xl font-bold leading-tight">
              {active.title}
            </h1>
            <p className="mt-1 flex items-center gap-1 text-sm text-foreground/50">
              {formatDate(active.date)}
              <span className="mx-1">·</span>
              <Clock className="h-3.5 w-3.5" /> {active.readingTime}
            </p>
            <p className="mt-4 text-[15px] leading-relaxed text-foreground/80">
              {active.description}
            </p>
            <a
              href={`/blog/${active.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-1.5 rounded-full bg-[var(--color-accent)] px-4 py-1.5 text-sm font-medium text-white hover:bg-[var(--color-accent-hover)]"
            >
              Read full article <ArrowUpRight className="h-4 w-4" />
            </a>
          </article>
        ) : (
          !loading && (
            <p className="text-sm text-foreground/50">No posts yet.</p>
          )
        )}
      </div>
    </div>
  );
}
