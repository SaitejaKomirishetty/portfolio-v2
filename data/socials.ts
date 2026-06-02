/**
 * Social + contact links. Edit URLs here to update them everywhere.
 */
export interface SocialLink {
  id: string;
  label: string;
  url: string;
  /** Username/handle for display. */
  handle?: string;
}

export const socials = {
  email: 'komirishettysaiteja@gmail.com',
  github: 'https://github.com/SaitejaKomirishetty',
  linkedin: 'https://www.linkedin.com/in/saiteja-komirishetty',
  twitter: 'https://x.com/SAITEJAKOMIRIS1',
  twitterHandle: '@SAITEJAKOMIRIS1',
  instagram: 'https://www.instagram.com/saitejakomirishetty/',
};

export const socialLinks: SocialLink[] = [
  {
    id: 'github',
    label: 'GitHub',
    url: socials.github,
    handle: 'SaitejaKomirishetty',
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    url: socials.linkedin,
    handle: 'saiteja-komirishetty',
  },
  {
    id: 'twitter',
    label: 'X (Twitter)',
    url: socials.twitter,
    handle: socials.twitterHandle,
  },
  {
    id: 'instagram',
    label: 'Instagram',
    url: socials.instagram,
    handle: 'saitejakomirishetty',
  },
  {
    id: 'email',
    label: 'Email',
    url: `mailto:${socials.email}`,
    handle: socials.email,
  },
];
