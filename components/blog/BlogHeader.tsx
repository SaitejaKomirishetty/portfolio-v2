'use client';

import Link from 'next/link';
import { useTheme } from 'next-themes';
import { Monitor, Sun, Moon, Rss } from 'lucide-react';
import { useMounted } from '@/hooks/useMounted';
import { profile } from '@/data/profile';

/** Sticky header for the blog routes: home link, brand, RSS, theme toggle. */
export function BlogHeader() {
  const mounted = useMounted();
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 border-b border-hairline bg-[var(--background)]">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
        <Link href="/blog" className="font-semibold">
          {profile.name.split(' ')[0]}&apos;s Blog
        </Link>
        <nav className="flex items-center gap-1">
          <Link
            href="/"
            className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm hover:bg-foreground/10"
            title="Back to desktop"
          >
            <Monitor className="h-4 w-4" /> Desktop
          </Link>
          <a
            href="/feed.xml"
            className="rounded-full p-2 hover:bg-foreground/10"
            aria-label="RSS feed"
            title="RSS feed"
          >
            <Rss className="h-4 w-4" />
          </a>
          <button
            type="button"
            aria-label="Toggle theme"
            onClick={() =>
              setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
            }
            className="rounded-full p-2 hover:bg-foreground/10"
          >
            {mounted && resolvedTheme === 'dark' ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </button>
        </nav>
      </div>
    </header>
  );
}
