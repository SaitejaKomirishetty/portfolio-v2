'use client';

import { useTheme } from 'next-themes';
import { Sun, Moon, Laptop, Volume2, VolumeX, RotateCcw, Check } from 'lucide-react';
import { useSystemStore } from '@/store/useSystemStore';
import { useWindowStore } from '@/store/useWindowStore';
import { useMounted } from '@/hooks/useMounted';
import { wallpapers } from '@/data/wallpapers';
import { cn } from '@/lib/utils';

const THEMES = [
  { id: 'light', label: 'Light', icon: Sun },
  { id: 'dark', label: 'Dark', icon: Moon },
  { id: 'system', label: 'Auto', icon: Laptop },
] as const;

export function Settings() {
  const mounted = useMounted();
  const { theme, setTheme } = useTheme();
  const wallpaperId = useSystemStore((s) => s.wallpaperId);
  const setWallpaper = useSystemStore((s) => s.setWallpaper);
  const soundEnabled = useSystemStore((s) => s.soundEnabled);
  const toggleSound = useSystemStore((s) => s.toggleSound);
  const reset = useSystemStore((s) => s.reset);
  const closeAll = useWindowStore((s) => s.closeAll);

  return (
    <div className="macos-scroll h-full overflow-auto p-5">
      <h1 className="mb-4 text-lg font-semibold">System Settings</h1>

      {/* Appearance */}
      <Section title="Appearance">
        <div className="flex gap-2">
          {THEMES.map((t) => {
            const Icon = t.icon;
            const activeTheme = mounted && theme === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTheme(t.id)}
                className={cn(
                  'flex flex-1 flex-col items-center gap-1.5 rounded-xl border p-3 text-sm transition-colors',
                  activeTheme
                    ? 'border-[var(--color-accent)] bg-[var(--color-accent)]/10'
                    : 'border-hairline hover:bg-foreground/5'
                )}
              >
                <Icon className="h-5 w-5" />
                {t.label}
              </button>
            );
          })}
        </div>
      </Section>

      {/* Wallpaper */}
      <Section title="Wallpaper">
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
          {wallpapers.map((w) => (
            <button
              key={w.id}
              onClick={() => setWallpaper(w.id)}
              aria-label={w.name}
              className={cn(
                'relative aspect-video overflow-hidden rounded-lg border-2 transition-transform hover:scale-[1.03]',
                wallpaperId === w.id
                  ? 'border-[var(--color-accent)]'
                  : 'border-transparent'
              )}
              style={{ background: w.css }}
            >
              {wallpaperId === w.id && (
                <span className="absolute right-1 top-1 rounded-full bg-[var(--color-accent)] p-0.5 text-white">
                  <Check className="h-3 w-3" />
                </span>
              )}
              <span className="absolute inset-x-0 bottom-0 bg-black/40 px-1 py-0.5 text-[10px] text-white">
                {w.name}
              </span>
            </button>
          ))}
        </div>
      </Section>

      {/* Sound */}
      <Section title="Sound">
        <button
          onClick={toggleSound}
          className="flex w-full items-center justify-between rounded-xl border border-hairline p-3 text-sm hover:bg-foreground/5"
        >
          <span className="flex items-center gap-2">
            {soundEnabled ? (
              <Volume2 className="h-5 w-5" />
            ) : (
              <VolumeX className="h-5 w-5" />
            )}
            UI sound effects
          </span>
          <span
            className={cn(
              'relative h-6 w-10 rounded-full transition-colors',
              soundEnabled ? 'bg-[var(--color-accent)]' : 'bg-foreground/20'
            )}
          >
            <span
              className={cn(
                'absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform',
                soundEnabled ? 'translate-x-[18px]' : 'translate-x-0.5'
              )}
            />
          </span>
        </button>
      </Section>

      {/* Reset */}
      <Section title="Reset">
        <button
          onClick={() => {
            closeAll();
            reset();
          }}
          className="flex items-center gap-2 rounded-xl border border-red-500/30 p-3 text-sm text-red-500 hover:bg-red-500/10"
        >
          <RotateCcw className="h-4 w-4" /> Reset desktop (relock & restore
          defaults)
        </button>
      </Section>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-5">
      <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-foreground/40">
        {title}
      </h2>
      {children}
    </section>
  );
}
