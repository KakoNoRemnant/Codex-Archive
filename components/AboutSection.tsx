import styles from "./AboutSection.module.css";

const capabilities = [
  "Creative development",
  "Digital art direction",
  "Interaction design",
  "Motion systems",
];

export default function AboutSection() {
  return (
    <section className={styles.about} aria-labelledby="about-title">
      <header className={styles.header}>
        <span>About CODEX</span>
        <span>Independent / Digital</span>
      </header>

      <h2 className={styles.statement} id="about-title">
        A digital archive exploring identity, interaction, and motion.
      </h2>

      <div className={styles.information}>
        <p className={styles.description}>
          CODEX collects experimental projects shaped by clear ideas, precise
          typography, and technology. Each work is a study in how digital
          experiences can feel distinctive without becoming complicated.
        </p>

        <div className={styles.capabilities}>
          <p className={styles.label}>Capabilities</p>
          <ul>
            {capabilities.map((capability) => (
              <li key={capability}>{capability}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
