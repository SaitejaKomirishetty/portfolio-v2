import type { TocItem } from '@/lib/toc';
import { cn } from '@/lib/utils';

/** Static table of contents linking to in-page heading anchors. */
export function TableOfContents({ items }: { items: TocItem[] }) {
  if (items.length < 2) return null;

  return (
    <nav aria-label="Table of contents" className="text-sm">
      <p className="mb-2 font-semibold text-foreground/50">On this page</p>
      <ul className="space-y-1.5 border-l border-hairline">
        {items.map((item) => (
          <li key={item.slug}>
            <a
              href={`#${item.slug}`}
              className={cn(
                '-ml-px block border-l-2 border-transparent py-0.5 text-foreground/60 hover:border-[var(--color-accent)] hover:text-foreground',
                item.level === 2 ? 'pl-3' : 'pl-6'
              )}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
