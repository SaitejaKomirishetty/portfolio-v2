'use client';

import { useEffect, useState } from 'react';
import type { PostMeta } from '@/lib/blog';

/** Fetches published post metadata from the /api/posts route. */
export function usePosts() {
  const [posts, setPosts] = useState<PostMeta[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    fetch('/api/posts')
      .then((r) => r.json())
      .then((data: PostMeta[]) => {
        if (active) {
          setPosts(data);
          setLoading(false);
        }
      })
      .catch(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  return { posts, loading };
}
