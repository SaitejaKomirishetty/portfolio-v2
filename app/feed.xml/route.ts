import { Feed } from 'feed';
import { getAllPosts } from '@/lib/blog';
import { profile } from '@/data/profile';

/** RSS 2.0 feed for the blog at /feed.xml. */
export function GET() {
  const site = profile.siteUrl;
  const feed = new Feed({
    title: `${profile.name} — Blog`,
    description: 'Sharing my thoughts, learnings, and experiences in web development.',
    id: site,
    link: `${site}/blog`,
    language: 'en',
    copyright: `© ${new Date().getFullYear()} ${profile.name}`,
    author: {
      name: profile.name,
      email: profile.email,
      link: site,
    },
    feedLinks: { rss: `${site}/feed.xml` },
  });

  for (const post of getAllPosts()) {
    const url = `${site}/blog/${post.slug}`;
    feed.addItem({
      title: post.title,
      id: url,
      link: url,
      description: post.description,
      date: new Date(post.date),
      category: post.tags.map((name) => ({ name })),
      author: [{ name: profile.name, link: site }],
    });
  }

  return new Response(feed.rss2(), {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
