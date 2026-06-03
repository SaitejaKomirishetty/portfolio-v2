import type { MetadataRoute } from 'next';
import { getAllPosts } from '@/lib/blog';
import { profile } from '@/data/profile';

export default function sitemap(): MetadataRoute.Sitemap {
  const site = profile.siteUrl;
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: site, lastModified: now, changeFrequency: 'monthly', priority: 1 },
    {
      url: `${site}/blog`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ];

  const postRoutes: MetadataRoute.Sitemap = getAllPosts().map((post) => ({
    url: `${site}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  return [...staticRoutes, ...postRoutes];
}
