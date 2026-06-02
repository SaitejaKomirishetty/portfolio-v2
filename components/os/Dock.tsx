'use client';

import { useRef, useState } from 'react';
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from 'motion/react';
import { Trash2 } from 'lucide-react';
import { dockApps, apps, type AppId } from '@/data/apps';
import { socials } from '@/data/socials';
import { useWindowStore } from '@/store/useWindowStore';
import { AppIcon } from './AppIcon';
import { GithubIcon, LinkedinIcon } from './icons/Brands';
import { playSound } from '@/lib/sound';
import { cn } from '@/lib/utils';

const BASE = 48;
const MAX = 78;

export function Dock() {
  const mouseX = useMotionValue(Infinity);
  const reduce = useReducedMotion();

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-2 z-[5000] flex justify-center">
      <motion.div
        onMouseMove={(e) => mouseX.set(e.pageX)}
        onMouseLeave={() => mouseX.set(Infinity)}
        className="vibrancy pointer-events-auto flex items-end gap-2.5 rounded-2xl border border-hairline border-white/20 px-3 pb-2 pt-2.5 shadow-2xl no-select"
      >
        {dockApps.map((id) => (
          <DockApp key={id} id={id} mouseX={mouseX} reduce={!!reduce} />
        ))}

        <div className="mx-1 h-12 w-px self-center bg-white/20" />

        <DockLink
          href={socials.github}
          label="GitHub"
          mouseX={mouseX}
          reduce={!!reduce}
        >
          <GithubIcon className="h-1/2 w-1/2 text-white" />
        </DockLink>
        <DockLink
          href={socials.linkedin}
          label="LinkedIn"
          mouseX={mouseX}
          reduce={!!reduce}
        >
          <LinkedinIcon className="h-1/2 w-1/2 text-white" />
        </DockLink>
        <DockTrash mouseX={mouseX} reduce={!!reduce} />
      </motion.div>
    </div>
  );
}

/** Shared magnification width spring for a dock slot. */
function useMagnify<T extends HTMLElement>(
  mouseX: MotionValue<number>,
  reduce: boolean
) {
  const ref = useRef<T>(null);
  const distance = useTransform(mouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect();
    if (!bounds) return Infinity;
    return val - bounds.x - bounds.width / 2;
  });
  const widthSync = useTransform(distance, [-160, 0, 160], [BASE, MAX, BASE]);
  const width = useSpring(widthSync, {
    stiffness: 350,
    damping: 22,
    mass: 0.6,
  });
  return { ref, width: reduce ? undefined : width };
}

function DockApp({
  id,
  mouseX,
  reduce,
}: {
  id: AppId;
  mouseX: MotionValue<number>;
  reduce: boolean;
}) {
  const { ref, width } = useMagnify<HTMLButtonElement>(mouseX, reduce);
  const toggleOpen = useWindowStore((s) => s.toggleOpen);
  const isOpen = useWindowStore((s) => Boolean(s.windows[id]));
  const [bounce, setBounce] = useState(0);
  const meta = apps[id];

  return (
    <div className="group/dock relative flex flex-col items-center">
      <span className="pointer-events-none absolute -top-9 hidden whitespace-nowrap rounded-md bg-zinc-800/90 px-2 py-1 text-xs text-white shadow-lg group-hover/dock:block">
        {meta.name}
      </span>
      <motion.button
        ref={ref}
        type="button"
        aria-label={`Open ${meta.name}`}
        style={{ width: width ?? BASE }}
        animate={reduce ? undefined : { y: bounce ? [-0, -18, 0] : 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        onClick={() => {
          if (!isOpen) {
            setBounce((n) => n + 1);
            playSound('open');
          } else {
            playSound('click');
          }
          toggleOpen(id);
        }}
        className="aspect-square"
      >
        <AppIcon id={id} className="h-full w-full" glyphClassName="h-1/2 w-1/2" />
      </motion.button>
      <span
        className={cn(
          'mt-0.5 h-1 w-1 rounded-full bg-white/80 transition-opacity',
          isOpen ? 'opacity-100' : 'opacity-0'
        )}
      />
    </div>
  );
}

function DockLink({
  href,
  label,
  mouseX,
  reduce,
  children,
}: {
  href: string;
  label: string;
  mouseX: MotionValue<number>;
  reduce: boolean;
  children: React.ReactNode;
}) {
  const { ref, width } = useMagnify<HTMLAnchorElement>(mouseX, reduce);
  return (
    <div className="group/dock relative flex flex-col items-center">
      <span className="pointer-events-none absolute -top-9 hidden whitespace-nowrap rounded-md bg-zinc-800/90 px-2 py-1 text-xs text-white shadow-lg group-hover/dock:block">
        {label}
      </span>
      <motion.a
        ref={ref}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={label}
        style={{ width: width ?? BASE }}
        className="flex aspect-square items-center justify-center rounded-[22%] bg-gradient-to-br from-zinc-600 to-zinc-800 shadow-md"
      >
        {children}
      </motion.a>
      <span className="mt-0.5 h-1 w-1 rounded-full opacity-0" />
    </div>
  );
}

function DockTrash({
  mouseX,
  reduce,
}: {
  mouseX: MotionValue<number>;
  reduce: boolean;
}) {
  const { ref, width } = useMagnify<HTMLDivElement>(mouseX, reduce);
  return (
    <div className="group/dock relative flex flex-col items-center">
      <span className="pointer-events-none absolute -top-9 hidden whitespace-nowrap rounded-md bg-zinc-800/90 px-2 py-1 text-xs text-white shadow-lg group-hover/dock:block">
        Trash
      </span>
      <motion.div
        ref={ref}
        style={{ width: width ?? BASE }}
        className="flex aspect-square items-center justify-center rounded-[22%] bg-gradient-to-br from-zinc-300 to-zinc-500 shadow-md"
        aria-hidden
      >
        <Trash2 className="h-1/2 w-1/2 text-zinc-800" />
      </motion.div>
      <span className="mt-0.5 h-1 w-1 rounded-full opacity-0" />
    </div>
  );
}
