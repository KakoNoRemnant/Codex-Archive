"use client";

import { useEffect, useState } from "react";
import styles from "./IntroLoader.module.css";

export default function IntroLoader() {
  const [shouldPlay, setShouldPlay] = useState<boolean | null>(null);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const hasPlayed = sessionStorage.getItem("codex-intro-seen") === "true";

      document.documentElement.dataset.intro = hasPlayed ? "seen" : "playing";
      setShouldPlay(!hasPlayed);
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  if (shouldPlay !== true) {
    return null;
  }

  return (
    <div
      className={styles.loader}
      aria-hidden="true"
      onAnimationEnd={(event) => {
        if (event.currentTarget === event.target) {
          sessionStorage.setItem("codex-intro-seen", "true");
          setShouldPlay(false);
        }
      }}
    >
      <div className={styles.header}>
        <span>CODEX</span>
        <span>Design archive</span>
      </div>

      <div className={styles.center}>
        <p className={styles.wordmark}>CODEX</p>
        <div className={styles.track}>
          <span className={styles.progress} />
        </div>
      </div>

      <p className={styles.status}>Loading archive</p>
    </div>
  );
}
