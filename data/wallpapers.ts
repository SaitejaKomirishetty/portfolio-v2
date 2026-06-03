/**
 * Desktop wallpapers. Each is a layered CSS gradient (zero image downloads)
 * tuned to evoke macOS Sonoma / Sequoia dynamic wallpapers — multiple soft
 * radial light sources over a deep base for real depth.
 */
export interface Wallpaper {
  id: string;
  name: string;
  /** CSS background value (gradient or image). */
  css: string;
  /** Suggested UI theme to pair with this wallpaper. */
  prefersDark?: boolean;
}

export const wallpapers: Wallpaper[] = [
  {
    id: 'sonoma-horizon',
    name: 'Sonoma Horizon',
    css: `
      radial-gradient(120% 90% at 78% 12%, rgba(255,176,109,0.95) 0%, rgba(255,118,143,0.55) 32%, transparent 60%),
      radial-gradient(110% 90% at 12% 18%, rgba(120,86,255,0.85) 0%, rgba(86,120,255,0.35) 38%, transparent 66%),
      radial-gradient(140% 120% at 50% 110%, rgba(255,94,148,0.85) 0%, rgba(120,52,148,0.5) 40%, transparent 72%),
      linear-gradient(160deg, #2a1140 0%, #14122e 55%, #0c1030 100%)
    `,
    prefersDark: true,
  },
  {
    id: 'sequoia-aurora',
    name: 'Sequoia Aurora',
    css: `
      radial-gradient(120% 100% at 80% 8%, rgba(94,234,212,0.8) 0%, rgba(56,189,248,0.4) 34%, transparent 62%),
      radial-gradient(120% 100% at 12% 22%, rgba(129,140,248,0.85) 0%, rgba(99,102,241,0.4) 40%, transparent 70%),
      radial-gradient(150% 130% at 50% 120%, rgba(56,189,248,0.7) 0%, rgba(30,64,175,0.5) 42%, transparent 74%),
      linear-gradient(160deg, #0b2545 0%, #0a1633 55%, #060b20 100%)
    `,
    prefersDark: true,
  },
  {
    id: 'monterey-wave',
    name: 'Monterey',
    css: `
      radial-gradient(120% 100% at 75% 20%, rgba(125,211,252,0.9) 0%, rgba(59,130,246,0.45) 36%, transparent 66%),
      radial-gradient(120% 110% at 18% 85%, rgba(167,139,250,0.75) 0%, rgba(99,102,241,0.4) 40%, transparent 72%),
      linear-gradient(155deg, #1e3a8a 0%, #1e40af 45%, #0f172a 100%)
    `,
    prefersDark: true,
  },
  {
    id: 'sunset-dune',
    name: 'Sunset Dune',
    css: `
      radial-gradient(120% 100% at 80% 18%, rgba(253,224,71,0.85) 0%, rgba(251,146,60,0.5) 34%, transparent 64%),
      radial-gradient(120% 110% at 15% 90%, rgba(244,114,182,0.8) 0%, rgba(168,85,247,0.45) 42%, transparent 74%),
      linear-gradient(160deg, #7c2d12 0%, #831843 50%, #3b0764 100%)
    `,
    prefersDark: true,
  },
  {
    id: 'daybreak',
    name: 'Daybreak',
    css: `
      radial-gradient(120% 100% at 80% 12%, rgba(255,255,255,0.85) 0%, rgba(186,230,253,0.6) 30%, transparent 60%),
      radial-gradient(120% 110% at 18% 88%, rgba(196,181,253,0.7) 0%, rgba(147,197,253,0.45) 42%, transparent 74%),
      linear-gradient(160deg, #bae6fd 0%, #c4b5fd 50%, #fbcfe8 100%)
    `,
    prefersDark: false,
  },
  {
    id: 'graphite',
    name: 'Graphite',
    css: `
      radial-gradient(120% 100% at 70% 12%, rgba(120,120,128,0.45) 0%, transparent 55%),
      radial-gradient(140% 120% at 30% 110%, rgba(60,60,68,0.6) 0%, transparent 60%),
      linear-gradient(160deg, #2b2b30 0%, #1a1a1d 55%, #050506 100%)
    `,
    prefersDark: true,
  },
];

export const defaultWallpaperId = 'sonoma-horizon';
