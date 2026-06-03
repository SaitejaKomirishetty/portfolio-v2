import Link from 'next/link';
import { Clock } from 'lucide-react';
import type { PostMeta } from '@/lib/blog';

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function PostCard({ post }: { post: PostMeta }) {
  return (
    <article className="group rounded-2xl border border-hairline bg-foreground/[0.02] p-5 transition-shadow hover:shadow-lg">
      <div className="flex flex-wrap items-center gap-2 text-xs text-foreground/50">
        <time dateTime={post.date}>{formatDate(post.date)}</time>
        <span>·</span>
        <span className="inline-flex items-center gap-1">
          <Clock className="h-3 w-3" /> {post.readingTime}
        </span>
      </div>

      <h2 className="mt-2 text-xl font-bold leading-snug">
        <Link
          href={`/blog/${post.slug}`}
          className="transition-colors group-hover:text-[var(--color-accent)]"
        >
          {post.title}
        </Link>
      </h2>

      <p className="mt-2 line-clamp-2 text-[15px] text-foreground/70">
        {post.description}
      </p>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {post.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-foreground/10 px-2.5 py-0.5 text-xs"
          >
            #{tag}
          </span>
        ))}
      </div>
    </article>
  );
}
