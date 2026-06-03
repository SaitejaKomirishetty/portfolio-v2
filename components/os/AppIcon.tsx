'use client';

import { apps, type AppId } from '@/data/apps';
import { cn } from '@/lib/utils';
import { AppGlyph } from './icons/AppGlyphs';

/** Rounded-squircle app tile with a gradient background + custom glyph. */
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
      <AppGlyph
        id={id}
        className={cn(
          'relative h-1/2 w-1/2 drop-shadow-[0_1px_1px_rgba(0,0,0,0.25)]',
          glyphClassName
        )}
      />
    </div>
  );
}
