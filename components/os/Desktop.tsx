'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence } from 'motion/react';
import { useWindowStore } from '@/store/useWindowStore';
import { useSystemStore, type BootPhase } from '@/store/useSystemStore';
import { useUIStore } from '@/store/useUIStore';
import { useMounted } from '@/hooks/useMounted';
import { wallpapers, defaultWallpaperId } from '@/data/wallpapers';
import { WindowManager } from './WindowManager';
import { MenuBar } from './MenuBar';
import { Dock } from './Dock';
import { DesktopIcons } from './DesktopIcons';
import { BootScreen } from './BootScreen';
import { LoginScreen } from './LoginScreen';
import { AboutThisMac } from './AboutThisMac';
import { ContextMenu } from './ContextMenu';
import { Spotlight } from './Spotlight';

/**
 * The macOS desktop environment. Orchestrates the boot → login → desktop
 * flow, renders the wallpaper, menu bar, dock, desktop icons, and windows.
 */
export function Desktop() {
  const mounted = useMounted();
  const hasBooted = useSystemStore((s) => s.hasBooted);
  const markBooted = useSystemStore((s) => s.markBooted);
  const wallpaperId = useSystemStore((s) => s.wallpaperId);
  const open = useWindowStore((s) => s.open);
  const openContextMenu = useUIStore((s) => s.openContextMenu);
  const toggleSpotlight = useUIStore((s) => s.toggleSpotlight);

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

  // Cmd/Ctrl + Space opens Spotlight (only on the desktop).
  useEffect(() => {
    if (phase !== 'desktop') return;
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.code === 'Space') {
        e.preventDefault();
        toggleSpotlight();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [phase, toggleSpotlight]);

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
      <DesktopIcons />
      <WindowManager />
      <Dock />
      <ContextMenu />
      <AboutThisMac />
      <Spotlight />

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
