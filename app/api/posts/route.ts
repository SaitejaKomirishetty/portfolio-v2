import { getAllPosts } from '@/lib/blog';

/** Returns published post metadata as JSON for the in-desktop Blog + Spotlight. */
export function GET() {
  return Response.json(getAllPosts());
}
