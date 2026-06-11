import type { ReactNode } from 'react';
import type { AppId } from '@/data/apps';

/**
 * Custom, filled, app-like glyphs for each desktop app — drawn to read like
 * real macOS app icons rather than generic line icons. Rendered centered on
 * the gradient squircle by <AppIcon/>.
 */

// Apple system colors for the Photos "pinwheel".
const PHOTO_COLORS = [
  '#ff3b30',
  '#ff9500',
  '#ffcc00',
  '#34c759',
  '#32ade6',
  '#007aff',
  '#5856d6',
  '#af52de',
];

const GLYPHS: Record<AppId, ReactNode> = {
  // Profile / person bust
  about: (
    <>
      <circle cx="12" cy="8.6" r="3.7" fill="white" />
      <path
        d="M5.4 19.8a6.6 6.6 0 0 1 13.2 0 1 1 0 0 1-1 1.05H6.4a1 1 0 0 1-1-1.05Z"
        fill="white"
      />
    </>
  ),
  // Terminal prompt: ›_
  terminal: (
    <>
      <path
        d="M6 8.5 10 12l-4 3.5"
        stroke="white"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12.5 16h6"
        stroke="white"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </>
  ),
  // Finder: the two-tone smiley face
  finder: (
    <>
      <rect x="4.6" y="4" width="14.8" height="16" rx="4.2" fill="white" />
      <path d="M12 4.3v15.4" stroke="rgba(20,80,170,0.12)" strokeWidth="0.9" />
      <path
        d="M9 9.1v2.3M15 9.1v2.3"
        stroke="#2f73d8"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <path
        d="M8.1 14.2c1.5 1.5 2.9 2.2 3.9 2.2s2.4-.7 3.9-2.2"
        stroke="#2f73d8"
        strokeWidth="1.7"
        strokeLinecap="round"
        fill="none"
      />
    </>
  ),
  // Folder with code brackets
  projects: (
    <>
      <path
        d="M3.6 7.4c0-.9.73-1.6 1.6-1.6h3.3c.43 0 .84.17 1.14.47L11 7.6h7.8c.88 0 1.6.72 1.6 1.6v7.2c0 .88-.72 1.6-1.6 1.6H5.2c-.87 0-1.6-.72-1.6-1.6V7.4Z"
        fill="white"
      />
      <path
        d="m10.7 11.3-1.6 1.6 1.6 1.6m2.6-3.2 1.6 1.6-1.6 1.6"
        stroke="#ea7a18"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </>
  ),
  // Document with folded corner + text lines
  resume: (
    <>
      <path
        d="M7.2 3.4h5.3L18 8.9v10.2c0 .86-.7 1.55-1.55 1.55h-9.25c-.86 0-1.55-.7-1.55-1.55V4.95c0-.86.7-1.55 1.55-1.55Z"
        fill="white"
      />
      <path d="M12.4 3.4V9h5.6" fill="rgba(0,0,0,0.13)" />
      <path
        d="M8.6 12.8h6.8M8.6 15.8h4.8"
        stroke="rgba(0,0,0,0.3)"
        strokeWidth="1.35"
        strokeLinecap="round"
      />
    </>
  ),
  // Notes: paper with a header strip + lines
  blog: (
    <>
      <rect x="5" y="3.5" width="14" height="17" rx="2.2" fill="white" />
      <path
        d="M8 8.6h8M8 11.6h8M8 14.6h5.5"
        stroke="rgba(0,0,0,0.26)"
        strokeWidth="1.35"
        strokeLinecap="round"
      />
    </>
  ),
  // Notes: white sheet with a yellow header band + lines
  notes: (
    <>
      <rect x="5" y="3.5" width="14" height="17" rx="2.4" fill="white" />
      <path
        d="M5 5.9C5 4.57 6.07 3.5 7.4 3.5h9.2C17.93 3.5 19 4.57 19 5.9V7.4H5V5.9Z"
        fill="#ffce46"
      />
      <path
        d="M8 10.6h8M8 13.4h8M8 16.2h5"
        stroke="rgba(0,0,0,0.28)"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </>
  ),
  // Calendar: white sheet, red header, mini day grid (one day = today)
  calendar: (
    <>
      <rect x="4.5" y="4" width="15" height="16" rx="2.4" fill="white" />
      <path
        d="M4.5 6.5C4.5 5.12 5.62 4 7 4h10c1.38 0 2.5 1.12 2.5 2.5V8H4.5V6.5Z"
        fill="#ff3b30"
      />
      {[0, 1, 2].map((r) =>
        [0, 1, 2].map((c) => {
          const today = r === 1 && c === 1;
          return (
            <rect
              key={`${r}-${c}`}
              x={7.4 + c * 3.3}
              y={10.6 + r * 3.1}
              width="2.2"
              height="2.2"
              rx="0.6"
              fill={today ? '#ff3b30' : 'rgba(0,0,0,0.22)'}
            />
          );
        })
      )}
    </>
  ),
  // Calculator: white body, dark display, keypad dots (orange operator column)
  calculator: (
    <>
      <rect x="5" y="3.5" width="14" height="17" rx="2.6" fill="white" />
      <rect x="7" y="5.7" width="10" height="3" rx="0.8" fill="rgba(0,0,0,0.78)" />
      {[0, 1, 2].map((r) =>
        [0, 1, 2].map((c) => (
          <circle
            key={`${r}-${c}`}
            cx={8.3 + c * 3.4}
            cy={11.6 + r * 2.8}
            r="1.05"
            fill={c === 2 ? '#ff9f0a' : 'rgba(0,0,0,0.62)'}
          />
        ))
      )}
    </>
  ),
  // Activity Monitor: a heartbeat / EKG pulse
  activity: (
    <path
      d="M3.6 12.4h3.1l1.9-4.6 3 9.2 2.4-6 1.6 2.1h4.8"
      stroke="white"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  ),
  // Mail: envelope
  contact: (
    <>
      <rect x="3.4" y="6" width="17.2" height="12" rx="2.6" fill="white" />
      <path
        d="M4.4 8.2 12 13.3l7.6-5.1"
        stroke="rgba(0,0,0,0.28)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </>
  ),
  // Photos: colorful pinwheel
  photos: (
    <>
      {PHOTO_COLORS.map((c, i) => (
        <ellipse
          key={i}
          cx="12"
          cy="6.7"
          rx="2.3"
          ry="4.5"
          fill={c}
          opacity="0.92"
          transform={`rotate(${i * 45} 12 12)`}
        />
      ))}
      <circle cx="12" cy="12" r="2.1" fill="white" />
    </>
  ),
  // Settings: gear
  settings: (
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M19.43 12.98c.04-.32.07-.65.07-.98s-.03-.66-.07-.98l2.11-1.65a.5.5 0 0 0 .12-.64l-2-3.46a.5.5 0 0 0-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65A.49.49 0 0 0 13.5 2h-4a.49.49 0 0 0-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1a.5.5 0 0 0-.61.22l-2 3.46a.5.5 0 0 0 .12.64l2.11 1.65c-.04.32-.07.65-.07.98s.03.66.07.98l-2.11 1.65a.5.5 0 0 0-.12.64l2 3.46c.14.24.43.34.69.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.04.24.25.42.49.42h4c.24 0 .45-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.26.12.55.02.69-.22l2-3.46a.5.5 0 0 0-.12-.64l-2.11-1.65ZM12 15.5a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7Z"
      fill="white"
    />
  ),
};

export function AppGlyph({
  id,
  className,
}: {
  id: AppId;
  className?: string;
}) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      {GLYPHS[id]}
    </svg>
  );
}
