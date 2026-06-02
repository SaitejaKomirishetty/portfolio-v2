/**
 * Skills / tech stack, grouped by category.
 * Edit groups and items freely; the About + Terminal apps render from here.
 */
export interface SkillGroup {
  category: string;
  items: string[];
}

export const skills: SkillGroup[] = [
  {
    category: 'Languages',
    items: ['HTML', 'CSS', 'JavaScript', 'TypeScript'],
  },
  {
    category: 'Frameworks & Libraries',
    items: ['React', 'Next.js', 'Redux', 'Express.js'],
  },
  {
    category: 'Styling',
    items: ['Tailwind CSS', 'Bootstrap', 'Ant Design', 'ShadCN'],
  },
  {
    category: 'Testing',
    items: ['Cypress'],
  },
  {
    category: 'Backend & Database',
    items: ['Node.js', 'MySQL'],
  },
  {
    category: 'Cloud & DevOps',
    items: ['AWS', 'Terraform'],
  },
  {
    category: 'Version Control',
    items: ['Git', 'GitHub', 'GitLab'],
  },
];

/** Flattened list, handy for the Terminal `skills` command. */
export const allSkills = skills.flatMap((g) => g.items);
