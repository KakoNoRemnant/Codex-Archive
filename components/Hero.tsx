import styles from "./Hero.module.css";

export default function Hero() {
  return (
    <section className={styles.hero} aria-labelledby="codex-title">
      <header className={styles.topbar}>
        <span className={styles.meta}>CODEX / 2026</span>
        <button className={styles.menu} type="button">
          Menu
        </button>
      </header>

      <div className={styles.content}>
        <div className={styles.introduction}>
          <p className={styles.meta}>Design archive — 001</p>
          <p className={styles.description}>Explore creative projects.</p>
        </div>

        <h1 className={styles.title} id="codex-title">
          CODEX
        </h1>
      </div>

      <footer className={styles.footer}>
        <span className={styles.meta}>Scroll to explore</span>
        <span className={`${styles.meta} ${styles.location}`}>
          Stockholm / SE
        </span>
      </footer>
    </section>
  );
}
