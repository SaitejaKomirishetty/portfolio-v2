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
        'flex items-center justify-center rounded-[22%] bg-gradient-to-br shadow-md',
        meta.tile,
        className
      )}
    >
      <Glyph
        className={cn('text-white drop-shadow-sm', glyphClassName)}
        strokeWidth={1.8}
      />
    </div>
  );
}
