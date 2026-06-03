'use client';

import {
  User,
  SquareTerminal,
  FolderGit2,
  FileText,
  NotebookPen,
  Mail,
  Image as ImageIcon,
  Settings,
  type LucideIcon,
} from 'lucide-react';
import { apps, type AppId } from '@/data/apps';
import { cn } from '@/lib/utils';

const ICONS: Record<string, LucideIcon> = {
  User,
  SquareTerminal,
  FolderGit2,
  FileText,
  NotebookPen,
  Mail,
  Image: ImageIcon,
  Settings,
};

/** Rounded-square app tile with a gradient background + lucide glyph. */
export function AppIcon({
  id,
  className,
  glyphClassName,
}: {
  id: AppId;
  className?: string;
  glyphClassName?: string;
}) {
  const meta = apps[id];
  const Glyph = ICONS[meta.icon] ?? User;
  return (
    <div
      className={cn(
        'squircle relative flex items-center justify-center overflow-hidden bg-gradient-to-br shadow-[0_4px_12px_-2px_rgba(0,0,0,0.35)] ring-1 ring-inset ring-white/15',
        meta.tile,
        className
      )}
    >
      {/* Glossy top highlight, like a real macOS app icon. */}
      <span className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/35 via-white/5 to-transparent" />
      <Glyph
        className={cn(
          'relative text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.28)]',
          glyphClassName
        )}
        strokeWidth={1.9}
      />
    </div>
  );
}
