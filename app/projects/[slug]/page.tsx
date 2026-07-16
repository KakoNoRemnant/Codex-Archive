import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProject, projects } from "@/data/projects";
import styles from "./page.module.css";

type ProjectPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return projects.map((project) => ({
    slug: project.slug,
  }));
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const project = getProject((await params).slug);

  if (!project) {
    return {};
  }

  return {
    title: `${project.title} — CODEX`,
    description: project.summary,
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const project = getProject((await params).slug);

  if (!project) {
    notFound();
  }

  return (
    <main className={styles.page} id="main-content">
      <header className={styles.header}>
        <Link href="/#selected-work">← Back to archive</Link>
        <span>
          {project.number} / {project.year}
        </span>
      </header>

      <section className={styles.hero}>
        <p className={styles.category}>{project.category}</p>
        <h1>{project.title}</h1>
      </section>

      <div className={styles.artwork} aria-hidden="true">
        <span>{project.number}</span>
        <div className={styles.disc} />
      </div>

      <section className={styles.information} aria-label="Project information">
        <p>Project study / {project.year}</p>
        <p className={styles.summary}>{project.summary}</p>
      </section>

      <footer className={styles.footer}>
        <span>CODEX / Design archive</span>
        <Link href="/#contact">Start a conversation ↗</Link>
      </footer>
    </main>
  );
}
