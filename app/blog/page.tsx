import type { Metadata } from 'next';
import { getAllPosts, getAllTags } from '@/lib/blog';
import { BlogIndex } from '@/components/blog/BlogIndex';
import { profile } from '@/data/profile';

export const metadata: Metadata = {
  title: 'Blog',
  description: `Notes on web development by ${profile.name} — React, Next.js, JavaScript, performance, and more.`,
  alternates: {
    canonical: '/blog',
    types: { 'application/rss+xml': '/feed.xml' },
  },
  openGraph: {
    title: `Blog · ${profile.name}`,
    description: 'Sharing my thoughts, learnings, and experiences in web development.',
    url: '/blog',
    type: 'website',
  },
};

export default function BlogPage() {
  const posts = getAllPosts();
  const tags = getAllTags();

  return (
    <div>
      <header className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight">Blog</h1>
        <p className="mt-2 text-lg text-foreground/60">
          Sharing my thoughts, learnings, and experiences in web development.
        </p>
      </header>

      <BlogIndex posts={posts} tags={tags} />
    </div>
  );
}
