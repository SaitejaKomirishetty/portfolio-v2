'use client';

import { MapPin } from 'lucide-react';
import { Avatar } from '@/components/os/Avatar';
import { AppIcon } from '@/components/os/AppIcon';
import { useWindowStore } from '@/store/useWindowStore';
import { profile } from '@/data/profile';
import { skills } from '@/data/skills';
import { experience } from '@/data/experience';
import { socialLinks } from '@/data/socials';
import type { AppId } from '@/data/apps';

const LOCATIONS: AppId[] = ['about', 'projects', 'resume', 'blog', 'contact'];

/** Finder-style About app: sidebar of locations + bio / skills / experience. */
export function About() {
  const open = useWindowStore((s) => s.open);

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <aside className="vibrancy hidden w-44 shrink-0 flex-col gap-0.5 border-r border-hairline p-2 sm:flex">
        <p className="px-2 pb-1 text-[11px] font-semibold text-foreground/40">
          Favorites
        </p>
        {LOCATIONS.map((id) => (
          <button
            key={id}
            onClick={() => open(id)}
            className="flex items-center gap-2 rounded-md px-2 py-1 text-left text-[13px] hover:bg-foreground/10"
          >
            <AppIcon id={id} className="h-4 w-4" glyphClassName="h-2.5 w-2.5" />
            <span className="capitalize">{id === 'resume' ? 'Resume' : id}</span>
          </button>
        ))}
      </aside>

      {/* Main */}
      <div className="macos-scroll flex-1 overflow-auto p-6">
        <header className="flex items-center gap-5">
          <Avatar size={88} />
          <div>
            <h1 className="text-2xl font-bold">{profile.name}</h1>
            <p className="text-foreground/70">{profile.role}</p>
            <p className="mt-1 flex items-center gap-1 text-sm text-foreground/50">
              <MapPin className="h-3.5 w-3.5" /> {profile.location}
            </p>
          </div>
        </header>

        <section className="mt-6 space-y-3 text-[15px] leading-relaxed text-foreground/80">
          {profile.about.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </section>

        {/* Quick facts */}
        <section className="mt-6">
          <h2 className="mb-2 text-sm font-semibold text-foreground/50">
            Quick Facts
          </h2>
          <dl className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {profile.quickFacts.map((f) => (
              <div
                key={f.label}
                className="rounded-lg border border-hairline bg-foreground/[0.03] p-3"
              >
                <dt className="text-[11px] uppercase tracking-wide text-foreground/40">
                  {f.label}
                </dt>
                <dd className="text-sm font-medium">{f.value}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* Skills */}
        <section className="mt-6">
          <h2 className="mb-2 text-sm font-semibold text-foreground/50">
            Skills
          </h2>
          <div className="space-y-3">
            {skills.map((group) => (
              <div key={group.category}>
                <p className="mb-1 text-xs text-foreground/50">
                  {group.category}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {group.items.map((item) => (
                    <span
                      key={item}
                      className="rounded-full bg-[var(--color-accent)]/10 px-2.5 py-0.5 text-xs font-medium text-[var(--color-accent)]"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Experience */}
        <section className="mt-6">
          <h2 className="mb-2 text-sm font-semibold text-foreground/50">
            Experience
          </h2>
          <ol className="space-y-4 border-l border-hairline pl-4">
            {experience.map((job) => (
              <li key={job.id} className="relative">
                <span className="absolute -left-[21px] top-1.5 h-2 w-2 rounded-full bg-[var(--color-accent)]" />
                <p className="text-sm font-semibold">{job.role}</p>
                <p className="text-xs text-foreground/60">
                  {job.company} · {job.start} – {job.end}
                </p>
                <ul className="mt-1 list-disc space-y-0.5 pl-4 text-[13px] text-foreground/70">
                  {job.highlights.map((h, i) => (
                    <li key={i}>{h}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        </section>

        {/* Socials */}
        <section className="mt-6 flex flex-wrap gap-2 pb-2">
          {socialLinks.map((s) => (
            <a
              key={s.id}
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-hairline px-3 py-1 text-xs hover:bg-foreground/10"
            >
              {s.label}
            </a>
          ))}
        </section>
      </div>
    </div>
  );
}
