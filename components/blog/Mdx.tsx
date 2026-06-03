import { MDXRemote } from 'next-mdx-remote-client/rsc';
import type { MDXComponents } from 'mdx/types';
import type { MDXRemoteOptions } from 'next-mdx-remote-client/rsc';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypePrettyCode, { type Options as PrettyCodeOptions } from 'rehype-pretty-code';

const prettyCodeOptions: PrettyCodeOptions = {
  theme: 'one-dark-pro',
  keepBackground: true,
  defaultLang: 'plaintext',
};

const options: MDXRemoteOptions = {
  mdxOptions: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      rehypeSlug,
      [rehypePrettyCode, prettyCodeOptions],
      [
        rehypeAutolinkHeadings,
        { behavior: 'wrap', properties: { className: ['heading-link'] } },
      ],
    ],
  },
};

const components: MDXComponents = {
  a: ({ href = '', children, ...props }) => {
    const external = href.startsWith('http');
    return (
      <a
        href={href}
        {...(external
          ? { target: '_blank', rel: 'noopener noreferrer' }
          : {})}
        {...props}
      >
        {children}
      </a>
    );
  },
};

/** Renders MDX (server-side) with GFM, heading anchors, and Shiki highlighting. */
export function Mdx({ source }: { source: string }) {
  return (
    <MDXRemote
      source={source}
      options={options}
      components={components}
      onError={MdxError}
    />
  );
}

function MdxError({ error }: { error: Error }) {
  return (
    <pre className="rounded-lg bg-red-500/10 p-4 text-sm text-red-500">
      Failed to render content: {error.message}
    </pre>
  );
}
