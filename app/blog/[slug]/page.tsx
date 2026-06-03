import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight, Clock } from 'lucide-react';
import {
  getPostBySlug,
  getAllPosts,
  getAdjacentPosts,
} from '@/lib/blog';
import { getToc } from '@/lib/toc';
import { Mdx } from '@/components/blog/Mdx';
import { TableOfContents } from '@/components/blog/TableOfContents';
import { profile } from '@/data/profile';

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post || !post.published) return {};

  const url = `/blog/${post.slug}`;
  return {
    title: post.title,
    description: post.description,
    keywords: post.tags,
    alternates: { canonical: url },
    openGraph: {
      type: 'article',
      title: post.title,
      description: post.description,
      url,
      publishedTime: new Date(post.date).toISOString(),
      authors: [profile.name],
      tags: post.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
    },
  };
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post || !post.published) notFound();

  const toc = getToc(post.content);
  const { prev, next } = getAdjacentPosts(slug);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    datePublished: new Date(post.date).toISOString(),
    author: { '@type': 'Person', name: profile.name, url: profile.siteUrl },
    keywords: post.tags.join(', '),
  };

  return (
    <article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Link
        href="/blog"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-foreground/60 hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> All posts
      </Link>

      <header>
        <div className="flex flex-wrap gap-1.5">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-foreground/10 px-2.5 py-0.5 text-xs"
            >
              #{tag}
            </span>
          ))}
        </div>
        <h1 className="mt-3 text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
          {post.title}
        </h1>
        <p className="mt-3 flex items-center gap-2 text-sm text-foreground/50">
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          <span>·</span>
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" /> {post.readingTime}
          </span>
        </p>
      </header>

      {post.cover && (
        <div className="relative mt-6 aspect-[2/1] w-full overflow-hidden rounded-2xl border border-hairline">
          <Image
            src={post.cover}
            alt=""
            fill
            priority
            sizes="(min-width: 768px) 768px, 100vw"
            className="object-cover"
          />
        </div>
      )}

      {toc.length >= 2 && (
        <details className="mt-6 rounded-xl border border-hairline bg-foreground/[0.03] p-4 [&_p]:mb-0">
          <summary className="cursor-pointer font-semibold text-foreground/70">
            Table of contents
          </summary>
          <div className="mt-3">
            <TableOfContents items={toc} />
          </div>
        </details>
      )}

      <div className="prose mt-8 max-w-none">
        <Mdx source={post.content} />
      </div>

      {/* Prev / next navigation */}
      <nav className="mt-12 grid gap-3 border-t border-hairline pt-6 sm:grid-cols-2">
        {prev ? (
          <Link
            href={`/blog/${prev.slug}`}
            className="group rounded-xl border border-hairline p-4 hover:bg-foreground/5"
          >
            <span className="flex items-center gap-1 text-xs text-foreground/50">
              <ArrowLeft className="h-3 w-3" /> Older
            </span>
            <span className="mt-1 block font-medium group-hover:text-[var(--color-accent)]">
              {prev.title}
            </span>
          </Link>
        ) : (
          <span />
        )}
        {next && (
          <Link
            href={`/blog/${next.slug}`}
            className="group rounded-xl border border-hairline p-4 text-right hover:bg-foreground/5"
          >
            <span className="flex items-center justify-end gap-1 text-xs text-foreground/50">
              Newer <ArrowRight className="h-3 w-3" />
            </span>
            <span className="mt-1 block font-medium group-hover:text-[var(--color-accent)]">
              {next.title}
            </span>
          </Link>
        )}
      </nav>
    </article>
  );
}
