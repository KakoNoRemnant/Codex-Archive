"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./Hero.module.css";

const SCRAMBLE_SYMBOLS = Array.from(
  "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#/*+<>[]" +
    "アカサタナハマヤラワ" +
    "天地玄空未来光影" +
    "กขคงจฉชทนมยร" +
    "ΩΣΔΛΨЖФЯ",
);

type MenuLabel = "work" | "about" | "contact";

const MENU_LABELS: Record<MenuLabel, string> = {
  work: "Work",
  about: "About",
  contact: "Contact",
};

function createRandomRevealOrder(length: number) {
  return Array.from({ length }, (_, index) => index).sort(
    () => Math.random() - 0.5,
  );
}

function getRandomSymbol() {
  return SCRAMBLE_SYMBOLS[
    Math.floor(Math.random() * SCRAMBLE_SYMBOLS.length)
  ];
}

export default function Hero() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [displayTitle, setDisplayTitle] = useState("CODEX");
  const [isScrambling, setIsScrambling] = useState(false);
  const [menuLabels, setMenuLabels] = useState(MENU_LABELS);
  const [scramblingMenu, setScramblingMenu] = useState<
    Partial<Record<MenuLabel, boolean>>
  >({});
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const scrambleFrame = useRef<number | null>(null);
  const menuScrambleFrames = useRef<
    Partial<Record<MenuLabel, number>>
  >({});

  const scrambleTitle = useCallback(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    if (scrambleFrame.current !== null) {
      return;
    }

    const target = "CODEX";
    const revealOrder = createRandomRevealOrder(target.length);
    let progress = 0;

    setIsScrambling(true);
    scrambleFrame.current = window.setInterval(() => {
      const nextTitle = target
        .split("")
        .map((letter, index) => {
          if (revealOrder.indexOf(index) < Math.floor(progress)) {
            return letter;
          }

          return getRandomSymbol();
        })
        .join("");

      setDisplayTitle(nextTitle);
      progress += 0.3 + Math.random() * 0.28;

      if (progress > target.length) {
        if (scrambleFrame.current !== null) {
          window.clearInterval(scrambleFrame.current);
        }
        scrambleFrame.current = null;
        setDisplayTitle(target);
        setIsScrambling(false);
      }
    }, 55);
  }, []);

  const scrambleMenuLabel = useCallback((key: MenuLabel) => {
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      menuScrambleFrames.current[key] !== undefined
    ) {
      return;
    }

    const target = MENU_LABELS[key];
    const revealOrder = createRandomRevealOrder(target.length);
    let progress = 0;

    setScramblingMenu((current) => ({ ...current, [key]: true }));
    menuScrambleFrames.current[key] = window.setInterval(() => {
      const nextLabel = target
        .split("")
        .map((letter, index) => {
          if (revealOrder.indexOf(index) < Math.floor(progress)) {
            return letter;
          }

          return getRandomSymbol();
        })
        .join("");

      setMenuLabels((current) => ({ ...current, [key]: nextLabel }));
      progress += 0.34 + Math.random() * 0.3;

      if (progress > target.length) {
        const timer = menuScrambleFrames.current[key];

        if (timer !== undefined) {
          window.clearInterval(timer);
        }

        delete menuScrambleFrames.current[key];
        setMenuLabels((current) => ({ ...current, [key]: target }));
        setScramblingMenu((current) => ({ ...current, [key]: false }));
      }
    }, 55);
  }, []);

  function toggleTheme() {
    const dark = document.documentElement.dataset.theme !== "dark";

    document.documentElement.dataset.theme = dark ? "dark" : "light";
    sessionStorage.setItem("codex-theme", dark ? "dark" : "light");
  }

  useEffect(() => {
    if (!isMenuOpen) {
      return;
    }

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
        window.requestAnimationFrame(() => menuButtonRef.current?.focus());
      }
    }

    closeButtonRef.current?.focus();
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [isMenuOpen]);

  useEffect(() => {
    const firstScramble = window.setTimeout(scrambleTitle, 3200);
    const repeatScramble = window.setInterval(scrambleTitle, 9000);
    const menuFrames = menuScrambleFrames.current;

    return () => {
      window.clearTimeout(firstScramble);
      window.clearInterval(repeatScramble);

      if (scrambleFrame.current !== null) {
        window.clearInterval(scrambleFrame.current);
      }

      Object.values(menuFrames).forEach((timer) => {
        window.clearInterval(timer);
      });
    };
  }, [scrambleTitle]);

  return (
    <section
      className={`${styles.hero} ${isMenuOpen ? styles.menuOpen : ""}`}
      id="top"
      aria-labelledby="codex-title"
    >
      <header className={styles.topbar}>
        <span className={styles.meta}>CODEX / 2026</span>

        <div className={styles.actions}>
          <button
            ref={menuButtonRef}
            className={styles.menuButton}
            type="button"
            aria-expanded={isMenuOpen}
            aria-controls="site-menu"
            onClick={() => setIsMenuOpen(true)}
          >
            Menu
          </button>

          <button
            className={styles.themeButton}
            type="button"
            aria-label="Toggle color theme"
            onClick={toggleTheme}
          >
            <span className={styles.darkLabel}>Dark</span>
            <span className={styles.lightLabel}>Light</span>
          </button>
        </div>
      </header>

      <div className={styles.content}>
        <div className={styles.introduction}>
          <p className={styles.meta}>Design archive — 001</p>
          <p className={styles.description}>Explore creative projects.</p>
          <p className={styles.signal}>Signal / Unstable connection</p>
        </div>

        <h1
          className={styles.title}
          id="codex-title"
          aria-label="CODEX"
          onPointerEnter={scrambleTitle}
        >
          <span
            className={`${styles.titleMask} ${
              isScrambling ? styles.isScrambling : ""
            }`}
            aria-hidden="true"
          >
            {displayTitle.split("").map((letter, index) => (
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

      {isMenuOpen && (
        <div
          className={styles.menuPanel}
          id="site-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Site navigation"
        >
          <div className={styles.menuHeader}>
            <span className={styles.meta}>CODEX / Directory</span>
            <button
              ref={closeButtonRef}
              className={styles.closeButton}
              type="button"
              onClick={() => {
                setIsMenuOpen(false);
                window.requestAnimationFrame(() =>
                  menuButtonRef.current?.focus(),
                );
              }}
            >
              Close ×
            </button>
          </div>

          <nav className={styles.navigation}>
            <a
              href="#selected-work"
              onPointerEnter={() => scrambleMenuLabel("work")}
              onClick={() => setIsMenuOpen(false)}
            >
              <span className={styles.navIndex}>01</span>
              <span
                className={`${styles.navLabel} ${
                  scramblingMenu.work ? styles.isScrambling : ""
                }`}
              >
                {menuLabels.work}
              </span>
            </a>
            <a
              href="#about"
              onPointerEnter={() => scrambleMenuLabel("about")}
              onClick={() => setIsMenuOpen(false)}
            >
              <span className={styles.navIndex}>02</span>
              <span
                className={`${styles.navLabel} ${
                  scramblingMenu.about ? styles.isScrambling : ""
                }`}
              >
                {menuLabels.about}
              </span>
            </a>
            <a
              href="#contact"
              onPointerEnter={() => scrambleMenuLabel("contact")}
              onClick={() => setIsMenuOpen(false)}
            >
              <span className={styles.navIndex}>03</span>
              <span
                className={`${styles.navLabel} ${
                  scramblingMenu.contact ? styles.isScrambling : ""
                }`}
              >
                {menuLabels.contact}
              </span>
            </a>
          </nav>

          <div className={styles.menuFooter}>
            <span>Design archive</span>
            <span>Stockholm / SE</span>
          </div>
        </div>
      )}
    </section>
  );
}
