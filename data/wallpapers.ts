/**
 * Desktop wallpapers. Each is a CSS gradient so there are zero image
 * downloads. Add image-based wallpapers by setting `css` to a url()/image.
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
    id: 'sonoma-dusk',
    name: 'Sonoma Dusk',
    css: 'linear-gradient(160deg, #1b1f3b 0%, #51256b 38%, #b5377f 70%, #f0814f 100%)',
    prefersDark: true,
  },
  {
    id: 'sequoia-night',
    name: 'Sequoia Night',
    css: 'linear-gradient(160deg, #0f2027 0%, #203a43 50%, #2c5364 100%)',
    prefersDark: true,
  },
  {
    id: 'monterey-light',
    name: 'Monterey Light',
    css: 'linear-gradient(160deg, #a1c4fd 0%, #c2e9fb 50%, #fbc2eb 100%)',
    prefersDark: false,
  },
  {
    id: 'sunrise',
    name: 'Sunrise',
    css: 'linear-gradient(160deg, #ff9a9e 0%, #fad0c4 40%, #fbc2eb 70%, #a18cd1 100%)',
    prefersDark: false,
  },
  {
    id: 'aurora',
    name: 'Aurora',
    css: 'linear-gradient(160deg, #43cea2 0%, #185a9d 100%)',
    prefersDark: true,
  },
  {
    id: 'graphite',
    name: 'Graphite',
    css: 'radial-gradient(circle at 30% 20%, #3a3a3c 0%, #1c1c1e 60%, #000000 100%)',
    prefersDark: true,
  },
];

export const defaultWallpaperId = 'sonoma-dusk';
