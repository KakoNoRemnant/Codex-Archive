"use client";

import { useState } from "react";
import styles from "./IntroLoader.module.css";

export default function IntroLoader() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) {
    return null;
  }

  return (
    <div
      className={styles.loader}
      aria-hidden="true"
      onAnimationEnd={(event) => {
        if (event.currentTarget === event.target) {
          setIsVisible(false);
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
