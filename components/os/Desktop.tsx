'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence } from 'motion/react';
import { useWindowStore } from '@/store/useWindowStore';
import { useSystemStore, type BootPhase } from '@/store/useSystemStore';
import { useUIStore } from '@/store/useUIStore';
import { useMounted } from '@/hooks/useMounted';
import { useIsMobile } from '@/hooks/useIsMobile';
import { wallpapers, defaultWallpaperId } from '@/data/wallpapers';
import { allAppIds, type AppId } from '@/data/apps';
import { profile } from '@/data/profile';
import { WindowManager } from './WindowManager';
import { MenuBar } from './MenuBar';
import { Dock } from './Dock';
import { DesktopIcons } from './DesktopIcons';
import { BootScreen } from './BootScreen';
import { LoginScreen } from './LoginScreen';
import { AboutThisMac } from './AboutThisMac';
import { ContextMenu } from './ContextMenu';
import { Spotlight } from './Spotlight';
import { KeyboardShortcuts } from './KeyboardShortcuts';
import { MobileHome } from './MobileHome';

/**
 * The macOS desktop environment. Orchestrates the boot → login → desktop
 * flow, renders the wallpaper, menu bar, dock, desktop icons, and windows.
 */
export function Desktop() {
  const mounted = useMounted();
  const isMobile = useIsMobile();
  const hasBooted = useSystemStore((s) => s.hasBooted);
  const markBooted = useSystemStore((s) => s.markBooted);
  const wallpaperId = useSystemStore((s) => s.wallpaperId);
  const open = useWindowStore((s) => s.open);
  const openContextMenu = useUIStore((s) => s.openContextMenu);

  const [phase, setPhase] = useState<BootPhase>('boot');
  const firstLogin = useRef(true);

  const wallpaper =
    wallpapers.find((w) => w.id === wallpaperId) ??
    wallpapers.find((w) => w.id === defaultWallpaperId)!;

  // Decide the initial phase once the persisted store has hydrated.
  useEffect(() => {
    if (!mounted) return;
    // Derive the entry phase from the persisted "hasBooted" flag once hydrated.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPhase(hasBooted ? 'desktop' : 'boot');
  }, [mounted]); // eslint-disable-line react-hooks/exhaustive-deps

  // "Lock Screen" resets hasBooted → drop back to the login screen.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (mounted && !hasBooted && phase === 'desktop') setPhase('login');
  }, [hasBooted, mounted, phase]);

  // Deep link: ?app=projects opens that app once the desktop is active.
  useEffect(() => {
    if (phase !== 'desktop') return;
    const param = new URLSearchParams(window.location.search).get('app');
    if (param && (allAppIds as string[]).includes(param)) {
      open(param as AppId);
    }
  }, [phase, open]);

  const handleLogin = useCallback(() => {
    markBooted();
    setPhase('desktop');
    // Open the About window on the very first login for a warm welcome.
    if (firstLogin.current) {
      firstLogin.current = false;
      setTimeout(() => open('about'), 400);
    }
  }, [markBooted, open]);

  if (!mounted) {
    // Avoid hydration mismatch: paint a neutral black until hydrated.
    return <div className="h-dvh w-screen bg-black" />;
  }

  // Touch / small screens get the iOS-style springboard instead of windows.
  if (isMobile) return <MobileHome />;

  return (
    <div
      className="relative h-dvh w-screen overflow-hidden"
      style={{ background: wallpaper.css }}
      onContextMenu={(e) => {
        e.preventDefault();
        openContextMenu({ x: e.clientX, y: e.clientY });
      }}
    >
      <MenuBar />

      {/* Primary content landmark. `display: contents` adds the <main> role
          without generating a box, so window positioning/z-index is unchanged. */}
      <main aria-label="Desktop" className="contents">
        <h1 className="sr-only">
          {profile.name} — {profile.role}
        </h1>
        <DesktopIcons />
        <WindowManager />
      </main>

      <Dock />
      <ContextMenu />
      <AboutThisMac />
      <Spotlight />
      <KeyboardShortcuts />

      <AnimatePresence>
        {phase === 'boot' && (
          <BootScreen key="boot" onComplete={() => setPhase('login')} />
        )}
        {phase === 'login' && (
          <LoginScreen
            key="login"
            wallpaperCss={wallpaper.css}
            onLogin={handleLogin}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
