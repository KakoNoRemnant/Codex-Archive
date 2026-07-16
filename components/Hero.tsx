"use client";

import { useEffect, useRef } from "react";
import styles from "./Hero.module.css";

export default function Hero() {
  const themeButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const savedTheme = sessionStorage.getItem("codex-theme");
    const dark = savedTheme === "dark";

    document.documentElement.dataset.theme = dark ? "dark" : "light";
    if (themeButton.current) {
      themeButton.current.textContent = dark ? "Light" : "Dark";
      themeButton.current.setAttribute("aria-pressed", String(dark));
    }
  }, []);

  function toggleTheme() {
    const dark = document.documentElement.dataset.theme !== "dark";

    document.documentElement.dataset.theme = dark ? "dark" : "light";
    sessionStorage.setItem("codex-theme", dark ? "dark" : "light");
    if (themeButton.current) {
      themeButton.current.textContent = dark ? "Light" : "Dark";
      themeButton.current.setAttribute("aria-pressed", String(dark));
    }
  }

  return (
    <section className={styles.hero} aria-labelledby="codex-title">
      <header className={styles.topbar}>
        <span className={styles.meta}>CODEX / 2026</span>
        <button
          ref={themeButton}
          className={styles.themeButton}
          type="button"
          aria-pressed="false"
          onClick={toggleTheme}
        >
          Dark
        </button>
      </header>

      <div className={styles.content}>
        <div className={styles.introduction}>
          <p className={styles.meta}>Design archive — 001</p>
          <p className={styles.description}>Explore creative projects.</p>
        </div>

        <h1 className={styles.title} id="codex-title" aria-label="CODEX">
          <span className={styles.titleMask} aria-hidden="true">
            {"CODEX".split("").map((letter, index) => (
              <span className={styles.titleLetter} key={index}>
                {letter}
              </span>
            ))}
          </span>
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
