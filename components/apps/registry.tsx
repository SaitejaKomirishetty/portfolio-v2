'use client';

import dynamic from 'next/dynamic';
import type { ComponentType } from 'react';
import type { AppId } from '@/data/apps';

/**
 * Maps each AppId to its window content component. Each app is code-split via
 * next/dynamic so it loads only when first opened (smaller initial bundle).
 *
 * Note: next/dynamic options must be inline object literals (compile-time
 * analyzed), so the `{ loading, ssr }` config is repeated per entry.
 */

function AppLoading() {
  return (
    <div className="flex h-full items-center justify-center">
      <span className="h-6 w-6 animate-spin rounded-full border-2 border-foreground/20 border-t-foreground/60" />
    </div>
  );
}

export const appComponents: Record<AppId, ComponentType> = {
  about: dynamic(() => import('./About').then((m) => m.About), {
    loading: AppLoading,
    ssr: false,
  }),
  terminal: dynamic(() => import('./Terminal').then((m) => m.Terminal), {
    loading: AppLoading,
    ssr: false,
  }),
  finder: dynamic(() => import('./Finder').then((m) => m.Finder), {
    loading: AppLoading,
    ssr: false,
  }),
  projects: dynamic(() => import('./Projects').then((m) => m.Projects), {
    loading: AppLoading,
    ssr: false,
  }),
  resume: dynamic(() => import('./Preview').then((m) => m.Preview), {
    loading: AppLoading,
    ssr: false,
  }),
  blog: dynamic(() => import('./Blog').then((m) => m.Blog), {
    loading: AppLoading,
    ssr: false,
  }),
  notes: dynamic(() => import('./Notes').then((m) => m.Notes), {
    loading: AppLoading,
    ssr: false,
  }),
  calendar: dynamic(() => import('./Calendar').then((m) => m.Calendar), {
    loading: AppLoading,
    ssr: false,
  }),
  calculator: dynamic(() => import('./Calculator').then((m) => m.Calculator), {
    loading: AppLoading,
    ssr: false,
  }),
  activity: dynamic(
    () => import('./ActivityMonitor').then((m) => m.ActivityMonitor),
    {
      loading: AppLoading,
      ssr: false,
    }
  ),
  contact: dynamic(() => import('./Contact').then((m) => m.Contact), {
    loading: AppLoading,
    ssr: false,
  }),
  photos: dynamic(() => import('./Photos').then((m) => m.Photos), {
    loading: AppLoading,
    ssr: false,
  }),
  settings: dynamic(() => import('./Settings').then((m) => m.Settings), {
    loading: AppLoading,
    ssr: false,
  }),
};
