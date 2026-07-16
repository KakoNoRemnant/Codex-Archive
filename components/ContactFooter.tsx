import styles from "./ContactFooter.module.css";

export default function ContactFooter() {
  return (
    <footer className={styles.contact}>
      <div className={styles.labelRow}>
        <span>Have a project in mind?</span>
        <span>Open for conversations</span>
      </div>

      <div className={styles.main}>
        <h2 className={styles.heading}>
          Let&apos;s create something worth remembering.
        </h2>

        <a className={styles.email} href="mailto:hello@yourdomain.com">
          victor.promsrichan@hotmail.com
          <span aria-hidden="true">↗</span>
        </a>
      </div>

      <div className={styles.bottom}>
        <span>CODEX / 2026</span>
        <span>Stockholm / SE</span>
        <a href="#top">Back to top ↑</a>
      </div>
    </footer>
  );
}
