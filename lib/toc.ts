import GithubSlugger from 'github-slugger';

export interface TocItem {
  level: number;
  text: string;
  slug: string;
}

/**
 * Extracts h2/h3 headings from raw MDX to build a table of contents.
 * Uses github-slugger so slugs match rehype-slug's generated anchor ids.
 */
export function getToc(content: string): TocItem[] {
  const slugger = new GithubSlugger();
  const toc: TocItem[] = [];
  let inCodeBlock = false;

  for (const line of content.split('\n')) {
    if (line.trim().startsWith('```')) {
      inCodeBlock = !inCodeBlock;
      continue;
    }
    if (inCodeBlock) continue;

    const match = /^(#{2,3})\s+(.+?)\s*#*$/.exec(line);
    if (!match) continue;

    const level = match[1].length;
    // Strip inline markdown markers for clean display + slugging.
    const text = match[2].replace(/[`*_]/g, '').trim();
    toc.push({ level, text, slug: slugger.slug(text) });
  }

  return toc;
}
