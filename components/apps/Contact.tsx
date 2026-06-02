'use client';

import { useState, type FormEvent } from 'react';
import { Send, Check, AlertCircle } from 'lucide-react';
import { profile } from '@/data/profile';
import { socialLinks } from '@/data/socials';

type Status = 'idle' | 'submitting' | 'success' | 'error';

// Set NEXT_PUBLIC_FORMSPREE_ID in .env.local to enable real submissions.
// Without it, the form falls back to opening the user's mail client.
const FORMSPREE_ID = process.env.NEXT_PUBLIC_FORMSPREE_ID;

const INPUT_CLASS =
  'w-full rounded-lg border border-hairline bg-foreground/[0.04] px-3 py-2 text-sm outline-none focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/30';

export function Contact() {
  const [status, setStatus] = useState<Status>('idle');
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  const update = (key: keyof typeof form) => (value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Fallback: no Formspree configured → open the mail client.
    if (!FORMSPREE_ID) {
      const subject = encodeURIComponent(`Portfolio message from ${form.name}`);
      const body = encodeURIComponent(`${form.message}\n\n— ${form.name} (${form.email})`);
      window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`;
      return;
    }

    setStatus('submitting');
    try {
      const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Request failed');
      setStatus('success');
      setForm({ name: '', email: '', message: '' });
    } catch {
      setStatus('error');
    }
  };

  return (
    <div className="macos-scroll h-full overflow-auto">
      {/* Mail-style header */}
      <div className="border-b border-hairline px-4 py-2 text-sm text-foreground/60">
        New Message · To:{' '}
        <span className="font-medium text-foreground">{profile.email}</span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3 p-4">
        <Field label="Your name">
          <input
            required
            value={form.name}
            onChange={(e) => update('name')(e.target.value)}
            className={INPUT_CLASS}
            placeholder="Jane Appleseed"
          />
        </Field>
        <Field label="Your email">
          <input
            required
            type="email"
            value={form.email}
            onChange={(e) => update('email')(e.target.value)}
            className={INPUT_CLASS}
            placeholder="jane@example.com"
          />
        </Field>
        <Field label="Message">
          <textarea
            required
            rows={5}
            value={form.message}
            onChange={(e) => update('message')(e.target.value)}
            className={`${INPUT_CLASS} resize-none`}
            placeholder="Let's build something great together…"
          />
        </Field>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={status === 'submitting'}
            className="flex items-center gap-1.5 rounded-full bg-[var(--color-accent)] px-4 py-1.5 text-sm font-medium text-white hover:bg-[var(--color-accent-hover)] disabled:opacity-60"
          >
            <Send className="h-4 w-4" />
            {status === 'submitting' ? 'Sending…' : 'Send'}
          </button>

          {status === 'success' && (
            <span className="flex items-center gap-1 text-sm text-emerald-500">
              <Check className="h-4 w-4" /> Message sent — thank you!
            </span>
          )}
          {status === 'error' && (
            <span className="flex items-center gap-1 text-sm text-red-500">
              <AlertCircle className="h-4 w-4" /> Something went wrong.
            </span>
          )}
        </div>

        {!FORMSPREE_ID && (
          <p className="text-xs text-foreground/40">
            {/* TODO: add NEXT_PUBLIC_FORMSPREE_ID to .env.local for in-app
                delivery. Until then, Send opens your mail client. */}
            Tip: set <code className="rounded bg-foreground/10 px-1">NEXT_PUBLIC_FORMSPREE_ID</code>{' '}
            to send without leaving the page.
          </p>
        )}
      </form>

      {/* Socials */}
      <div className="border-t border-hairline p-4">
        <p className="mb-2 text-xs font-semibold text-foreground/50">
          Or find me on
        </p>
        <div className="flex flex-wrap gap-2">
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
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-foreground/60">
        {label}
      </span>
      {children}
    </label>
  );
}
