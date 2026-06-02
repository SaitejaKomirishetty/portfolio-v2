/**
 * Core profile / identity content.
 * Edit this file to update your name, bio, taglines, and quick facts.
 */
import { socials } from './socials';

export interface Profile {
  name: string;
  /** Primary headline role, e.g. "Frontend Developer". */
  role: string;
  /** Current job title, used in About / experience contexts. */
  currentTitle: string;
  /** Short one-liner tagline shown on the login screen / hero. */
  tagline: string;
  /** Longer bio paragraph(s). */
  bio: string;
  about: string[];
  location: string;
  /** Path to avatar in /public. */
  avatar: string;
  /** Canonical site URL for SEO / metadata. */
  siteUrl: string;
  email: string;
  /** Resume PDF path in /public. */
  resume: string;
  keywords: string[];
  /** Quick facts surfaced in the About app. */
  quickFacts: { label: string; value: string }[];
  /** Personal interests (mentioned in bio). */
  interests: string[];
  socials: typeof socials;
}

export const profile: Profile = {
  name: 'Saiteja Komirishetty',
  role: 'Frontend Developer',
  currentTitle: 'Software Engineer',
  tagline: 'I craft elegant, user-centric web experiences.',
  bio: "Frontend developer passionate about crafting elegant and user-centric web experiences with React, Next.js, and TypeScript.",
  about: [
    "I'm a passionate front-end developer focused on crafting elegant and user-centric web experiences. I specialize in React, Next.js, and TypeScript to build dynamic, performant applications.",
    'Currently a Software Engineer at Torry Harris Integration Solutions in Bengaluru, where I optimize performance, lead code reviews, and mentor junior developers.',
    'Outside of code, I follow Formula 1 racing and enjoy bike riding for mental clarity.',
  ],
  location: 'Bengaluru, Karnataka, India',
  // TODO: add a real avatar image to /public/avatar.jpg (square, ~512px).
  avatar: '/avatar.jpg',
  siteUrl: 'https://saitejakomirishetty.com',
  email: 'komirishettysaiteja@gmail.com',
  // TODO: drop your CV at /public/resume.pdf to enable the Preview (Resume) app.
  resume: '/resume.pdf',
  keywords: [
    'Saiteja Komirishetty',
    'Frontend Developer',
    'React Developer',
    'Next.js',
    'TypeScript',
    'Web Developer',
    'Portfolio',
    'Bengaluru',
  ],
  quickFacts: [
    { label: 'Role', value: 'Software Engineer' },
    { label: 'Company', value: 'Torry Harris Integration Solutions' },
    { label: 'Location', value: 'Bengaluru, India' },
    { label: 'Focus', value: 'React · Next.js · TypeScript' },
    { label: 'Experience', value: '3+ years' },
  ],
  interests: ['Formula 1', 'Bike riding', 'Web performance', 'UI/UX'],
  socials,
};
