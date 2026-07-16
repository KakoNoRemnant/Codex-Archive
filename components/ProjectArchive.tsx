import styles from "./ProjectArchive.module.css";

const projects = [
  {
    number: "02",
    title: "Signal Studies",
    category: "Interactive experiment",
    year: "2026",
  },
  {
    number: "03",
    title: "Terminal Objects",
    category: "Digital identity",
    year: "2025",
  },
  {
    number: "04",
    title: "Material Memory",
    category: "Art direction",
    year: "2025",
  },
];

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
          <article className={styles.row} key={project.number}>
            <span className={styles.number}>{project.number}</span>
            <h3 className={styles.title}>{project.title}</h3>
            <p className={styles.category}>{project.category}</p>
            <span className={styles.year}>{project.year}</span>
            <span className={styles.arrow} aria-hidden="true">
              ↗
            </span>
          </article>
        ))}
      </div>
    </section>
  );
}
