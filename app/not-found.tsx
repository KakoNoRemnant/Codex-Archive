import Link from "next/link";
import styles from "./not-found.module.css";

export default function NotFound() {
  return (
    <main className={styles.page} id="main-content">
      <header className={styles.header}>
        <span>CODEX / Error</span>
        <span>Page not found</span>
      </header>

      <div className={styles.center}>
        <p className={styles.code}>404</p>
        <h1>This page left the archive.</h1>
        <Link className={styles.link} href="/">
          Return home <span aria-hidden="true">→</span>
        </Link>
      </div>

      <footer className={styles.footer}>
        <span>Design archive</span>
        <span>Stockholm / SE</span>
      </footer>
    </main>
  );
}
