import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import readingTime from 'reading-time';

/**
 * Server-only blog data layer. Reads MDX files from /content/blog, parses
 * frontmatter, and computes reading time + excerpts. Used by the /blog routes,
 * the in-desktop Blog app (via /api/posts), RSS, and the sitemap.
 */

const POSTS_DIR = path.join(process.cwd(), 'content', 'blog');

export interface PostFrontmatter {
  title: string;
  date: string;
  description: string;
  tags: string[];
  cover?: string;
  published: boolean;
  featured?: boolean;
}

export interface PostMeta extends PostFrontmatter {
  slug: string;
  readingTime: string;
  readingMinutes: number;
}

export interface Post extends PostMeta {
  content: string;
}

function getSlugs(): string[] {
  if (!fs.existsSync(POSTS_DIR)) return [];
  return fs
    .readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith('.mdx'))
    .map((f) => f.replace(/\.mdx$/, ''));
}

export function getPostBySlug(slug: string): Post | null {
  const fullPath = path.join(POSTS_DIR, `${slug}.mdx`);
  if (!fs.existsSync(fullPath)) return null;

  const raw = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(raw);
  const stats = readingTime(content);
  const fm = data as PostFrontmatter;

  return {
    slug,
    title: fm.title,
    date: fm.date,
    description: fm.description,
    tags: fm.tags ?? [],
    cover: fm.cover || undefined,
    published: fm.published ?? false,
    featured: fm.featured ?? false,
    readingTime: stats.text,
    readingMinutes: Math.max(1, Math.round(stats.minutes)),
    content,
  };
}

/** All published posts, newest first (metadata only — no content). */
export function getAllPosts(): PostMeta[] {
  return getSlugs()
    .map((slug) => getPostBySlug(slug))
    .filter((p): p is Post => p !== null && p.published)
    .sort((a, b) => +new Date(b.date) - +new Date(a.date))
    .map((post) => {
      // Strip the heavy `content` field — callers of getAllPosts only need meta.
      const { content, ...meta } = post;
      void content;
      return meta;
    });
}

/** Unique tags across all published posts, sorted. */
export function getAllTags(): string[] {
  const tags = new Set<string>();
  getAllPosts().forEach((p) => p.tags.forEach((t) => tags.add(t)));
  return [...tags].sort();
}

/** Adjacent posts for prev/next navigation. */
export function getAdjacentPosts(slug: string): {
  prev: PostMeta | null;
  next: PostMeta | null;
} {
  const posts = getAllPosts();
  const i = posts.findIndex((p) => p.slug === slug);
  if (i === -1) return { prev: null, next: null };
  return {
    // Newest-first ordering: "next" is the newer post.
    prev: posts[i + 1] ?? null,
    next: posts[i - 1] ?? null,
  };
}
