# Saiteja Komirishetty — macOS Portfolio

An interactive, **macOS-inspired portfolio**. The homepage is a working desktop
environment — wallpaper, menu bar, dock, draggable/resizable windows — and each
portfolio section lives inside a desktop "app". It also ships a full **blog** at
`/blog` rendered from MDX.

![Next.js 16](https://img.shields.io/badge/Next.js-16-black) ![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue)

## ✨ Features

- **Desktop OS UI** — boot + login screen, blurred menu bar with live clock,
  dock with magnification / bounce / running indicators, desktop icons, and a
  right-click context menu.
- **Window manager** — draggable title bars, 8-way resize, traffic-light
  controls (close / minimize-genie / maximize), focus + z-index stacking,
  cascade, spring physics.
- **Apps** — About (Finder-style), interactive **Terminal**, Projects, Resume
  (PDF), Blog reader, Contact (Formspree), System Settings, Photos, and
  **Spotlight** search (`⌘/Ctrl + Space`).
- **Blog** — real, indexable `/blog` + `/blog/[slug]` pages with MDX, Shiki
  syntax highlighting, heading anchors, table of contents, prev/next, **RSS**,
  **sitemap**, **robots**, JSON-LD, and dynamic **OpenGraph images**.
- **Responsive** — desktop gets the full window experience; touch / small
  screens get an **iOS-style springboard** with full-screen app sheets.
- **Accessible** — focus traps in windows, ARIA roles, visible focus rings, and
  full `prefers-reduced-motion` support.
- **Theming** — light / dark / auto via `next-themes`; switchable wallpapers.

## 🧱 Tech stack

Next.js 16 (App Router) · React 19 · TypeScript (strict) · Tailwind CSS v4 ·
Framer Motion (`motion`) · Zustand · next-themes · lucide-react ·
`next-mdx-remote-client` + `rehype-pretty-code` (Shiki).

## 🚀 Getting started

```bash
npm install
npm run dev          # http://localhost:3000
```

Scripts:

| Command             | Description                |
| ------------------- | -------------------------- |
| `npm run dev`       | Start the dev server       |
| `npm run build`     | Production build           |
| `npm run start`     | Serve the production build |
| `npm run lint`      | Run ESLint                 |
| `npx prettier -w .` | Format with Prettier       |

## ⌨️ Keyboard shortcuts

| Shortcut         | Action          |
| ---------------- | --------------- |
| `⌘/Ctrl + Space` | Open Spotlight  |
| `⌘/Ctrl + W`     | Close window    |
| `⌘/Ctrl + M`     | Minimize window |

Deep link directly into an app with `?app=<id>`, e.g. `/?app=projects`
(`about`, `terminal`, `projects`, `resume`, `blog`, `contact`, `photos`,
`settings`).

## 📁 Project structure

```
app/
  page.tsx              # macOS desktop (renders <Desktop/>)
  blog/                 # /blog index + /blog/[slug] post pages
  api/posts/route.ts    # post metadata JSON (Blog app + Spotlight)
  feed.xml/ sitemap.ts robots.ts manifest.ts   # SEO routes
  icon.tsx apple-icon.tsx opengraph-image.tsx  # generated images
components/
  os/                   # MenuBar, Dock, Window, Spotlight, BootScreen, ...
  apps/                 # About, Terminal, Projects, ... + registry.tsx
  blog/                 # Mdx, PostCard, BlogIndex, TableOfContents, ...
data/                   # profile, skills, projects, experience, socials, apps, wallpapers
content/blog/*.mdx      # blog posts
store/                  # zustand stores (window, system, ui)
lib/                    # blog, toc, utils, sound, constants
hooks/                  # useClock, useMounted, usePosts, useIsMobile
```

## ✏️ Editing content

All content is centralized in **`/data`** — edit these files, no component
changes needed:

- `data/profile.ts` — name, role, bio, quick facts, avatar/resume paths.
- `data/skills.ts` — grouped skills.
- `data/projects.ts` — projects (title, description, tech, links, image).
- `data/experience.ts` — work history + education.
- `data/socials.ts` — social / contact links.
- `data/wallpapers.ts` — wallpaper gradients.
- `data/apps.ts` — which apps exist, dock order, icons, window sizes.

## 📝 Adding a blog post

1. Create `content/blog/my-post.mdx` (the filename becomes the URL slug).
2. Add frontmatter, then write MDX below it:

   ```
   ---
   title: 'My Post Title'
   date: '2026-01-31'
   description: 'A one-line summary used for cards + SEO.'
   tags: ['web-dev', 'react']
   cover: '/blog_covers/my-post.jpg'
   published: true
   featured: false
   ---

   Write MDX here. Fenced code blocks get Shiki syntax highlighting.
   ```

3. **Banner image (optional):** drop the file in `public/blog_covers/` and set
   `cover` to its root-relative path, e.g. `cover: '/blog_covers/my-post.jpg'`
   (an external `https://` URL works too, if its host is allowed in
   `next.config.ts`). It renders as the post hero, the index-card thumbnail, and
   the Blog app preview. Leave `cover: ''` for no banner.

4. That's it — reading time, the index card, RSS, sitemap, OG image, and the
   in-desktop Blog app all update automatically. Set `published: false` to hide
   a draft.

## 📨 Contact form (Formspree)

The Contact app posts to [Formspree](https://formspree.io). Set your form ID:

```bash
cp .env.example .env.local
# then set NEXT_PUBLIC_FORMSPREE_ID=your_form_id
```

Without it, the form gracefully falls back to opening the visitor's mail client.

## ✅ Before you ship — content TODOs

- Add **`public/avatar.png`** (square, ~512px) — falls back to "SK" initials.
- Add **`public/resume.pdf`** — the Resume app shows a placeholder until then.
- Fill in **education** details in `data/experience.ts`.
- Set **`NEXT_PUBLIC_FORMSPREE_ID`** for in-page contact delivery.
- Update **`siteUrl`** in `data/profile.ts` if deploying to a new domain
  (drives canonical URLs, sitemap, RSS, and OG metadata).

## ☁️ Deploy

Deploys cleanly to **Vercel** (zero config). Push the repo, import it, add the
`NEXT_PUBLIC_FORMSPREE_ID` env var, and ship.

---

Built with care and a love for macOS.
