import { allAppIds, apps, type AppId } from '@/data/apps';
import { projects } from '@/data/projects';

/**
 * A virtual filesystem powering the Finder app. Nodes are either folders
 * (which contain children) or "leaves" that perform an action when
 * activated: open a portfolio app, open a URL, navigate a route, or show
 * an inline file preview.
 */

export type FinderKind = 'folder' | 'app' | 'url' | 'route' | 'file';

interface FinderNodeBase {
  id: string;
  name: string;
  kind: FinderKind;
  /** lucide-react icon name used for the node glyph (optional override). */
  icon?: string;
}

export type FinderNode = FinderNodeBase &
  (
    | { kind: 'folder'; children: FinderNode[] }
    | { kind: 'app'; appId: AppId }
    | { kind: 'url'; url: string }
    | { kind: 'route'; href: string }
    | { kind: 'file'; preview: string }
  );

/** Top-level "Favorites" the sidebar pins. */
export const FAVORITE_IDS = [
  'desktop',
  'documents',
  'applications',
  'projects',
  'blog',
] as const;

const readme: FinderNode = {
  id: 'doc-readme',
  name: 'README.txt',
  kind: 'file',
  preview:
    'Welcome to my portfolio, reimagined as a macOS desktop.\n\n' +
    'Browse the Applications folder to launch any app, peek at Projects to ' +
    'open their live demos, or jump straight into the Blog. Everything here ' +
    'is interactive — double-click to explore.',
};

const about: FinderNode = {
  id: 'doc-about',
  name: 'about-me.md',
  kind: 'file',
  preview:
    'Frontend developer focused on crafting elegant, user-centric web ' +
    'experiences with React, Next.js, and TypeScript. Currently a Software ' +
    'Engineer at Torry Harris Integration Solutions in Bengaluru.',
};

const colophon: FinderNode = {
  id: 'doc-colophon',
  name: 'colophon.txt',
  kind: 'file',
  preview:
    'Built with Next.js, React, TypeScript, Tailwind CSS, Motion, and ' +
    'Zustand. The window manager, dock, and these little apps are all ' +
    'hand-rolled to feel like the real thing.',
};

/** App nodes — every registered portfolio app, in dock-ish order. */
const appNodes: FinderNode[] = allAppIds.map((id) => ({
  id: `app-${id}`,
  name: apps[id].name,
  kind: 'app',
  appId: id,
}));

/** Project nodes — open the live demo (preferred) or the GitHub repo. */
const projectNodes: FinderNode[] = projects.map((p) => ({
  id: `project-${p.id}`,
  name: p.title,
  kind: 'url',
  url: p.demo ?? p.github ?? '#',
}));

/** The root of the tree. The Finder starts focused on a child of this. */
export const FINDER_ROOT: FinderNode = {
  id: 'root',
  name: 'Saiteja',
  kind: 'folder',
  children: [
    {
      id: 'desktop',
      name: 'Desktop',
      kind: 'folder',
      icon: 'Monitor',
      children: [about],
    },
    {
      id: 'documents',
      name: 'Documents',
      kind: 'folder',
      icon: 'FolderOpen',
      children: [readme, about, colophon],
    },
    {
      id: 'applications',
      name: 'Applications',
      kind: 'folder',
      icon: 'LayoutGrid',
      children: appNodes,
    },
    {
      id: 'projects',
      name: 'Projects',
      kind: 'folder',
      icon: 'FolderGit2',
      children: projectNodes,
    },
    {
      id: 'blog',
      name: 'Blog',
      kind: 'route',
      href: '/blog',
      icon: 'NotebookPen',
    },
  ],
};

/** Find a node by id anywhere in the tree (depth-first). */
export function findNode(
  node: FinderNode,
  id: string,
): FinderNode | null {
  if (node.id === id) return node;
  if (node.kind === 'folder') {
    for (const child of node.children) {
      const hit = findNode(child, id);
      if (hit) return hit;
    }
  }
  return null;
}
