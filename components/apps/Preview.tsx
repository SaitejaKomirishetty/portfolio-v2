'use client';

import { Download, FileText } from 'lucide-react';
import { profile } from '@/data/profile';

/**
 * Preview (Resume) app. Embeds the CV PDF with a download button.
 * The <object> fallback renders when /resume.pdf hasn't been added yet.
 */
export function Preview() {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-hairline px-4 py-2">
        <span className="flex items-center gap-2 text-sm font-medium">
          <FileText className="h-4 w-4" /> Resume.pdf
        </span>
        <a
          href={profile.resume}
          download
          className="flex items-center gap-1.5 rounded-full bg-[var(--color-accent)] px-3 py-1 text-sm font-medium text-white hover:bg-[var(--color-accent-hover)]"
        >
          <Download className="h-4 w-4" /> Download
        </a>
      </div>

      <div className="flex-1 bg-zinc-200 dark:bg-zinc-800">
        <object
          data={profile.resume}
          type="application/pdf"
          className="h-full w-full"
          aria-label="Resume PDF"
        >
          {/* Fallback shown when the PDF is missing or can't be embedded. */}
          <div className="flex h-full flex-col items-center justify-center gap-3 p-8 text-center">
            <FileText className="h-12 w-12 text-foreground/30" />
            <p className="font-medium">Resume preview unavailable</p>
            <p className="max-w-xs text-sm text-foreground/60">
              {/* TODO: add your CV at /public/resume.pdf to enable the embedded
                  preview. */}
              Drop your CV at{' '}
              <code className="rounded bg-foreground/10 px-1">
                /public/resume.pdf
              </code>{' '}
              to enable the embedded preview.
            </p>
            <a
              href={profile.resume}
              download
              className="rounded-full bg-[var(--color-accent)] px-4 py-1.5 text-sm font-medium text-white"
            >
              Try download
            </a>
          </div>
        </object>
      </div>
    </div>
  );
}
