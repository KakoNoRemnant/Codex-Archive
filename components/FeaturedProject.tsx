"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import styles from "./FeaturedProject.module.css";

export default function FeaturedProject() {
  const projectRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!projectRef.current) {
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const animation = gsap.context(() => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return;
      }

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: projectRef.current,
          start: "top 85%",
          end: "top 20%",
          scrub: 0.8,
        },
      });

      timeline
        .from(`.${styles.artwork}`, {
          clipPath: "inset(12% 8% 12% 8%)",
          scale: 0.92,
          ease: "none",
        })
        .from(
          `.${styles.orbit}`,
          {
            opacity: 0,
            rotate: -45,
            scale: 0.55,
            ease: "none",
          },
          0,
        )
        .from(
          `.${styles.monogram}`,
          {
            opacity: 0,
            yPercent: 35,
            ease: "none",
          },
          0.1,
        )
        .from(
          [
            `.${styles.header}`,
            `.${styles.title}`,
            `.${styles.summary}`,
          ],
          {
            opacity: 0,
            y: 50,
            stagger: 0.08,
            ease: "none",
          },
          0.15,
        );
    }, projectRef);

    return () => animation.revert();
  }, []);

  return (
    <section
      ref={projectRef}
      className={styles.project}
      id="selected-work"
      aria-labelledby="project-one-title"
    >
      <header className={styles.header}>
        <span>Selected work / 01</span>
        <span>2026</span>
      </header>

      <Link
        className={styles.artwork}
        href="/projects/neural-form"
        aria-label="View the Neural Form project"
      >
        <span className={styles.artworkIndex}>01</span>
        <span className={styles.orbit} aria-hidden="true" />
        <span className={styles.monogram} aria-hidden="true">
          N/F
        </span>
      </Link>

      <div className={styles.details}>
        <h2 className={styles.title} id="project-one-title">
          <Link href="/projects/neural-form">Neural Form</Link>
        </h2>

        <div className={styles.summary}>
          <p>Digital identity and interactive experience.</p>
          <span>Art direction / Web design</span>
        </div>
      </div>
    </section>
  );
}
