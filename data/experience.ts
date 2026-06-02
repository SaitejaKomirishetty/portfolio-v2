/**
 * Work experience + education timelines.
 */
export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  location: string;
  start: string;
  end: string;
  /** Bullet-point highlights. */
  highlights: string[];
  tech: string[];
}

export interface EducationItem {
  id: string;
  degree: string;
  institution: string;
  start?: string;
  end?: string;
  note?: string;
}

export const experience: ExperienceItem[] = [
  {
    id: 'the-se',
    role: 'Software Engineer',
    company: 'Torry Harris Integration Solutions',
    location: 'Bengaluru, Karnataka',
    start: 'Jan 2025',
    end: 'Present',
    highlights: [
      'Optimized application performance, achieving 30–40% faster load times.',
      'Led code reviews that reduced production bugs by ~25%.',
      'Managed a 5-person developer team and mentored junior engineers.',
    ],
    tech: ['React', 'JavaScript', 'Tailwind CSS', 'Node.js'],
  },
  {
    id: 'the-ase',
    role: 'Associate Software Engineer',
    company: 'Torry Harris Integration Solutions',
    location: 'Bengaluru, Karnataka',
    start: 'Feb 2024',
    end: 'Dec 2024',
    highlights: [
      'Built responsive UIs and reduced development time by ~15%.',
      'Added multilingual (i18n) support to applications.',
      'Resolved defects, cutting outstanding bugs by ~35%.',
    ],
    tech: ['React', 'JavaScript', 'Tailwind CSS', 'Redux'],
  },
  {
    id: 'the-trainee',
    role: 'Associate Software Engineer — Trainee',
    company: 'Torry Harris Integration Solutions',
    location: 'Bengaluru, Karnataka',
    start: 'Aug 2023',
    end: 'Feb 2024',
    highlights: [
      'Focused on React development and REST API integration.',
      'Contributed to performance optimization initiatives.',
    ],
    tech: ['React', 'JavaScript', 'REST APIs'],
  },
  {
    id: 'ltim-intern',
    role: 'Intern',
    company: 'LTIMindtree',
    location: 'Remote',
    start: 'Feb 2023',
    end: 'May 2023',
    highlights: [
      'Built Java/C++ applications and deployed to AWS (EC2, S3).',
      'Automated infrastructure provisioning with Terraform.',
    ],
    tech: ['AWS', 'Terraform', 'Java', 'C++'],
  },
];

// TODO: Add your formal education details (degree, institution, years).
export const education: EducationItem[] = [
  {
    id: 'degree-todo',
    degree: 'TODO: Degree (e.g. B.Tech in Computer Science)',
    institution: 'TODO: University / College name',
    note: 'Update data/experience.ts with your real education details.',
  },
];
