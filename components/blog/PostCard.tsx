import Link from 'next/link';
import Image from 'next/image';
import { Clock } from 'lucide-react';
import type { PostMeta } from '@/lib/blog';

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function PostCard({
  post,
  priority = false,
}: {
  post: PostMeta;
  priority?: boolean;
}) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-hairline bg-foreground/[0.02] transition-shadow hover:shadow-lg">
      {post.cover && (
        <Link
          href={`/blog/${post.slug}`}
          className="relative block aspect-[16/9] overflow-hidden"
          aria-hidden
          tabIndex={-1}
        >
          <Image
            src={post.cover}
            alt=""
            fill
            priority={priority}
            sizes="(min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.04]"
          />
        </Link>
      )}

      <div className="p-5">
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
      </div>
    </article>
  );
}
