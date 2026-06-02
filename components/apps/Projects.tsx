'use client';

import { useState } from 'react';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { motion } from 'motion/react';
import { projects, type Project } from '@/data/projects';
import { GithubIcon } from '@/components/os/icons/Brands';
import { cn } from '@/lib/utils';

/** Image with a graceful gradient fallback when the remote src fails. */
function ProjectImage({ project }: { project: Project }) {
  const [errored, setErrored] = useState(false);
  if (errored || !project.image) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-zinc-700 to-zinc-900 text-3xl font-bold text-white/80">
        {project.title[0]}
      </div>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={project.image}
      alt={project.title}
      loading="lazy"
      onError={() => setErrored(true)}
      className="h-full w-full object-cover"
    />
  );
}

export function Projects() {
  const [selected, setSelected] = useState<Project | null>(null);

  if (selected) {
    return (
      <div className="macos-scroll h-full overflow-auto">
        <div className="sticky top-0 z-10 flex items-center gap-2 border-b border-hairline bg-[var(--background)]/80 p-3 backdrop-blur">
          <button
            onClick={() => setSelected(null)}
            className="flex items-center gap-1 rounded-md px-2 py-1 text-sm hover:bg-foreground/10"
          >
            <ArrowLeft className="h-4 w-4" /> Projects
          </button>
        </div>

        <div className="aspect-video w-full overflow-hidden bg-zinc-900">
          <ProjectImage project={selected} />
        </div>

        <div className="p-6">
          <h1 className="text-2xl font-bold">{selected.title}</h1>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {selected.tech.map((t) => (
              <span
                key={t}
                className="rounded-full bg-foreground/10 px-2.5 py-0.5 text-xs font-medium"
              >
                {t}
              </span>
            ))}
          </div>
          <p className="mt-4 text-[15px] leading-relaxed text-foreground/80">
            {selected.longDescription ?? selected.description}
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            {selected.demo && (
              <a
                href={selected.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 rounded-full bg-[var(--color-accent)] px-4 py-1.5 text-sm font-medium text-white hover:bg-[var(--color-accent-hover)]"
              >
                <ExternalLink className="h-4 w-4" /> Live Demo
              </a>
            )}
            {selected.github && (
              <a
                href={selected.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 rounded-full border border-hairline px-4 py-1.5 text-sm font-medium hover:bg-foreground/10"
              >
                <GithubIcon className="h-4 w-4" /> Source
              </a>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="macos-scroll h-full overflow-auto p-5">
      <h1 className="mb-4 text-lg font-semibold">Projects</h1>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {projects.map((p) => (
          <motion.button
            key={p.id}
            whileHover={{ y: -3 }}
            onClick={() => setSelected(p)}
            className={cn(
              'group overflow-hidden rounded-xl border border-hairline bg-foreground/[0.03] text-left',
              'shadow-sm transition-shadow hover:shadow-lg'
            )}
          >
            <div className="aspect-video w-full overflow-hidden bg-zinc-900">
              <ProjectImage project={p} />
            </div>
            <div className="p-3">
              <h2 className="font-semibold">{p.title}</h2>
              <p className="mt-0.5 line-clamp-2 text-sm text-foreground/60">
                {p.description}
              </p>
              <div className="mt-2 flex flex-wrap gap-1">
                {p.tech.slice(0, 4).map((t) => (
                  <span
                    key={t}
                    className="rounded-full bg-foreground/10 px-2 py-0.5 text-[11px]"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
