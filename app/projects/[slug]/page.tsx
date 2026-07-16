import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getNextProject, getProject, projects } from "@/data/projects";
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
    title: project.title,
    description: project.summary,
    openGraph: {
      title: `${project.title} — CODEX`,
      description: project.summary,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: `${project.title} — CODEX`,
      description: project.summary,
    },
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const project = getProject((await params).slug);

  if (!project) {
    notFound();
  }

  const nextProject = getNextProject(project.slug);
  const artworkStyle = {
    neural: styles.neural,
    signal: styles.signal,
    terminal: styles.terminal,
    material: styles.material,
  }[project.visual];

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

      <div
        className={`${styles.artwork} ${artworkStyle} ${
          project.image ? styles.hasImage : ""
        }`}
        aria-hidden={project.image ? undefined : true}
      >
        {project.image ? (
          <>
            <Image
              className={styles.projectImage}
              src={project.image.src}
              alt={project.image.alt}
              fill
              sizes="(max-width: 700px) 100vw, 95vw"
            />
            <span
              className={`${styles.glitchLayer} ${styles.glitchLayerOne}`}
              style={{ backgroundImage: `url(${project.image.src})` }}
            />
            <span
              className={`${styles.glitchLayer} ${styles.glitchLayerTwo}`}
              style={{ backgroundImage: `url(${project.image.src})` }}
            />
          </>
        ) : (
          <>
            <span>{project.number}</span>
            <div className={styles.visual}>
              <span className={styles.shapeOne} />
              <span className={styles.shapeTwo} />
              <span className={styles.shapeThree} />
            </div>
          </>
        )}
      </div>

      <section className={styles.information} aria-label="Project information">
        <p>Project study / {project.year}</p>
        <p className={styles.summary}>{project.summary}</p>
      </section>

      <section className={styles.nextProject}>
        <p>Next project / {nextProject.number}</p>
        <Link href={`/projects/${nextProject.slug}`}>
          <span>{nextProject.title}</span>
          <span aria-hidden="true">→</span>
        </Link>
      </section>

      <footer className={styles.footer}>
        <span>CODEX / Design archive</span>
        <Link href="/#contact">Start a conversation ↗</Link>
      </footer>
    </main>
  );
}
