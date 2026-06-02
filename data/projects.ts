/**
 * Portfolio projects. Add/edit entries here; the Projects app + Terminal
 * `projects` command render from this list.
 */
export interface Project {
  id: string;
  title: string;
  description: string;
  /** Longer detail shown in the expanded card. */
  longDescription?: string;
  tech: string[];
  github?: string;
  demo?: string;
  /** Thumbnail image URL (remote or /public path). */
  image?: string;
  featured?: boolean;
}

export const projects: Project[] = [
  {
    id: 'comfy-sloth',
    title: 'Comfy Sloth',
    description:
      'Modern, responsive e-commerce website for a furniture shop, built with React and authenticated using Auth0.',
    longDescription:
      'A full-featured furniture e-commerce experience with product listings, filtering, cart, and secure authentication via Auth0. Built to be fully responsive across devices.',
    tech: ['React', 'Auth0', 'CSS'],
    github: 'https://github.com/SaitejaKomirishetty/ECommerceWebsite',
    demo: 'https://saitejakomirishetty.github.io/ECommerceWebsite/',
    image:
      'https://raw.githubusercontent.com/SaitejaKomirishetty/ECommerceWebsite/main/Images/HomePage.png',
    featured: true,
  },
  {
    id: 'alowishus-coffee',
    title: 'Alowishus Coffee',
    description:
      'Modern, responsive website for a coffee shop, built with React, ShadCN, and Tailwind CSS.',
    longDescription:
      'A polished marketing site for a coffee brand with smooth interactions and a clean component system powered by ShadCN and Tailwind CSS.',
    tech: ['React', 'ShadCN', 'Tailwind CSS'],
    github: 'https://github.com/SaitejaKomirishetty/coffee-website',
    demo: 'https://saitejakomirishetty.github.io/coffee-website/',
    image:
      'https://raw.githubusercontent.com/SaitejaKomirishetty/coffee-website/main/Images/home.png.png',
    featured: true,
  },
  {
    id: 'note-taking-app',
    title: 'Note Taking App',
    description:
      'Simple yet powerful note-taking application built with React and React Router, with full CRUD and local-storage persistence.',
    longDescription:
      'Create, read, update, and delete notes with client-side routing and persistence to local storage so your notes survive refreshes.',
    tech: ['React', 'React Router'],
    github: 'https://github.com/SaitejaKomirishetty/Note-taking-app',
    demo: 'https://saitejakomirishetty.github.io/Note-taking-app/',
    image:
      'https://raw.githubusercontent.com/SaitejaKomirishetty/Note-taking-app/main/Images/ViewNote.png',
  },
  {
    id: 'hangman',
    title: 'Hangman',
    description:
      'Classic Hangman word game built with React — guess letters to complete the word before running out of tries.',
    longDescription:
      'Players guess letters to reveal the hidden word. Win by completing the word, or lose after six incorrect guesses. A fun exercise in React state management.',
    tech: ['React'],
    github: 'https://github.com/SaitejaKomirishetty/Hangman',
    demo: 'https://saitejakomirishetty.github.io/Hangman/',
    image:
      'https://raw.githubusercontent.com/SaitejaKomirishetty/Hangman/main/Images/image.png',
  },
];
