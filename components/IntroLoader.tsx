"use client";

import { useEffect, useState } from "react";
import styles from "./IntroLoader.module.css";

export default function IntroLoader() {
  const [shouldPlay, setShouldPlay] = useState<boolean | null>(null);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const hasPlayed = sessionStorage.getItem("codex-intro-seen") === "true";

      if (!hasPlayed) {
        const resetEvent = new CustomEvent("codex:scroll-reset", {
          cancelable: true,
        });
        const needsFallback = window.dispatchEvent(resetEvent);

        if (needsFallback) {
          window.scrollTo(0, 0);
        }
      }

      document.documentElement.dataset.intro = hasPlayed ? "seen" : "playing";
      setShouldPlay(!hasPlayed);
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (shouldPlay !== true) {
      return;
    }

    const root = document.documentElement;
    const previousRootOverflow = root.style.overflow;
    const previousBodyOverflow = document.body.style.overflow;

    root.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    window.dispatchEvent(
      new CustomEvent("codex:scroll-lock", { detail: true }),
    );

    return () => {
      root.style.overflow = previousRootOverflow;
      document.body.style.overflow = previousBodyOverflow;
      window.dispatchEvent(
        new CustomEvent("codex:scroll-lock", { detail: false }),
      );
    };
  }, [shouldPlay]);

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
      <div className={styles.panels} aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
      </div>

      <div className={styles.header}>
        <span>CODEX</span>
        <span>System / 001</span>
      </div>

      <div className={styles.center}>
        <p className={styles.wordmark}>
          {"CODEX".split("").map((letter, index) => (
            <span key={index}>{letter}</span>
          ))}
        </p>

        <div className={styles.track}>
          <span className={styles.progress} />
          <span className={styles.marker} />
        </div>
      </div>

      <div className={styles.status}>
        <span>Compiling visual index</span>
        <span>Ready / Enter</span>
      </div>
    </div>
  );
}
