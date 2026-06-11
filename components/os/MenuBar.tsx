'use client';

import {
  BatteryFull,
  Wifi,
  WifiOff,
  Search,
  SlidersHorizontal,
} from 'lucide-react';
import { AppleLogo } from './icons/AppleLogo';
import { MenuDropdown, type MenuItem } from './MenuDropdown';
import { useClock } from '@/hooks/useClock';
import { useWindowStore } from '@/store/useWindowStore';
import { useUIStore } from '@/store/useUIStore';
import { useSystemStore } from '@/store/useSystemStore';
import { apps } from '@/data/apps';

export function MenuBar() {
  const { date, time } = useClock();
  const focused = useWindowStore((s) => s.focused);
  const open = useWindowStore((s) => s.open);
  const close = useWindowStore((s) => s.close);
  const minimize = useWindowStore((s) => s.minimize);
  const toggleMaximize = useWindowStore((s) => s.toggleMaximize);
  const openSpotlight = useUIStore((s) => s.openSpotlight);
  const openAbout = useUIStore((s) => s.openAbout);
  const toggleControlCenter = useUIStore((s) => s.toggleControlCenter);
  const toggleNotificationCenter = useUIStore((s) => s.toggleNotificationCenter);
  const wifi = useUIStore((s) => s.wifi);
  const lockScreen = useSystemStore((s) => s.reset);

  const activeName = focused ? apps[focused].name : 'Finder';

  const appleMenu: MenuItem[] = [
    { label: 'About This Portfolio', onSelect: openAbout },
    { separator: true },
    { label: 'System Settings…', onSelect: () => open('settings') },
    { separator: true },
    { label: 'Lock Screen', onSelect: lockScreen },
  ];

  const fileMenu: MenuItem[] = [
    { label: 'New Window', onSelect: () => focused && open(focused) },
    {
      label: 'Close Window',
      shortcut: '⌘W',
      onSelect: () => focused && close(focused),
      disabled: !focused,
    },
  ];

  const windowMenu: MenuItem[] = [
    {
      label: 'Minimize',
      shortcut: '⌘M',
      onSelect: () => focused && minimize(focused),
      disabled: !focused,
    },
    {
      label: 'Zoom',
      onSelect: () => focused && toggleMaximize(focused),
      disabled: !focused,
    },
  ];

  return (
    <header className="vibrancy-menubar fixed inset-x-0 top-0 z-[6000] flex h-7 items-center justify-between border-b border-hairline px-2 text-[13px] text-foreground no-select">
      {/* Left cluster */}
      <div className="flex items-center gap-0.5">
        <MenuDropdown
          trigger={<AppleLogo className="h-3.5 w-3.5" />}
          items={appleMenu}
          triggerClassName="px-2"
          ariaLabel="Apple menu"
        />
        <MenuDropdown
          trigger={<span className="font-semibold">{activeName}</span>}
          items={[
            { label: `About ${activeName}`, onSelect: openAbout },
            { separator: true },
            {
              label: 'Hide',
              shortcut: '⌘H',
              onSelect: () => focused && minimize(focused),
              disabled: !focused,
            },
          ]}
        />
        <MenuDropdown trigger="File" items={fileMenu} />
        <MenuDropdown
          trigger="Edit"
          items={[
            { label: 'Undo', shortcut: '⌘Z', disabled: true },
            { label: 'Redo', shortcut: '⇧⌘Z', disabled: true },
            { separator: true },
            { label: 'Cut', shortcut: '⌘X', disabled: true },
            { label: 'Copy', shortcut: '⌘C', disabled: true },
            { label: 'Paste', shortcut: '⌘V', disabled: true },
          ]}
        />
        <MenuDropdown
          trigger="View"
          items={[
            {
              label: 'Enter Full Screen',
              onSelect: () => focused && toggleMaximize(focused),
              disabled: !focused,
            },
          ]}
        />
        <MenuDropdown trigger="Window" items={windowMenu} />
      </div>

      {/* Right cluster */}
      <div className="flex items-center gap-1.5">
        <BatteryFull className="h-4 w-4" aria-label="Battery" />
        {wifi ? (
          <Wifi className="h-4 w-4" aria-label="Wi-Fi on" />
        ) : (
          <WifiOff className="h-4 w-4 opacity-50" aria-label="Wi-Fi off" />
        )}
        <button
          type="button"
          aria-label="Spotlight Search"
          onClick={openSpotlight}
          className="rounded p-1 hover:bg-white/10"
        >
          <Search className="h-4 w-4" />
        </button>
        <button
          type="button"
          data-cc-trigger
          aria-label="Control Center"
          onClick={toggleControlCenter}
          className="rounded p-1 hover:bg-white/10"
        >
          <SlidersHorizontal className="h-4 w-4" />
        </button>
        <button
          type="button"
          data-nc-trigger
          aria-label="Date and time — open Notification Center"
          onClick={toggleNotificationCenter}
          className="ml-0.5 flex items-center gap-1.5 rounded px-1 py-0.5 tabular-nums hover:bg-white/10"
        >
          <span>{date}</span>
          <span>{time}</span>
        </button>
      </div>
    </header>
  );
}
