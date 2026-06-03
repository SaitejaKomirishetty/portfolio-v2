import { ImageResponse } from 'next/og';
import { getPostBySlug } from '@/lib/blog';
import { profile } from '@/data/profile';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = 'Blog post';

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  const title = post?.title ?? 'Blog';
  const readingTime = post?.readingTime ?? '';

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 80,
          background:
            'linear-gradient(135deg, #1b1f3b 0%, #51256b 45%, #b5377f 100%)',
          color: 'white',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', fontSize: 30, opacity: 0.85 }}>
          {profile.name} · Blog
        </div>
        <div
          style={{
            display: 'flex',
            fontSize: 64,
            fontWeight: 700,
            lineHeight: 1.1,
            maxWidth: 1000,
          }}
        >
          {title}
        </div>
        <div style={{ display: 'flex', fontSize: 28, opacity: 0.8 }}>
          {readingTime}
        </div>
      </div>
    ),
    size
  );
}
