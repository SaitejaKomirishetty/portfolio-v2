'use client';

import { createElement, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import {
  AppWindow,
  ChevronLeft,
  ChevronRight,
  ChevronRight as Sep,
  Folder,
  FolderGit2,
  FolderOpen,
  FileText,
  Globe,
  Inbox,
  LayoutGrid,
  Monitor,
  NotebookPen,
  Star,
  type LucideIcon,
} from 'lucide-react';
import { useWindowStore } from '@/store/useWindowStore';
import {
  FAVORITE_IDS,
  FINDER_ROOT,
  findNode,
  type FinderNode,
} from './finderData';
import { cn } from '@/lib/utils';

/** Map a lucide icon name (from the data layer) to a component. */
const ICONS: Record<string, LucideIcon> = {
  Monitor,
  FolderOpen,
  LayoutGrid,
  FolderGit2,
  NotebookPen,
};

/** Pick a glyph for a node: explicit icon override, else by kind. */
function glyphFor(node: FinderNode): LucideIcon {
  if (node.icon && ICONS[node.icon]) return ICONS[node.icon];
  switch (node.kind) {
    case 'folder':
      return Folder;
    case 'app':
      return AppWindow;
    case 'url':
      return Globe;
    case 'route':
      return NotebookPen;
    case 'file':
      return FileText;
  }
}

/**
 * Render a node's glyph. `glyphFor` only ever returns a stable, module-level
 * lucide icon (selected by kind), so we render it via createElement to keep the
 * dynamic selection out of JSX — no per-render component identity churn.
 */
function NodeGlyph({
  node,
  className,
  strokeWidth,
}: {
  node: FinderNode;
  className?: string;
  strokeWidth?: number;
}) {
  return createElement(glyphFor(node), { className, strokeWidth });
}

/** Tile accent (background + icon color) by node kind. */
function tileTone(node: FinderNode): string {
  switch (node.kind) {
    case 'folder':
    case 'route':
      return 'text-[var(--color-accent)] bg-[var(--color-accent)]/10';
    case 'app':
      return 'text-violet-500 bg-violet-500/10';
    case 'url':
      return 'text-emerald-500 bg-emerald-500/10';
    case 'file':
      return 'text-foreground/60 bg-foreground/[0.06]';
  }
}

export function Finder() {
  const router = useRouter();
  const openApp = useWindowStore((s) => s.open);

  // Navigation stack of folder ids; the last entry is the current folder.
  const [stack, setStack] = useState<string[]>(['documents']);
  const [forward, setForward] = useState<string[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const currentId = stack[stack.length - 1];
  const current = useMemo(
    () => findNode(FINDER_ROOT, currentId),
    [currentId],
  );

  const children: FinderNode[] =
    current && current.kind === 'folder' ? current.children : [];

  const selected =
    selectedId && current
      ? children.find((c) => c.id === selectedId) ?? null
      : null;

  /** Breadcrumb path from root → current folder. */
  const crumbs = useMemo(() => {
    const path: FinderNode[] = [FINDER_ROOT];
    for (const id of stack) {
      const n = findNode(FINDER_ROOT, id);
      if (n) path.push(n);
    }
    return path;
  }, [stack]);

  function navigateTo(folderId: string) {
    if (folderId === currentId) return;
    setStack((prev) => [...prev, folderId]);
    setForward([]);
    setSelectedId(null);
  }

  function goBack() {
    if (stack.length <= 1) return;
    setStack((prev) => {
      const next = prev.slice(0, -1);
      setForward((f) => [prev[prev.length - 1], ...f]);
      return next;
    });
    setSelectedId(null);
  }

  function goForward() {
    if (forward.length === 0) return;
    const [head, ...rest] = forward;
    setStack((prev) => [...prev, head]);
    setForward(rest);
    setSelectedId(null);
  }

  /** Open / activate a node (double-click, Enter, or sidebar click). */
  function activate(node: FinderNode) {
    switch (node.kind) {
      case 'folder':
        navigateTo(node.id);
        break;
      case 'app':
        openApp(node.appId);
        break;
      case 'url':
        if (node.url && node.url !== '#') {
          window.open(node.url, '_blank', 'noopener,noreferrer');
        }
        break;
      case 'route':
        router.push(node.href);
        break;
      case 'file':
        setSelectedId(node.id);
        break;
    }
  }

  const canBack = stack.length > 1;
  const canForward = forward.length > 0;

  return (
    <div className="flex h-full flex-col bg-[var(--background)] text-foreground no-select">
      {/* Toolbar */}
      <div className="flex items-center gap-2 border-b border-hairline px-3 py-2 vibrancy">
        <div className="flex items-center gap-0.5">
          <ToolbarButton
            label="Back"
            disabled={!canBack}
            onClick={goBack}
            icon={ChevronLeft}
          />
          <ToolbarButton
            label="Forward"
            disabled={!canForward}
            onClick={goForward}
            icon={ChevronRight}
          />
        </div>
        {/* Breadcrumb path */}
        <nav
          aria-label="Path"
          className="macos-scroll flex min-w-0 flex-1 items-center gap-1 overflow-x-auto text-sm"
        >
          {crumbs.map((node, i) => {
            const isLast = i === crumbs.length - 1;
            const isRoot = node.id === 'root';
            return (
              <span key={node.id} className="flex shrink-0 items-center gap-1">
                {i > 0 && (
                  <Sep className="h-3.5 w-3.5 shrink-0 text-foreground/30" />
                )}
                <button
                  type="button"
                  disabled={isLast || isRoot}
                  onClick={() => {
                    // Jump back to this crumb (root not navigable here).
                    const idx = stack.indexOf(node.id);
                    if (idx >= 0) {
                      setForward([]);
                      setStack(stack.slice(0, idx + 1));
                      setSelectedId(null);
                    }
                  }}
                  className={cn(
                    'rounded px-1.5 py-0.5 font-medium',
                    isLast
                      ? 'text-foreground'
                      : 'text-foreground/60 hover:bg-foreground/10 hover:text-foreground',
                  )}
                >
                  {node.name}
                </button>
              </span>
            );
          })}
        </nav>
      </div>

      {/* Body: sidebar + main pane */}
      <div className="flex min-h-0 flex-1">
        {/* Sidebar */}
        <aside className="w-48 shrink-0 overflow-auto border-r border-hairline vibrancy macos-scroll">
          <SidebarSection title="Favorites" />
          {FAVORITE_IDS.map((favId) => {
            const node = findNode(FINDER_ROOT, favId);
            if (!node) return null;
            const active = node.id === currentId;
            return (
              <button
                key={node.id}
                onClick={() => activate(node)}
                aria-current={active ? 'true' : undefined}
                className={cn(
                  'flex w-full items-center gap-2.5 px-3 py-1.5 text-[13px]',
                  active
                    ? 'bg-[var(--color-accent)]/15 font-medium text-foreground'
                    : 'text-foreground/80 hover:bg-foreground/5',
                )}
              >
                <NodeGlyph
                  node={node}
                  className={cn(
                    'h-4 w-4 shrink-0',
                    active
                      ? 'text-[var(--color-accent)]'
                      : 'text-[var(--color-accent)]/80',
                  )}
                />
                <span className="truncate">{node.name}</span>
              </button>
            );
          })}

          <SidebarSection title="Locations" />
          <button
            onClick={() => {
              setForward([]);
              setStack(['documents']);
              setSelectedId(null);
            }}
            className="flex w-full items-center gap-2.5 px-3 py-1.5 text-[13px] text-foreground/80 hover:bg-foreground/5"
          >
            <Star className="h-4 w-4 shrink-0 text-amber-500" />
            <span className="truncate">Saiteja’s Mac</span>
          </button>
        </aside>

        {/* Main pane */}
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="macos-scroll flex-1 overflow-auto p-5">
            {children.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center gap-3 text-center text-foreground/40">
                <Inbox className="h-10 w-10" strokeWidth={1.5} />
                <p className="text-sm">This folder is empty</p>
              </div>
            ) : (
              <div className="grid grid-cols-[repeat(auto-fill,minmax(96px,1fr))] gap-3">
                {children.map((node) => (
                  <GridTile
                    key={node.id}
                    node={node}
                    selected={node.id === selectedId}
                    onSelect={() => setSelectedId(node.id)}
                    onActivate={() => activate(node)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Detail strip for the selected file's preview. */}
          {selected && selected.kind === 'file' && (
            <div className="border-t border-hairline bg-foreground/[0.03] px-5 py-3">
              <div className="mb-1 flex items-center gap-2 text-xs font-medium text-foreground/60">
                <FileText className="h-3.5 w-3.5" />
                {selected.name}
              </div>
              <p className="line-clamp-3 whitespace-pre-line text-[13px] leading-relaxed text-foreground/75">
                {selected.preview}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ToolbarButton({
  label,
  icon: Icon,
  onClick,
  disabled,
}: {
  label: string;
  icon: LucideIcon;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'flex h-7 w-7 items-center justify-center rounded-md',
        disabled
          ? 'cursor-default text-foreground/25'
          : 'text-foreground/70 hover:bg-foreground/10 hover:text-foreground',
      )}
    >
      <Icon className="h-4.5 w-4.5" />
    </button>
  );
}

function SidebarSection({ title }: { title: string }) {
  return (
    <p className="px-3 pb-1 pt-3 text-[11px] font-semibold uppercase tracking-wide text-foreground/40">
      {title}
    </p>
  );
}

function GridTile({
  node,
  selected,
  onSelect,
  onActivate,
}: {
  node: FinderNode;
  selected: boolean;
  onSelect: () => void;
  onActivate: () => void;
}) {
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.96 }}
      onClick={onSelect}
      onDoubleClick={onActivate}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          onActivate();
        }
      }}
      aria-label={node.name}
      className={cn(
        'group flex flex-col items-center gap-1.5 rounded-lg p-2 text-center focus-visible:outline-none',
        selected
          ? 'bg-[var(--color-accent)]/15'
          : 'hover:bg-foreground/5 focus-visible:bg-foreground/5',
      )}
    >
      <span
        className={cn(
          'flex h-14 w-14 items-center justify-center squircle',
          tileTone(node),
        )}
      >
        <NodeGlyph node={node} className="h-7 w-7" strokeWidth={1.75} />
      </span>
      <span
        className={cn(
          'line-clamp-2 max-w-full break-words rounded px-1 text-[12px] leading-tight',
          selected
            ? 'bg-[var(--color-accent)] text-white'
            : 'text-foreground/85',
        )}
      >
        {node.name}
      </span>
    </motion.button>
  );
}
