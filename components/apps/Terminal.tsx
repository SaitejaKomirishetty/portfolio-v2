'use client';

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { profile } from '@/data/profile';
import { allSkills, skills } from '@/data/skills';
import { projects } from '@/data/projects';
import { experience } from '@/data/experience';
import { socialLinks } from '@/data/socials';

interface Line {
  prompt?: string;
  content: ReactNode;
}

const PROMPT = 'saiteja@portfolio ~ %';

const FILES: Record<string, string> = {
  'about.txt': profile.about.join('\n\n'),
  'skills.txt': skills
    .map((g) => `${g.category}:\n  ${g.items.join(', ')}`)
    .join('\n\n'),
  'projects.txt': projects
    .map((p) => `${p.title} — ${p.description}\n  ${p.github ?? ''}`)
    .join('\n\n'),
  'experience.txt': experience
    .map((e) => `${e.role} @ ${e.company} (${e.start} – ${e.end})`)
    .join('\n'),
  'contact.txt': socialLinks.map((s) => `${s.label}: ${s.url}`).join('\n'),
};

const BANNER = `
   ███████╗ ██╗  ██╗
   ██╔════╝ ██║ ██╔╝     ${profile.name}
   ███████╗ █████╔╝      ${profile.role}
   ╚════██║ ██╔═██╗      ${profile.location}
   ███████║ ██║  ██╗
   ╚══════╝ ╚═╝  ╚═╝     Type 'help' to get started.
`;

export function Terminal() {
  const [lines, setLines] = useState<Line[]>(() => [{ content: BANNER }]);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState(-1);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const commands = useMemo(
    () => buildCommands(() => setLines([{ content: BANNER }])),
    []
  );

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [lines]);

  const run = (raw: string) => {
    const cmd = raw.trim();
    const echo: Line = { prompt: PROMPT, content: cmd };

    if (!cmd) {
      setLines((l) => [...l, echo]);
      return;
    }

    setHistory((h) => [...h, cmd]);
    setHistoryIdx(-1);

    const [name, ...args] = cmd.split(/\s+/);
    const handler = commands[name.toLowerCase()];

    if (name.toLowerCase() === 'clear') {
      commands.clear(args);
      return;
    }

    const output: ReactNode = handler
      ? handler(args)
      : `command not found: ${name}. Type 'help' for available commands.`;

    setLines((l) => [...l, echo, { content: output }]);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      run(input);
      setInput('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (!history.length) return;
      const idx = historyIdx === -1 ? history.length - 1 : Math.max(0, historyIdx - 1);
      setHistoryIdx(idx);
      setInput(history[idx]);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIdx === -1) return;
      const idx = historyIdx + 1;
      if (idx >= history.length) {
        setHistoryIdx(-1);
        setInput('');
      } else {
        setHistoryIdx(idx);
        setInput(history[idx]);
      }
    }
  };

  return (
    <div
      className="macos-scroll h-full overflow-auto bg-[#1a1a1c] p-3 font-mono text-[13px] leading-relaxed text-zinc-200"
      ref={scrollRef}
      onClick={() => inputRef.current?.focus()}
    >
      {lines.map((line, i) => (
        <div key={i} className="whitespace-pre-wrap break-words">
          {line.prompt && <span className="text-emerald-400">{line.prompt} </span>}
          {line.content}
        </div>
      ))}

      {/* Active input line */}
      <div className="flex items-center">
        <span className="shrink-0 text-emerald-400">{PROMPT}&nbsp;</span>
        <input
          ref={inputRef}
          autoFocus
          value={input}
          spellCheck={false}
          autoComplete="off"
          aria-label="Terminal input"
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          className="flex-1 bg-transparent text-zinc-100 caret-emerald-400 outline-none"
        />
      </div>
    </div>
  );
}

type CommandMap = Record<string, (args: string[]) => ReactNode>;

function buildCommands(clearScreen: () => void): CommandMap {
  const help = `Available commands:
  help        Show this help
  whoami      Who is Saiteja?
  about       Short bio
  ls          List files
  cat <file>  Print a file (e.g. cat about.txt)
  projects    List projects
  skills      List skills
  experience  Work history
  contact     Social + contact links
  neofetch    System info banner
  clear       Clear the screen`;

  return {
    help: () => help,
    whoami: () => `${profile.name} — ${profile.currentTitle}. ${profile.tagline}`,
    about: () => profile.about.join('\n\n'),
    ls: () => Object.keys(FILES).join('   ') + '   resume.pdf',
    cat: (args) => {
      const file = args[0];
      if (!file) return 'usage: cat <file>';
      if (file === 'resume.pdf')
        return 'resume.pdf is a binary file. Open the Resume app to view it.';
      return FILES[file] ?? `cat: ${file}: No such file`;
    },
    projects: () =>
      projects
        .map(
          (p) =>
            `• ${p.title} [${p.tech.join(', ')}]\n  ${p.description}\n  ${p.demo ?? p.github ?? ''}`
        )
        .join('\n\n'),
    skills: () => allSkills.join(', '),
    experience: () =>
      experience
        .map(
          (e) =>
            `${e.start} – ${e.end}  ${e.role} @ ${e.company}\n  ${e.highlights[0]}`
        )
        .join('\n\n'),
    contact: () => (
      <span>
        {socialLinks.map((s) => (
          <span key={s.id} className="block">
            {s.label.padEnd(12)}{' '}
            <a
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sky-400 underline"
            >
              {s.handle ?? s.url}
            </a>
          </span>
        ))}
      </span>
    ),
    neofetch: () => {
      const info = `${profile.name}@portfolio
-----------------
OS:        portfolioOS (Next.js 16)
Host:      saitejakomirishetty.com
Shell:     web-zsh
Role:      ${profile.role}
Languages: ${skills[0].items.join(', ')}
Skills:    ${allSkills.length} technologies
Uptime:    since 2023
Contact:   ${profile.email}`;
      return info;
    },
    clear: () => {
      clearScreen();
      return null;
    },
  };
}
