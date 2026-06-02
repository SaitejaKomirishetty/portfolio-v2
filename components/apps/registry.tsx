'use client';

import type { ComponentType } from 'react';
import type { AppId } from '@/data/apps';
import { About } from './About';
import { Terminal } from './Terminal';
import { Projects } from './Projects';
import { Preview } from './Preview';
import { Blog } from './Blog';
import { Contact } from './Contact';
import { Photos } from './Photos';
import { Settings } from './Settings';

/** Maps each AppId to the React component rendered inside its window. */
export const appComponents: Record<AppId, ComponentType> = {
  about: About,
  terminal: Terminal,
  projects: Projects,
  resume: Preview,
  blog: Blog,
  contact: Contact,
  photos: Photos,
  settings: Settings,
};
