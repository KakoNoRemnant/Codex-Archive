"use client";

import type { MouseEvent } from "react";
import styles from "./ContactFooter.module.css";

export default function ContactFooter() {
  function scrollToTop(event: MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();

    const scrollEvent = new CustomEvent("codex:scroll-to-top", {
      cancelable: true,
    });
    const needsFallback = window.dispatchEvent(scrollEvent);

    if (needsFallback) {
      window.scrollTo({
        top: 0,
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "auto"
          : "smooth",
      });
    }
  }

  return (
    <footer className={styles.contact} id="contact">
      <div className={styles.labelRow}>
        <span>Have a project in mind?</span>
        <span>Open for conversations</span>
      </div>

      <div className={styles.main}>
        <h2 className={styles.heading}>
          Let&apos;s create something worth remembering.
        </h2>

        <a
          className={styles.email}
          href="mailto:victor.promsrichan@hotmail.com"
        >
          victor.promsrichan@hotmail.com
          <span aria-hidden="true">↗</span>
        </a>
      </div>

      <div className={styles.bottom}>
        <span>CODEX / 2026</span>
        <span>Stockholm / SE</span>
        <a
          className={styles.backToTop}
          href="#top"
          onClick={scrollToTop}
        >
          <span>Back to top ↑</span>
        </a>
      </div>
    </footer>
  );
}
