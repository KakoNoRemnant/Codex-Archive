export type Project = {
  number: string;
  slug: string;
  title: string;
  category: string;
  year: string;
  summary: string;
  featured?: boolean;
  visual: "empty" | "neural" | "signal" | "terminal" | "material";
  image?: {
    src: string;
    alt: string;
  };
  media?: ProjectMedia[];
};

export type ProjectMedia = {
  type: "image" | "video";
  src: string;
  alt: string;
  poster?: string;
};

export const projects: Project[] = [
  {
    number: "01",
    slug: "art-work",
    title: "Art Work",
    category: "Art direction / Visual study",
    year: "2026",
    summary:
      "An evolving visual study reserved for new artwork, material experiments, and future digital compositions.",
    featured: true,
    visual: "empty",
  },
  {
    number: "02",
    slug: "signal-studies",
    title: "Signal Studies",
    category: "Interactive experiment",
    year: "2026",
    summary:
      "A study of responsive signals, modular typography, and interfaces that react to changing digital environments.",
    visual: "signal",
  },
  {
    number: "03",
    slug: "terminal-objects",
    title: "Terminal Objects",
    category: "Digital identity",
    year: "2025",
    summary:
      "A visual identity system inspired by machine interfaces, physical tools, and the language of technical documentation.",
    visual: "terminal",
  },
  {
    number: "04",
    slug: "material-memory",
    title: "Material Memory",
    category: "Art direction",
    year: "2025",
    summary:
      "An experimental archive exploring how digital surfaces can preserve texture, time, and traces of human interaction.",
    visual: "material",
  },
];

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}

export function getNextProject(slug: string) {
  const currentIndex = projects.findIndex((project) => project.slug === slug);

  if (currentIndex === -1) {
    return projects[0];
  }

  return projects[(currentIndex + 1) % projects.length];
}

export const archiveProjects = projects.filter((project) => !project.featured);
