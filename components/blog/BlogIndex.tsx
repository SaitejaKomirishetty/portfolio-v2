'use client';

import { useMemo, useState } from 'react';
import type { PostMeta } from '@/lib/blog';
import { PostCard } from './PostCard';
import { cn } from '@/lib/utils';

/** Client-side tag filtering over the (server-provided) post list. */
export function BlogIndex({
  posts,
  tags,
}: {
  posts: PostMeta[];
  tags: string[];
}) {
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const filtered = useMemo(
    () =>
      activeTag ? posts.filter((p) => p.tags.includes(activeTag)) : posts,
    [posts, activeTag]
  );

  return (
    <div>
      {tags.length > 0 && (
        <div className="mb-6 flex flex-wrap gap-2">
          <TagButton
            label="All"
            active={activeTag === null}
            onClick={() => setActiveTag(null)}
          />
          {tags.map((tag) => (
            <TagButton
              key={tag}
              label={`#${tag}`}
              active={activeTag === tag}
              onClick={() => setActiveTag(tag)}
            />
          ))}
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        {filtered.map((post, i) => (
          <PostCard key={post.slug} post={post} priority={i < 2} />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-foreground/50">No posts for this tag yet.</p>
      )}
    </div>
  );
}

function TagButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'rounded-full border px-3 py-1 text-sm transition-colors',
        active
          ? 'border-[var(--color-accent)] bg-[var(--color-accent)] text-white'
          : 'border-hairline hover:bg-foreground/10'
      )}
    >
      {label}
    </button>
  );
}
