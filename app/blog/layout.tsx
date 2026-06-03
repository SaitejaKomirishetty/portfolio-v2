import type { ReactNode } from 'react';
import { BlogHeader } from '@/components/blog/BlogHeader';

export default function BlogLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh bg-[var(--background)] text-foreground">
      <BlogHeader />
      <main className="mx-auto max-w-3xl px-4 py-10">{children}</main>
    </div>
  );
}
