import { ImageResponse } from 'next/og';

export const size = { width: 64, height: 64 };
export const contentType = 'image/png';

/** Generated favicon: "SK" monogram on the system-accent gradient. */
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #38bdf8 0%, #2563eb 100%)',
          color: 'white',
          fontSize: 34,
          fontWeight: 700,
          borderRadius: 14,
          fontFamily: 'sans-serif',
        }}
      >
        SK
      </div>
    ),
    size
  );
}
