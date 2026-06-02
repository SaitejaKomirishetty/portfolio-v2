'use client';

import { apps, allAppIds, type AppId } from '@/data/apps';
import { useWindowStore } from '@/store/useWindowStore';
import { AppIcon } from './AppIcon';
import { playSound } from '@/lib/sound';

/** Icons pinned to the desktop. Double-click (or Enter) opens the app. */
export function DesktopIcons() {
  const open = useWindowStore((s) => s.open);
  const desktopApps = allAppIds.filter((id) => apps[id].onDesktop);

  const launch = (id: AppId) => {
    playSound('open');
    open(id);
  };

  return (
    <div className="absolute right-3 top-9 z-[10] flex flex-col gap-3 no-select">
      {desktopApps.map((id) => (
        <button
          key={id}
          onDoubleClick={() => launch(id)}
          onKeyDown={(e) => e.key === 'Enter' && launch(id)}
          className="group flex w-20 flex-col items-center gap-1 rounded-lg p-1 text-center focus-visible:bg-white/15 focus-visible:outline-none"
        >
          <AppIcon id={id} className="h-12 w-12" glyphClassName="h-6 w-6" />
          <span className="rounded px-1 text-[11px] font-medium text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] group-focus-visible:bg-[var(--color-accent)]">
            {apps[id].name}
          </span>
        </button>
      ))}
    </div>
  );
}
