import Link from "next/link";
import { projects } from "@/data/projects";
import styles from "./ProjectArchive.module.css";

export default function ProjectArchive() {
  return (
    <section className={styles.archive} aria-labelledby="archive-title">
      <header className={styles.header}>
        <p>Archive index</p>
        <p>2025 — 2026</p>
      </header>

      <h2 className={styles.heading} id="archive-title">
        More projects
      </h2>

      <div className={styles.list}>
        {projects.map((project) => (
          <Link
            className={styles.row}
            href={`/projects/${project.slug}`}
            key={project.number}
          >
            <span className={styles.number}>{project.number}</span>
            <h3 className={styles.title}>{project.title}</h3>
            <p className={styles.category}>{project.category}</p>
            <span className={styles.year}>{project.year}</span>
            <span className={styles.arrow} aria-hidden="true">
              ↗
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
