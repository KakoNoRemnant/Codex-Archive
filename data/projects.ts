export type Project = {
  number: string;
  slug: string;
  title: string;
  category: string;
  year: string;
  summary: string;
};

export const projects: Project[] = [
  {
    number: "02",
    slug: "signal-studies",
    title: "Signal Studies",
    category: "Interactive experiment",
    year: "2026",
    summary:
      "A study of responsive signals, modular typography, and interfaces that react to changing digital environments.",
  },
  {
    number: "03",
    slug: "terminal-objects",
    title: "Terminal Objects",
    category: "Digital identity",
    year: "2025",
    summary:
      "A visual identity system inspired by machine interfaces, physical tools, and the language of technical documentation.",
  },
  {
    number: "04",
    slug: "material-memory",
    title: "Material Memory",
    category: "Art direction",
    year: "2025",
    summary:
      "An experimental archive exploring how digital surfaces can preserve texture, time, and traces of human interaction.",
  },
];

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}
