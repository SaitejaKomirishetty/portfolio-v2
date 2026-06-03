import { ImageResponse } from 'next/og';
import { profile } from '@/data/profile';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = `${profile.name} — ${profile.role}`;

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 24,
          background:
            'linear-gradient(135deg, #1b1f3b 0%, #51256b 45%, #b5377f 100%)',
          color: 'white',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', fontSize: 80, fontWeight: 700 }}>
          {profile.name}
        </div>
        <div style={{ display: 'flex', fontSize: 36, opacity: 0.85 }}>
          {profile.role}
        </div>
        <div style={{ display: 'flex', fontSize: 26, opacity: 0.7 }}>
          {profile.tagline}
        </div>
      </div>
    ),
    size
  );
}
