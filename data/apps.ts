/**
 * App registry metadata. This is the single source of truth for which
 * "apps" exist in the desktop, their dock order, icons, and default window
 * geometry. The actual React component for each app is wired up separately
 * in components/apps/registry.tsx to keep this data layer pure/serializable.
 */

export type AppId =
  | 'about'
  | 'terminal'
  | 'projects'
  | 'resume'
  | 'blog'
  | 'contact'
  | 'photos'
  | 'settings';

export interface AppMeta {
  id: AppId;
  /** Display name shown in the menu bar, dock tooltip, window title. */
  name: string;
  /** lucide-react icon name used for the dock/desktop fallback glyph. */
  icon: string;
  /** Tailwind gradient classes for the dock icon tile. */
  tile: string;
  /** Default window size. */
  defaultSize: { width: number; height: number };
  /** Minimum window size. */
  minSize?: { width: number; height: number };
  /** Show on the desktop as an icon. */
  onDesktop?: boolean;
  /** Show in the dock. */
  inDock?: boolean;
  /** Short description for Spotlight / About This Mac. */
  description: string;
}

export const apps: Record<AppId, AppMeta> = {
  about: {
    id: 'about',
    name: 'About Me',
    icon: 'User',
    tile: 'from-sky-400 to-blue-600',
    defaultSize: { width: 720, height: 520 },
    minSize: { width: 420, height: 360 },
    onDesktop: true,
    inDock: true,
    description: 'Bio, quick facts, and skills',
  },
  terminal: {
    id: 'terminal',
    name: 'Terminal',
    icon: 'SquareTerminal',
    tile: 'from-zinc-700 to-zinc-900',
    defaultSize: { width: 680, height: 460 },
    minSize: { width: 420, height: 280 },
    inDock: true,
    description: 'Explore the portfolio via commands',
  },
  projects: {
    id: 'projects',
    name: 'Projects',
    icon: 'FolderGit2',
    tile: 'from-amber-400 to-orange-600',
    defaultSize: { width: 820, height: 580 },
    minSize: { width: 480, height: 360 },
    onDesktop: true,
    inDock: true,
    description: 'Things I have built',
  },
  resume: {
    id: 'resume',
    name: 'Resume',
    icon: 'FileText',
    tile: 'from-rose-400 to-red-600',
    defaultSize: { width: 720, height: 640 },
    minSize: { width: 420, height: 420 },
    onDesktop: true,
    inDock: true,
    description: 'View and download my CV',
  },
  blog: {
    id: 'blog',
    name: 'Blog',
    icon: 'NotebookPen',
    tile: 'from-yellow-300 to-amber-500',
    defaultSize: { width: 860, height: 600 },
    minSize: { width: 480, height: 380 },
    inDock: true,
    description: 'Notes on web development',
  },
  contact: {
    id: 'contact',
    name: 'Contact',
    icon: 'Mail',
    tile: 'from-cyan-400 to-sky-600',
    defaultSize: { width: 560, height: 560 },
    minSize: { width: 380, height: 420 },
    inDock: true,
    description: 'Get in touch',
  },
  photos: {
    id: 'photos',
    name: 'Photos',
    icon: 'Image',
    tile: 'from-fuchsia-400 to-purple-600',
    defaultSize: { width: 760, height: 540 },
    minSize: { width: 420, height: 360 },
    inDock: false,
    description: 'A small gallery',
  },
  settings: {
    id: 'settings',
    name: 'System Settings',
    icon: 'Settings',
    tile: 'from-slate-400 to-slate-600',
    defaultSize: { width: 640, height: 520 },
    minSize: { width: 420, height: 400 },
    inDock: true,
    description: 'Theme, wallpaper, and sound',
  },
};

/** Apps in dock order. */
export const dockApps: AppId[] = [
  'about',
  'terminal',
  'projects',
  'resume',
  'blog',
  'contact',
  'settings',
];

export const allAppIds = Object.keys(apps) as AppId[];
